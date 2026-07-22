"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function Solutions() {
  const t = useTranslations("Solutions.hero");

  return (
    <main className="overflow-x-hidden bg-white">
      {/* ================= HERO ================= */}

      <section className="relative h-[720px] overflow-hidden">
        
        {/* Background */}
        <Image
          src="/images/solutions.png"
          alt="Solutions Hero"
          fill
          priority
          className="object-cover"
        />

        {/* Overlay */}
        {/* <div className="absolute inset-0 bg-[#0A5E83]/45" /> */}

        {/* Content */}
        <div className="relative mx-auto flex h-full max-w-[1440px] items-center justify-center px-6 lg:px-16">
          <div className="max-w-[820px] text-center text-white">
            <h1 className="text-4xl font-bold leading-tight md:text-6xl">
              {t("title")}
            </h1>

            <p className="mx-auto mt-6 max-w-[720px] text-base leading-8 text-white/90 md:text-lg">
              {t("description")}
            </p>

            <div className="mt-8 flex flex-row flex-wrap items-center justify-center gap-3 sm:mt-10 sm:gap-4">
  <Link
    href="/company-profile"
    className="rounded-lg border border-white/30 bg-[#00628D]/30 px-5 py-2.5 text-sm font-medium text-white backdrop-blur-md transition-all duration-300 hover:bg-[#00628D]/50"
  >
    {t("profileButton")}
  </Link>

  <Link
    href="/contact"
    className="rounded-lg border border-white/30 bg-white/20 px-5 py-2.5 text-sm font-medium text-white backdrop-blur-md transition-all duration-300 hover:bg-white/15"
  >
    {t("contactButton")}
  </Link>
</div>
          </div>
        </div>
      </section>

      {/* PART 2 */}
    </main>
  );
}