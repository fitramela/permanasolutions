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
    <header className="fixed top-0 left-0 z-50 w-full bg-white shadow-sm">
      <div className="mx-auto flex h-[74px] w-full items-center justify-between px-5 lg:px-8">
        {/* Logo */}
        <Link href={`/${locale}`} scroll className="flex items-center">
          <Image
            src="/images/logo.png"
            alt="Permana Solutions"
            width={220}
            height={70}
            priority
            className="h-auto w-[170px] sm:w-[200px] lg:w-[220px]"
          />
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:block">
          <ul className="flex items-center gap-8">
            {navigationItems.map((item) => (
              <li key={item.key}>
                <Link
                  href={`/${locale}${item.href === "/" ? "" : item.href}`}
                  scroll
                  className="text-[13px] font-medium text-[#05638B] transition hover:text-[#04BCBC]"
                >
                  {t(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Hamburger */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded md:hidden"
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
          isMenuOpen ? "max-h-[500px] border-t" : "max-h-0"
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