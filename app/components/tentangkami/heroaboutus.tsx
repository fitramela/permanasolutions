"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

export default function HeroAboutUs() {
  const t = useTranslations("About");

  return (
    <section
      className="
        relative
        overflow-hidden
        h-[760px]
        bg-white
      "
    >
      {/* ================= BACKGROUND ================= */}

      <div className="absolute inset-0">

        <Image
          src="/images/AboutuS.png"
          alt="About Us"
          fill
          priority
          className="
            object-cover
            object-center
          "
        />

        {/* Dark Overlay */}

        <div className="absolute inset-0 bg-black/15" />

        {/* Left Gradient */}

        <div
          className="
            absolute
            inset-y-0
            left-0
            w-[58%]

            bg-gradient-to-r
            from-[#355062]/85
            via-[#355062]/55
            to-transparent
          "
        />
      </div>

      {/* ================= CONTENT ================= */}

      <div
        className="
          relative
          z-20

          mx-auto

          flex
          items-center

          h-full

          max-w-[1440px]

          px-[100px]
        "
      >
        <div className="max-w-[560px]">

          {/* Title */}

          <h1
            className="
              text-white

              text-[58px]

              font-bold

              leading-none
            "
          >
            {t("hero.title")}
          </h1>

          {/* Description */}

          <p
            className="
              mt-8

              max-w-[500px]

              text-[17px]

              leading-[34px]

              text-white/95
            "
          >
            {t("hero.description")}
          </p>

          {/* Line */}

          <div
            className="
              mt-10

              h-[5px]

              w-[260px]

              rounded-full

              bg-gradient-to-r

              from-cyan-300

              to-[#0098C9]
            "
          />

        </div>
      </div>

      {/* ================= BOTTOM GLOW ================= */}

      <div
        className="
          absolute

          -bottom-[210px]

          left-1/2

          h-[420px]

          w-[1250px]

          -translate-x-1/2

          rounded-full

          bg-cyan-300/40

          blur-[150px]
        "
      />
    </section>
  );
}