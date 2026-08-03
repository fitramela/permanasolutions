"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

export default function OurProfile() {
  const t = useTranslations("About");

  return (
    <section
      className="
        relative
        pt-[120px]
        pb-[140px]
      "
    >
      {/* Ribbon */}
      <div className="relative h-[120px]">
    
        <Image
          src="/images/ourteks.png"
          alt=""
          width={850}
          height={160}
          priority
          className="
            absolute
            left-[-510px]
            top-[-90px]

            w-[850px]
            h-auto

            select-none
            pointer-events-none
          "
        />

        <h2
          className="
            absolute
            left-[10px]
            top-[-30px]

            text-white
            text-[43px]
            font-bold
            font-serif
            leading-none
          "
        >
          {t("ourProfile.title")}
        </h2>

      </div>

      {/* Description */}

      <div
        className="
          mt-[60px]
          mx-auto
          max-w-[1120px]
        "
      >
        <p
          className="
            text-center
            text-[17px]
            leading-[36px]
            text-[#555555]
          "
        >
          {t("ourProfile.description")}
        </p>
      </div>

    </section>
  );
}