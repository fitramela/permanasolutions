"use client";

import { useTranslations } from "next-intl";

export default function ContactInfo() {
  const t = useTranslations("ContactHero");

  return (
    <div
      className="
        absolute

        left-[135px]
        top-[165px]

        w-[290px]

        text-white
      "
    >
      <h1
        className="
          text-[40px]
          font-bold
          leading-none
        "
      >
        {t("title")}
      </h1>

      <h2
        className="
          mt-[17px]

          text-[24px]
          font-semibold
        "
      >
        {t("office")}
      </h2>

      <p
        className="
          mt-[10px]

          whitespace-pre-line

          text-[15px]
          leading-[20px]
        "
      >
        {t("address")}
      </p>
    </div>
  );
}