"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";

const navigationItems = [
  { key: "home", href: "/" },
  { key: "solutions", href: "/solutions" },
  { key: "service", href: "/#our-service" },
  { key: "about", href: "/about" },
  { key: "contact", href: "/contact" },
];

export default function Navbar() {
  const t = useTranslations("Navbar");
  const locale = useLocale();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-[80px] bg-white shadow-sm">
      <div className="flex h-full w-full items-center justify-between px-10 lg:px-12 xl:px-16">

        {/* Logo */}
        <Link
          href={`/${locale}`}
          scroll
          className="flex shrink-0 items-center"
        >
          <Image
            src="/images/logo.png"
            alt="Permana Solutions"
            width={500}
            height={200}
            priority
            className="h-auto w-[200px]"
          />
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:block">
          <ul className="flex items-center gap-10 lg:gap-15">
            {navigationItems.map((item) => (
              <li key={item.key}>
                <Link
                  href={`/${locale}${item.href === "/" ? "" : item.href}`}
                  scroll
                  className="text-[13px] font-semibold text-[#05638B] transition-colors duration-300 hover:text-[#04BCBC]"
                >
                  {t(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex h-10 w-10 items-center justify-center md:hidden"
          aria-label="Toggle menu"
        >
          <span className="text-3xl text-[#05638B]">
            {isMenuOpen ? "✕" : "☰"}
          </span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`overflow-hidden bg-white transition-all duration-300 md:hidden ${
          isMenuOpen ? "max-h-[500px] border-t border-gray-200" : "max-h-0"
        }`}
      >
        <nav>
          <ul className="flex flex-col">
            {navigationItems.map((item) => (
              <li key={item.key}>
                <Link
                  href={`/${locale}${item.href === "/" ? "" : item.href}`}
                  scroll
                  onClick={() => setIsMenuOpen(false)}
                  className="block border-b border-gray-100 px-6 py-4 text-base font-medium text-[#05638B] transition hover:bg-[#F5FBFD] hover:text-[#04BCBC]"
                >
                  {t(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}