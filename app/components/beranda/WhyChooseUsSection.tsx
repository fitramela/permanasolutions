"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

export default function WhyChooseUsSection() {
  const t = useTranslations("WhyChooseUs");

  return (
    <section className="relative py-14 lg:py-20 overflow-hidden">
      {/* Background Shape */}
      <Image
        src="/images/bgdriving.png"
        alt=""
        fill
        priority
        className="object-fill object-left pointer-events-none select-none"
      />

     {/* Content */}
<div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-6 md:px-10 lg:px-20 py-8 sm:py-10 lg:py-16">
  <div className="w-full max-w-full sm:max-w-[560px] text-white">
   <div className="max-w-4xl lg:ml-8 mx-auto lg:mx-0">
  <h2
    id="why-choose-us-title"
   className="text-center text-2xl sm:text-3xl md:text-2xl lg:text-3xl font-bold leading-tight"
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

