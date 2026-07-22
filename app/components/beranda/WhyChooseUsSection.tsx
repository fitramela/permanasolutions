"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

export default function WhyChooseUsSection() {
  const t = useTranslations("WhyChooseUs");

  return (
    <section className="relative overflow-hidden py-14 lg:py-20 min-h-[520px] md:min-h-0">

      {/* Background Desktop */}
      <div className="absolute inset-0 hidden md:block">
        <Image
          src="/images/bgdriving.png"
          alt=""
          fill
          priority
          className="pointer-events-none select-none object-fill object-left"
        />
      </div>

      {/* Background Mobile */}
<div className="absolute inset-0 block overflow-hidden md:hidden">
  {/* Glow */}
  <div className="absolute -right-16 top-0 h-full w-[120%] rounded-l-[120px] bg-[#04BCBC]/40 blur-3xl" />

  {/* Cyan */}
  <div className="absolute -right-6 top-0 h-full w-[108%] rounded-l-[100px] bg-[#04BCBC]" />

  {/* Blue */}
  <div className="absolute left-2 top-0 h-full w-[102%] rounded-l-[90px] bg-[#00628D]" />
</div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-6 md:px-10 lg:px-20 py-8 sm:py-10 lg:py-16">
        <div className="w-full max-w-full sm:max-w-[560px] text-white">
          <div className="max-w-4xl lg:ml-8 mx-auto lg:mx-0">
            <h2
              id="why-choose-us-title"
              className="text-center text-2xl sm:text-2xl md:text-2xl lg:text-2xl font-bold leading-tight"
            >
              {t("title")}
            </h2>

            <p className="mt-5 sm:mt-8 text-sm sm:text-base md:text-lg leading-7 sm:leading-8 text-center lg:text-left">
              {t("description")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}