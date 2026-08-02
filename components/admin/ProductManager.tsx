"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Search, Edit2, Trash2, X, Upload, ArrowUpDown } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { slugify } from "@/lib/slug";
import { Product } from "@/types/product";

interface Category {
  id: number;
  name: string;
  slug: string;
}

type SortKey = "name" | "category" | "price";

type ProductFormState = {
  name: string;
  price: string;
  discountPercent: string;
  category: string;
  description: string;
  material: string;
  brand: string;
  sizes: string;
  colors: string;
  inStock: boolean;
  isNew: boolean;
  image: string;
};

const EMPTY_FORM: ProductFormState = {
  name: "",
  price: "",
  discountPercent: "0",
  category: "",
  description: "",
  material: "",
  brand: "",
  sizes: "",
  colors: "",
  inStock: true,
  isNew: false,
  image: "",
};

interface ProductManagerProps {
  /** null = admin's own direct catalog (not tied to any vendor shop). */
  shopId: number | null;
}

export function ProductManager({ shopId }: ProductManagerProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: "asc" | "desc" }>({
    key: "name",
    direction: "asc",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ProductFormState>(EMPTY_FORM);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const supabase = createClient();

  async function loadProducts() {
    setIsLoading(true);
    let query = supabase.from("products").select("*").order("name");
    query = shopId === null ? query.is("shop_id", null) : query.eq("shop_id", shopId);
    const { data } = await query;
    setProducts((data as Product[]) ?? []);
    setIsLoading(false);
  }

  async function loadCategories() {
    const { data } = await supabase.from("categories").select("id, name, slug").order("name");
    setCategories((data as Category[]) ?? []);
  }

  useEffect(() => {
    loadProducts();
  }, [shopId]);

  useEffect(() => {
    loadCategories();
  }, []);

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = searchTerm
        ? product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (product.brand ?? "").toLowerCase().includes(searchTerm.toLowerCase())
        : true;
      const matchesCategory = selectedCategory === "all" ? true : product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortConfig.direction === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
      }
      return 0;
    });

  function handleSort(key: SortKey) {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  }

  function openCreateModal() {
    setEditingId(null);
    setForm({ ...EMPTY_FORM, category: categories[0]?.name ?? "" });
    setIsModalOpen(true);
  }

  function openEditModal(product: Product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      price: String(product.price),
      discountPercent: String(product.discount_percent ?? 0),
      category: product.category,
      description: product.description ?? "",
      material: product.material ?? "",
      brand: product.brand ?? "",
      sizes: (product.sizes ?? []).join(", "),
      colors: (product.colors ?? []).join(", "),
      inStock: product.in_stock,
      isNew: product.is_new ?? false,
      image: product.image,
    });
    setIsModalOpen(true);
  }

  async function handleAddCategory() {
    const name = newCategoryName.trim();
    if (!name) return;

    const { error } = await supabase.from("categories").insert({ name, slug: slugify(name) });
    if (error) {
      toast.error("Erreur lors de la création de la collection : " + error.message);
      return;
    }

    toast.success("Nouvelle collection ajoutée.");
    setNewCategoryName("");
    setIsAddingCategory(false);
    await loadCategories();
    setForm((prev) => ({ ...prev, category: name }));
  }

  async function uploadImage(file: File) {
    setIsUploading(true);
    const path = `${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("product-images").upload(path, file);
    if (error) {
      toast.error("Échec de l'envoi de l'image : " + error.message);
      setIsUploading(false);
      return;
    }
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    setForm((prev) => ({ ...prev, image: data.publicUrl }));
    setIsUploading(false);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadImage(file);
  }

  async function handleSave() {
    if (!form.name || !form.price || !form.category) {
      toast.error("Merci de remplir les champs obligatoires.");
      return;
    }

    const payload = {
      name: form.name,
      price: Number(form.price),
      discount_percent: Math.min(100, Math.max(0, Number(form.discountPercent) || 0)),
      category: form.category,
      description: form.description,
      material: form.material,
      brand: form.brand,
      sizes: form.sizes.split(",").map((s) => s.trim()).filter(Boolean),
      colors: form.colors.split(",").map((c) => c.trim()).filter(Boolean),
      in_stock: form.inStock,
      is_new: form.isNew,
      image: form.image || "/images/placeholder.jpg",
      shop_id: shopId,
    };

    if (editingId) {
      const { error } = await supabase.from("products").update(payload).eq("id", editingId);
      if (error) {
        toast.error("Erreur lors de la mise à jour : " + error.message);
        return;
      }
      toast.success("Produit mis à jour.");
    } else {
      const { error } = await supabase.from("products").insert(payload);
      if (error) {
        toast.error("Erreur lors de la création : " + error.message);
        return;
      }
      toast.success("Produit ajouté.");
    }

    setIsModalOpen(false);
    loadProducts();
  }

  async function handleDelete(productId: number) {
    if (!window.confirm("Supprimer ce produit ?")) return;
    const { error } = await supabase.from("products").delete().eq("id", productId);
    if (error) {
      toast.error("Erreur lors de la suppression : " + error.message);
      return;
    }
    toast.success("Produit supprimé.");
    loadProducts();
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-serif text-2xl font-bold text-foreground">Gestion des produits</h1>
        <button
          onClick={openCreateModal}
          className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un produit
        </button>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-border rounded-lg bg-background focus:ring-2 focus:ring-accent focus:border-transparent"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border border-border rounded-lg bg-background"
        >
          <option value="all">Toutes les catégories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.name}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted border-b border-border">
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  <button className="flex items-center space-x-1" onClick={() => handleSort("name")}>
                    <span>Produit</span>
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  <button className="flex items-center space-x-1" onClick={() => handleSort("category")}>
                    <span>Catégorie</span>
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  <button className="flex items-center space-x-1" onClick={() => handleSort("price")}>
                    <span>Prix</span>
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    Chargement…
                  </td>
                </tr>
              )}
              {!isLoading && filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    Aucun produit — ajoutez le premier avec le bouton ci-dessus.
                  </td>
                </tr>
              )}
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-muted/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-14 w-14 rounded-lg object-cover bg-muted flex-shrink-0"
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-foreground">{product.name}</div>
                        <div className="text-sm text-muted-foreground">{product.brand}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-secondary text-secondary-foreground">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {product.price.toLocaleString("fr-FR")} CFA
                    {(product.discount_percent ?? 0) > 0 && (
                      <span className="ml-2 text-xs text-accent font-semibold">-{product.discount_percent}%</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.in_stock ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
                      }`}
                    >
                      {product.in_stock ? "En stock" : "Rupture"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      className="text-accent hover:text-accent/80 mx-2"
                      onClick={() => openEditModal(product)}
                      aria-label="Modifier"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      className="text-destructive hover:text-destructive/80 mx-2"
                      onClick={() => handleDelete(product.id)}
                      aria-label="Supprimer"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-border">
              <h2 className="font-serif text-xl font-bold text-foreground">
                {editingId ? "Modifier le produit" : "Ajouter un produit"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center ${
                  dragActive ? "border-accent bg-accent/5" : "border-border"
                }`}
                onDragEnter={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => e.target.files && uploadImage(e.target.files[0])}
                />
                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                  <Upload className="w-10 h-10 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">
                    {isUploading ? "Envoi en cours…" : "Glissez une photo ou cliquez pour en choisir une"}
                  </span>
                </label>
                {form.image && (
                  <img src={form.image} alt="Aperçu" className="mt-4 h-32 w-32 object-cover rounded-lg mx-auto" />
                )}
              </div>

              <input
                type="text"
                placeholder="Nom du produit"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-accent"
              />

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Prix (CFA)"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-accent"
                />
                <input
                  type="number"
                  min={0}
                  max={100}
                  placeholder="Réduction (%)"
                  value={form.discountPercent}
                  onChange={(e) => setForm({ ...form, discountPercent: e.target.value })}
                  className="px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-accent"
                />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="flex-1 px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-accent"
                  >
                    {categories.length === 0 && <option value="">Aucune collection</option>}
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setIsAddingCategory((v) => !v)}
                    className="px-3 py-2 border border-border rounded-lg text-sm text-accent hover:bg-muted whitespace-nowrap"
                  >
                    + Collection
                  </button>
                </div>
                {isAddingCategory && (
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Nom de la nouvelle collection"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      className="flex-1 px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-accent"
                    />
                    <button
                      type="button"
                      onClick={handleAddCategory}
                      className="px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90"
                    >
                      Créer
                    </button>
                  </div>
                )}
              </div>

              <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-accent"
                rows={3}
              />

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Matière"
                  value={form.material}
                  onChange={(e) => setForm({ ...form, material: e.target.value })}
                  className="px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-accent"
                />
                <input
                  type="text"
                  placeholder="Marque"
                  value={form.brand}
                  onChange={(e) => setForm({ ...form, brand: e.target.value })}
                  className="px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-accent"
                />
              </div>

              <input
                type="text"
                placeholder="Tailles (ex : S, M, L)"
                value={form.sizes}
                onChange={(e) => setForm({ ...form, sizes: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-accent"
              />
              <input
                type="text"
                placeholder="Couleurs (ex : Black, Beige)"
                value={form.colors}
                onChange={(e) => setForm({ ...form, colors: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-accent"
              />

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm text-foreground">
                  <input
                    type="checkbox"
                    checked={form.inStock}
                    onChange={(e) => setForm({ ...form, inStock: e.target.checked })}
                  />
                  En stock
                </label>
                <label className="flex items-center gap-2 text-sm text-foreground">
                  <input
                    type="checkbox"
                    checked={form.isNew}
                    onChange={(e) => setForm({ ...form, isNew: e.target.checked })}
                  />
                  Nouveauté
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-2 p-6 border-t border-border">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                {editingId ? "Enregistrer" : "Ajouter"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
