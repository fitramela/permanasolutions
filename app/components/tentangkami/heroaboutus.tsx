
"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

export default function HeroAboutUs() {
  const t = useTranslations("About");

  return (
    <section
      className="
        relative
        min-h-[760px]
        overflow-hidden
      "
    >
      {/* ================= BACKGROUND ================= */}

      <Image
        src="/images/hero-home.png"
        alt="About Us"
        fill
        priority
        className="object-cover object-center"
      />

      {/* Optional Overlay */}

      <div className="absolute inset-0 bg-black/25" />

      {/* ================= CONTENT ================= */}

      <div
        className="
          relative
          z-10
          mx-auto
          flex
          min-h-[760px]
          max-w-[1440px]
          items-center
          px-6
          sm:px-10
          lg:px-[100px]
        "
      >
        <div
          className="
            max-w-[720px]
          "
        >
          {/* Title */}

          <h1
            className="
              text-4xl
              font-bold
              leading-tight
              text-white

              sm:text-5xl
              lg:text-[58px]
            "
          >
            {t("hero.title")}
          </h1>

          {/* Description */}

          <p
            className="
              mt-8
              max-w-[900px]
              text-sm
              leading-7
              text-white/95

              lg:text-[15px]
            "
          >
            {t("hero.description")}
          </p>

          {/* Decoration */}

          <Image
            src="/images/Decore.png"
            alt="Line Decoration"
            width={750}
            height={12}
            priority
            className="
              mt-6
              h-auto
              w-full
              max-w-[750px]
              select-none
              pointer-events-none
            "
          />
        </div>
      </div>
    </section>
  );
}

