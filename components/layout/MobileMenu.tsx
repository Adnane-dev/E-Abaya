import Link from "next/link";

interface MobileMenuProps {
  isOpen: boolean;
}

export function MobileMenu({ isOpen }: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="md:hidden">
      <div className="px-2 pt-2 pb-3 space-y-1">
        <Link
          href="/category/abayas"
          className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
        >
          Abayas
        </Link>
        <Link
          href="/category/hijabs"
          className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
        >
          Hijabs
        </Link>
        <Link
          href="/category/kaftans"
          className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
        >
          Kaftans
        </Link>
      </div>
    </div>
  );
}
