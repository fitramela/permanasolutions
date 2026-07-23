"use client";

import "./styles.css";
import { useTranslations } from "next-intl";

export default function ContactInfo() {
  const t = useTranslations("ContactHero");

  return (
    <div className="contact-info">

      <h1>{t("title")}</h1>

      <h3>{t("office")}</h3>

      <p className="whitespace-pre-line">
        {t("address")}
      </p>

    </div>
  );
}