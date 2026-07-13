"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

export default function IndustrySection() {
  const t = useTranslations("SolutionsIndustry");

  return (
    <section className="bg-white py-24">
      <div className="mx-auto flex max-w-[1440px] items-start gap-12 px-6 lg:px-16">
        {/* Left */}
        <div className="max-w-[360px]">
          <p className="text-lg font-semibold text-[#04BCBC]">
            {t("tag")}
          </p>

          <h2 className="mt-3 text-5xl font-bold leading-tight text-[#111111]">
            {t("title1")}
            <br />
            {t("title2")}{" "}
            <span className="text-[#04BCBC]">
              {t("titleHighlight")}
            </span>
          </h2>

          <p className="mt-8 text-base leading-8 text-[#6B7280]">
            {t("description")}
          </p>

          <p className="mt-14 text-sm leading-8 text-[#555555]">
            {t("footer")}
          </p>
        </div>

        {/* Right Image */}
        <div className="flex-1">
          <Image
            src="/images/Frame.png"
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