"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

export default function IndustrySection() {
  const t = useTranslations("SolutionsIndustry");
  const locale = useLocale();

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-10 px-5 sm:px-6 lg:flex-row lg:items-stretch lg:gap-12 lg:px-16">
        {/* Left */}
       <div className="flex h-full max-w-full flex-col lg:max-w-[360px]">
          <p className="text-base font-semibold text-[#00628D] lg:text-lg">
            {t("tag")}
          </p>

          <h2 className="mt-3 text-3xl font-bold leading-tight text-[#111111] sm:text-4xl">
            {t("title1")}
            <br />
            {t("title2")}{" "}  
            <span className="text-[#04BCBC]">
              {t("titleHighlight")}
            </span>
          </h2>

          <p
  className="
    mt-6
    max-w-[340px]
    text-[15px]
    leading-8
    text-[#6B7280]
    text-justify
    sm:mt-8
    sm:max-w-[360px]
    lg:max-w-[350px]
  "
>
  {t("description")}
</p>

        <p
  className="
    mt-6
    text-sm
    leading-7
    text-[#555555]
    text-justify
    [text-align-last:left]
    lg:mt-[250px]
    lg:leading-8
  "
>
  {t.rich("footer", {
    bold: (chunks) => (
      <span className="font-semibold text-[#333333]">
        {chunks}
      </span>
    ),
  })}
</p>
        </div>

        {/* Right Image */}
        <div className="flex-1">
          <Image
            src={locale === "id" ? "/images/Frame-id.png" : "/images/Frame-en.png"}
            alt="Industries"
            width={900}
            height={700}
            className="h-auto w-full"
          />
        </div>
      </div>
    </section>
  );
}