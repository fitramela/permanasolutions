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
        <div className="absolute inset-0 bg-[#0A5E83]/45" />

        {/* Content */}
        <div className="relative mx-auto flex h-full max-w-[1440px] items-center justify-center px-6 lg:px-16">
          <div className="max-w-[820px] text-center text-white">
            <h1 className="text-4xl font-bold leading-tight md:text-6xl">
              {t("title")}
            </h1>

            <p className="mx-auto mt-6 max-w-[720px] text-base leading-8 text-white/90 md:text-lg">
              {t("description")}
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-5">
              <Link
                href="/company-profile"
                className="rounded-full bg-[#04BCBC] px-8 py-3 font-semibold text-white transition hover:bg-[#03A8A8]"
              >
                {t("profileButton")}
              </Link>

              <Link
                href="/contact"
                className="rounded-full border border-white px-8 py-3 font-semibold text-white transition hover:bg-white hover:text-[#00628D]"
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