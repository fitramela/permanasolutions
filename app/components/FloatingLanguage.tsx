"use client";

import Image from "next/image";
import { useState } from "react";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";

export default function FloatingLanguage() {
  const [open, setOpen] = useState(false);

  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const changeLanguage = (newLocale: "en" | "id") => {
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
    setOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex w-[160px] items-center justify-between rounded-full bg-[#04BCBC]/20 px-3 py-2 backdrop-blur-md shadow-lg"
        >
          <div className="flex items-center gap-2">
            <Image
              src="/images/Google Translate.png"
              alt="Translate"
              width={22}
              height={22}
            />

            <span className="text-xs font-medium italic text-[#04BCBC]">
              {locale === "en" ? "English" : "Indonesia"}
            </span>
          </div>

          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white shadow">
            <svg
              className={`h-3 w-3 text-[#05638B] transition-transform ${
                open ? "rotate-180" : ""
              }`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m6 9 6 6 6-6"
              />
            </svg>
          </div>
        </button>

        {open && (
          <div className="absolute bottom-14 right-0 w-[160px] overflow-hidden rounded-xl bg-white shadow-xl">
            <button
              onClick={() => changeLanguage("en")}
              className="block w-full px-4 py-3 text-left text-sm hover:bg-gray-100"
            >
            🇬🇧 English
            </button>

            <button
              onClick={() => changeLanguage("id")}
              className="block w-full px-4 py-3 text-left text-sm hover:bg-gray-100"
            >
              🇮🇩 Indonesia
            </button>
          </div>
        )}
      </div>
    </div>
  );
}