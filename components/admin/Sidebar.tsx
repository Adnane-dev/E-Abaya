import Link from "next/link";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  Settings,
  Package,
  FileText,
  BarChart
} from "lucide-react";

export function Sidebar() {
  return (
    <div className="w-64 bg-white border-r h-full">
      <div className="p-6">
        <h1 className="text-xl font-bold">Admin Panel</h1>
      </div>
      <nav className="space-y-1">
        <NavItem href="/admin" icon={LayoutDashboard}>Dashboard</NavItem>
        <NavItem href="/admin/products" icon={Package}>Products</NavItem>
        <NavItem href="/admin/orders" icon={ShoppingBag}>Orders</NavItem>
        <NavItem href="/admin/customers" icon={Users}>Customers</NavItem>
        <NavItem href="/admin/analytics" icon={BarChart}>Analytics</NavItem>
        <NavItem href="/admin/settings" icon={Settings}>Settings</NavItem>
      </nav>
    </div>
  );
}

function NavItem({ 
  href, 
  icon: Icon, 
  children 
}: { 
  href: string;
  icon: any;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
    >
      <Icon className="h-5 w-5 mr-3" />
      {children}
    </Link>
  );
}