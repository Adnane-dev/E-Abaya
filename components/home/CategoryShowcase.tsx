import Image from "next/image";
import Link from "next/link";

const categories = [
  {
    name: "Abayas",
    href: "/category/abayas",
    image:
      "https://images.unsplash.com/photo-1581699493950-93b28d59afae?q=80&w=800",
    alt: "Elegant abayas on display",
  },
  {
    name: "Hijabs",
    href: "/category/hijabs",
    image:
      "https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?q=80&w=800",
    alt: "Variety of colorful hijabs",
  },
  {
    name: "Kaftans",
    href: "/category/kaftans",
    image:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=800",
    alt: "Beautiful kaftans for every occasion",
  },
];

export function CategoryShowcase() {
  return (
    <div className="bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          Shop by Category
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="relative group rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
              aria-label={`Shop ${category.name}`}
            >
              <div className="relative h-64 w-full">
                <Image
                  src={category.image}
                  alt={category.alt}
                  layout="fill"
                  objectFit="cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 300px"
                  priority
                />
                <div className="absolute inset-0 bg-gray-900 bg-opacity-30 group-hover:bg-opacity-50 transition duration-300"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white group-hover:text-primary transition duration-300">
                    {category.name}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
