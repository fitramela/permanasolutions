"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";

export default function Company() {
  const t = useTranslations("About.company");

  return (
    <section className="relative w-full overflow-hidden py-20">

<Image
  src="/images/bgkiripermana.png"
  alt="Background"
  width={650}
  height={650}
  className="
    absolute
    left-0
    top-0
    -z-10
    h-auto
    w-[450px]
    lg:w-[650px]
  "
/>

  


      {/* Background Glow */}
      <div
        className="
          absolute
          -left-44
          top-8
          h-[450px]
          w-full
          rounded-full
          bg-[#8FE8FF]
          opacity-20
          blur-[120px]
        "
      />

      <div className="mx-auto max-w-7xl px-6 lg:px-16">

        <div
          className="
            relative
            rounded-[32px]
            bg-[#EAF7FC]
            px-8
            py-10
            shadow-[0_10px_35px_rgba(0,93,134,0.08)]
            lg:px-14
            lg:py-14
          "
        >

          <h2 className="font-serif text-5xl font-bold text-[#005D86]">
            {t("title")}
          </h2>

          <p className="mt-6 max-w-5xl text-lg leading-8 text-[#5F6368]">
            {t("description")}
          </p>

        </div>

      </div>

    </section>
  );
}