"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

export default function Solutions() {
  const t = useTranslations("Solutions.hero");
  const locale = useLocale();

  const companyProfile =
    locale === "en"
      ? "/Permana_Company_Profile_2026_English.pdf"
      : "/Permana_Company_Profile_2026_Indonesia.pdf";

  return (
    <main className="overflow-x-hidden bg-white">
      {/* ================= HERO ================= */}

      <section
        className="
          relative
          h-[600px]
          overflow-hidden
          sm:h-[650px]
          md:h-[720px]
        "
      >
        {/* ================= BACKGROUND DESKTOP ================= */}
        <Image
          src="/images/solutions new.png"
          alt="Solutions Hero Desktop"
          fill
          priority
          className="hidden object-cover md:block"
        />

        {/* ================= BACKGROUND MOBILE ================= */}
        <Image
          src="/images/solutions-mobile.png"
          alt="Solutions Hero Mobile"
          fill
          priority
          className="object-cover md:hidden"
        />

        {/* ================= CONTENT ================= */}
        <div
          className="
            relative
            mx-auto
            flex
            h-full
            max-w-[1440px]
            items-center
            justify-center
            px-5
            sm:px-6
            lg:px-16
          "
        >
          <div
            className="
              max-w-[820px]
              text-center
              text-white
            "
          >
            {/* TITLE */}
            <h1
              className="
                text-3xl
                font-bold
                leading-tight
                sm:text-4xl
                md:text-6xl
              "
            >
              {t("title")}
            </h1>

            {/* DESCRIPTION */}
            <p
              className="
                mx-auto
                mt-4
                max-w-[720px]
                text-sm
                leading-7
                text-white/90
                sm:mt-5
                sm:text-base
                sm:leading-8
                md:mt-6
                md:text-lg
              "
            >
              {t("description")}
            </p>

            {/* BUTTONS */}
            <div
              className="
                mt-7
                flex
                flex-row
                flex-wrap
                items-center
                justify-center
                gap-2.5
                sm:mt-8
                sm:gap-3
                md:mt-10
                md:gap-4
              "
            >
              {/* COMPANY PROFILE */}
              <a
                href={companyProfile}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  rounded-lg
                  border
                  border-white/30
                  bg-[#00628D]/30
                  px-4
                  py-2
                  text-xs
                  font-medium
                  text-white
                  backdrop-blur-md
                  transition-all
                  duration-300
                  hover:bg-[#00628D]/50
                  sm:px-5
                  sm:py-2.5
                  sm:text-sm
                "
              >
                {t("profileButton")}
              </a>

              {/* CONTACT */}
              <Link
                href="/contact"
                className="
                  rounded-lg
                  border
                  border-white/30
                  bg-white/20
                  px-4
                  py-2
                  text-xs
                  font-medium
                  text-white
                  backdrop-blur-md
                  transition-all
                  duration-300
                  hover:bg-white/15
                  sm:px-5
                  sm:py-2.5
                  sm:text-sm
                "
              >
                {t("contactButton")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
