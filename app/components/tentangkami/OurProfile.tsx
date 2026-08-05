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
            left-[-580px]
            top-[-90px]

            w-[840px]
            h-auto

            select-none
            pointer-events-none
          "
        />

        <h2
          className="
            absolute
            left-[-25px]
            top-[-25px]

            text-white
            text-[32px]
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
    mt-[-30px]

    flex
    justify-center
  "
>
  <p
  className="
    relative

    left-[40px]     /* geser ke kanan */
    /* left-[-40px]  geser ke kiri */

    w-full
    max-w-[1120px]

    text-left

    text-[19px]
    font-normal
    leading-[1.35]
    tracking-[0.01em]

    text-[#555555]
  "
>
  {t("ourProfile.description")}
</p>
</div>

    </section>
  );
}