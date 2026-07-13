"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

type HeroStat = {
  value: string;
  label: string;
};

export default function HeroBannerSection() {
  const t = useTranslations("Hero");
  const stats = t.raw("stats") as HeroStat[];

  return (
   <section className="w-full bg-white pt-10 pb-32">
  <div className="mx-auto w-full px-8 xl:px-12">

    <div className="relative">

      {/* Hero */}
      <div className="relative h-[640px] overflow-hidden rounded-[32px]">
        <Image
          src="/images/home page.png"
          alt=""
          fill
          priority
          className="object-cover"
        />

        {/* Content */}
        <div className="absolute inset-0 flex items-center px-20">
          <div className="max-w-[560px]">

            <h1
              className="
                whitespace-pre-line
                text-[64px]
                font-bold
                leading-[0.92]
                text-white
                drop-shadow-lg
              "
            >
              {t("title")}
            </h1>

          </div>
        </div>
      </div>

      {/* Stats */}
      <div
        className="
          absolute
          bottom-0
          right-0
          translate-y-1/2
          z-20
        "
      >
        <div
          className="
            bg-white
            rounded-tl-[52px]
            px-16
            py-8
            shadow-[0_15px_40px_rgba(0,0,0,.12)]
          "
        >
          <div className="flex gap-16">

            {stats.map((stat, index) => (
              <div
                key={index}
                className="min-w-[140px] text-center"
              >
                <h3 className="text-[54px] font-bold leading-none text-[#00628D]">
                  {stat.value}
                </h3>

                <p className="mt-2 text-lg text-[#4B5563] whitespace-nowrap">
                  {stat.label}
                </p>
              </div>
            ))}

          </div>
        </div>
      </div>

    </div>

  </div>
</section>
  );
}