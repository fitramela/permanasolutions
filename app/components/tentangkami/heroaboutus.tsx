"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

export default function HeroAbout() {
  const t = useTranslations("About.hero");

  return (
    <section className="relative overflow-hidden pt-20">
      {/* Hero Height */}
      <div className="relative h-[420px] sm:h-[560px] lg:h-[700px] xl:h-[760px]">
        {/* Background */}
        <Image
          src="/images/bagroundh.png"
          alt="About Background"
          fill
          priority
          className="object-cover object-center"
        />

        {/* Gradient kiri */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#005D86]/70 via-[#005D86]/45 to-transparent" />

        {/* Content */}
        <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-6 sm:px-10 lg:px-16">
          <div className="max-w-xl">
            <h1 className="font-serif text-3xl font-bold text-white sm:text-4xl lg:text-6xl">
              {t("title")}
            </h1>

            <p className="mt-4 text-sm leading-7 text-white sm:text-base sm:leading-8 lg:mt-8 lg:text-lg lg:leading-9">
              {t("description")}
            </p>

            <Image
              src="/images/Decore.png"
              alt="Decoration"
              width={180}
              height={14}
              className="mt-8 w-87 sm:w-72 lg:mt-10 lg:w-44"
            />
          </div>
        </div>
      </div>
    </section>
  );
}