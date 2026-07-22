"use client";

import Image from "next/image";
import { useLocale } from "next-intl";

export default function HeroBannerSection() {
  const locale = useLocale();

  return (
    <section className="w-full bg-white py-4 md:py-6 lg:py-8">
      <div className="mx-auto w-full max-w-[1780px] px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[20px] sm:rounded-[28px] lg:rounded-[32px]">
          <Image
            src={
              locale === "id"
                ? "/images/hero-homeIDN.png"
                : "/images/hero-home.png"
            }
            alt="Permana Solutions Hero"
            width={900}
            height={700}
            priority
            sizes="100vw"
            className="
              block
              w-full
              h-auto
              object-cover
            "
          />
        </div>
      </div>
    </section>
  );
}