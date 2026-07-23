"use client";

import "./styles.css";
import { useTranslations } from "next-intl";

export default function MapSection() {

  const t = useTranslations("ContactHero");

  return (
    <section className="map-section">

      <div className="map-wrapper">

        <iframe
          src="https://www.google.com/maps?q=Medianusa+Permana+Jakarta&output=embed"
          loading="lazy"
          title="Medianusa Permana Location"
        />

      </div>


      <div className="map-address">

        <h3>
          Medianusa Permana (Permana Solutions)
        </h3>

        <p className="whitespace-pre-line">
          {t("address")}
        </p>

      </div>


    </section>
  );
}