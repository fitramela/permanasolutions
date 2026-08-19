"use client";

import { useTranslations } from "next-intl";

export default function MapSection() {
  const t = useTranslations("ContactHero");

  return (
    <section className="w-full bg-white py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-[#005D86] md:text-4xl">
            {t("findOffice")}
          </h2>

          <p className="mt-3 text-gray-500">
            {t("visitContact")}
          </p>
        </div>

        {/* Map Card */}
        <div className="overflow-hidden rounded-[28px] bg-white shadow-[0_20px_50px_rgba(0,0,0,.08)]">
          <iframe
            src="https://www.google.com/maps?q=Medianusa+Permana+Jakarta&output=embed"
            loading="lazy"
            title="Medianusa Permana Location"
            className="h-[320px] w-full border-0 md:h-[420px] lg:h-[500px]"
          />
        </div>

          {/* Address Card */}
        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <h3 className="text-xl font-semibold text-[#005D86]">
            Medianusa Permana (Permana Solutions)
          </h3>

          <p className="mt-3 leading-7 text-gray-600">
            Jl. Cideng Barat No.21B 3,
            RT.11/RW.11,
            Duri Pulo,
            Kecamatan Gambir,
            Kota Jakarta Pusat,
            Daerah Khusus Ibukota Jakarta 10140
          </p>

          <a
            href="https://maps.google.com/?q=Medianusa+Permana+Jakarta"
            target="_blank"
            rel="noopener noreferrer"
            className="
              mt-6
              inline-flex
              items-center
              rounded-full
              bg-[#12C2C9]
              px-6
              py-3
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-[#0eaab0]
            "
          >
            Open in Google Maps
          </a>

        </div>
      </div>
    </section>
  );
}
