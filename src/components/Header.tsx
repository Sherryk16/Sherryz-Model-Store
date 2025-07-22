'use client'

import { ShoppingBag } from "lucide-react";
import { useCartSidebar } from "@/context/CartProvider";
import Link from "next/link";

export function Header() {
  const { openCart } = useCartSidebar();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              My Store
            </Link>
          </div>
          <button
            onClick={openCart}
            className="p-2 text-gray-400 hover:text-gray-500"
          >
            <ShoppingBag className="h-6 w-6" />
          </button>
        </div>
      </div>
    </header>
  );
} 