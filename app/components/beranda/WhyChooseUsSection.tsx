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
        <div className="absolute -right-16 top-0 h-full w-[120%] rounded-l-[120px] bg-[#04BCBC]/40 blur-3xl" />
        <div className="absolute -right-6 top-0 h-full w-[108%] rounded-l-[100px] bg-[#04BCBC]" />
        <div className="absolute left-2 top-0 h-full w-[102%] rounded-l-[90px] bg-[#00628D]" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8 lg:px-20 pt-8 pb-10 sm:pt-10 sm:pb-12 lg:pt-10 lg:pb-16">
        <div className="w-full max-w-[760px] text-white lg:ml-0">
         <h2
  id="why-choose-us-title"
className="mx-auto max-w-[900px] text-center text-[25px] sm:text-[30px] lg:text-[35px] font-bold leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]">
  {t("title")}
</h2>

          <p
            className="
              mt-9
              max-w-[760px]
              text-justify
              text-[25px]
              sm:text-base
              lg:text-[15px]
              font-regular
              leading-[30px]
              lg:leading-[25px]
              tracking-[0.01em]
              text-white/90
            "
          >
            {t("description")}
          </p>
        </div>
      </div>
    </section>
  );
}