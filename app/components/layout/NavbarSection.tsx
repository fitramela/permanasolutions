"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";
import Image from "next/image";
import { useLocale } from "next-intl";

type SettingsResponse = {
  success?: boolean;
  data?: CmsSettings;
};

type CmsSettings = {
  company?: {
    name?: string;
    phone?: string;
    email?: string;

    // legacy
    logo_url?: string;

    // v10
    navbar_logo_url?: string;
    footer_logo_url?: string;

    footer_background_image?: string;
    address?: string;
  };

  navigation?: {
    id?: Record<string, string>;
    en?: Record<string, string>;
  };

  footer?: {
    id?: Record<string, string>;
    en?: Record<string, string>;
  };

  social_media?: {
    linkedin?: string;
    instagram?: string;
    youtube?: string;
  };
};

const navigationItems = [
  {
    key: "home",
    href: "/",
  },
  {
    key: "solutions",
    href: "/solutions",
  },
  {
    key: "service",
    href: "/#our-service",
  },
  {
    key: "about",
    href: "/about",
  },
  {
    key: "contact",
    href: "/contact",
  },
] as const;

const fallbackNavigation = {
  id: {
    home: "Beranda",
    solutions: "Solusi",
    service: "Layanan",
    about: "Tentang Kami",
    contact: "Kontak",
  },

  en: {
    home: "Home Page",
    solutions: "Solutions",
    service: "Services",
    about: "About Us",
    contact: "Contact",
  },
};

function apiBase() {
  return (
    process.env.NEXT_PUBLIC_API_URL ??
    "http://localhost:4000/api/backend"
  )
    .trim()
    .replace(/\/$/, "");
}

export default function Navbar() {
  const locale =
    useLocale();

  const [
    isMenuOpen,
    setIsMenuOpen,
  ] =
    useState(false);

  const [
    settings,
    setSettings,
  ] =
    useState<CmsSettings | null>(
      null
    );

  useEffect(() => {
    let cancelled =
      false;

    async function loadSettings() {
      try {
        const response =
          await fetch(
            `${apiBase()}/cms/settings`,
            {
              cache:
                "no-store",
            }
          );

        if (!response.ok) {
          throw new Error(
            `Settings request failed: ${response.status}`
          );
        }

        const payload =
          (await response.json()) as SettingsResponse;

        if (
          !cancelled &&
          payload.success &&
          payload.data
        ) {
          setSettings(
            payload.data
          );
        }
      } catch (error) {
        console.error(
          "Failed to load Navbar settings",
          error
        );
      }
    }

    loadSettings();

    return () => {
      cancelled =
        true;
    };
  }, []);

  const currentLocale =
    locale === "en"
      ? "en"
      : "id";

  const navigation =
    settings?.navigation?.[
      currentLocale
    ] ??
    fallbackNavigation[
      currentLocale
    ];

  /**
   * v10
   *
   * Navbar memakai logo horizontal.
   */
  const logo =
    settings?.company
      ?.navbar_logo_url ||
    "/images/logo.png";

  const companyName =
    settings?.company?.name ||
    "Permana Solutions";

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
            src={logo}
            alt={companyName}
            width={500}
            height={200}
            priority
            className="h-auto w-[200px]"
          />
        </Link>

        {/* Desktop Menu */}

        <nav className="hidden md:block">

          <ul className="flex items-center gap-10 lg:gap-15">

            {navigationItems.map(
              (item) => (
                <li
                  key={item.key}
                >
                  <Link
                    href={`/${locale}${
                      item.href ===
                      "/"
                        ? ""
                        : item.href
                    }`}
                    scroll
                    className="text-[13px] font-semibold text-[#05638B] transition-colors duration-300 hover:text-[#04BCBC]"
                  >
                    {navigation[
                      item.key
                    ] ??
                      item.key}
                  </Link>
                </li>
              )
            )}

          </ul>

        </nav>

        {/* Mobile Menu Button */}

        <button
          type="button"
          onClick={() =>
            setIsMenuOpen(
              (current) =>
                !current
            )
          }
          className="flex h-10 w-10 items-center justify-center md:hidden"
          aria-label="Toggle menu"
        >
          <span className="text-3xl text-[#05638B]">
            {isMenuOpen
              ? "✕"
              : "☰"}
          </span>
        </button>

      </div>

      {/* Mobile Menu */}

      <div
        className={`overflow-hidden bg-white transition-all duration-300 md:hidden ${
          isMenuOpen
            ? "max-h-[500px] border-t border-gray-200"
            : "max-h-0"
        }`}
      >

        <nav>

          <ul className="flex flex-col">

            {navigationItems.map(
              (item) => (
                <li
                  key={item.key}
                >
                  <Link
                    href={`/${locale}${
                      item.href ===
                      "/"
                        ? ""
                        : item.href
                    }`}
                    scroll
                    onClick={() =>
                      setIsMenuOpen(
                        false
                      )
                    }
                    className="block border-b border-gray-100 px-6 py-4 text-base font-medium text-[#05638B] transition hover:bg-[#F5FBFD] hover:text-[#04BCBC]"
                  >
                    {navigation[
                      item.key
                    ] ??
                      item.key}
                  </Link>
                </li>
              )
            )}

          </ul>

        </nav>

      </div>

    </header>
  );
}