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
        h-[1156px]
      "
    >
      {/* ================= BACKGROUND ================= */}

      <div className="absolute inset-0">

        <Image
          src="/images/hero-home.png"
          alt="About Us1"
          fill
          priority
          className="
            object-cover
            object-center
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
        <div className=" relative

    max-w-[640px]

    -mt-[435px]      
    ml-[-30px]"
    >

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

              max-w-[900px]

              text-[15px]

              leading-[20px]

              text-white/95
            "
          >
            {t("hero.description")}
          </p>

         {/* Line Image */}

<Image
  src="/images/Decore.png"
  alt="Line Decoration"
  width={260}
  height={8}
  priority
  className="
    mt-3

    w-[750px]
    h-auto

    select-none
    pointer-events-none
  "
/>

        </div>
      </div>

      
    </section>
  );
}
