"use client";

import { useTranslations } from "next-intl";

export default function ContactInfo() {

  const t = useTranslations("ContactHero");

  return (
    <div className="max-w-[320px] text-white">

      <h1
        className="
          text-5xl
          font-bold
          leading-tight
        "
      >
        {t("title")}
      </h1>

      <h2
        className="
          mt-6
          text-[32px]
          font-semibold
        "
      >
        {t("office")}
      </h2>

      <p
        className="
          mt-8

          whitespace-pre-line

          text-[18px]

          leading-9

          text-white/95
        "
      >
        {t("address")}
      </p>

    </div>
  );
}