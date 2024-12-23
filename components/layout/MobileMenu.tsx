import Link from "next/link";

interface MobileMenuProps {
  isOpen: boolean;
}

export function MobileMenu({ isOpen }: MobileMenuProps) {
  return (
    <div
      className={`${
        isOpen ? "block" : "hidden"
      } fixed inset-0 bg-gray-800 bg-opacity-50 z-50 md:hidden`}
    >
      <div className="absolute right-0 top-0 w-64 h-full bg-white shadow-lg">
        <div className="flex flex-col items-center space-y-6 py-10">
          <NavLink href="/category/abayas">Abayas</NavLink>
          <NavLink href="/category/hijabs">Hijabs</NavLink>
          <NavLink href="/category/kaftans">Kaftans</NavLink>
        </div>
      </div>
    </div>
  );
}

// Composant NavLink
function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className="text-gray-700 hover:text-primary text-lg">
      {children}
    </Link>
  );
}
