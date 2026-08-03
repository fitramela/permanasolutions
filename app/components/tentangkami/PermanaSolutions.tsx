"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

export default function PermanaSolutions() {
  const t = useTranslations("About");

  return (
    <section
      className="
        relative
        pt-[150px]
pb-[170px]
      "
    >
      <div
        className="
          grid
          items-center
          gap-[90px]

          lg:grid-cols-[620px_1fr]
        "
      >
        {/* ================= LEFT ================= */}

        <div>
          <h2
            className="
              text-[58px]
              font-bold
              leading-[1.1]
              text-[#005D86]
            "
          >
            {t("company.title")}
          </h2>

          <div
            className="
              mt-8
              h-[5px]
              w-[160px]
              rounded-full
              bg-gradient-to-r
              from-cyan-300
              to-cyan-500
            "
          />

          <p
            className="
              mt-10
              max-w-[310px]
              text-[16px]
              leading-[34px]
              text-[#666666]
            "
          >
            {t("company.description")}
          </p>
        </div>

        {/* ================= RIGHT ================= */}

        <div
          className="
            relative
            flex
            justify-center
            lg:justify-end
          "
        >
          {/* Glow */}

          <div
            className="
              absolute
              left-1/2
              top-1/2
              h-[320px]
              w-[320px]
              -translate-x-1/2
              -translate-y-1/2
              rounded-full
              bg-cyan-300/25
              blur-[120px]
            "
          />

          {/* Logo */}

          <Image
            src="/images/pErmana.png"
            alt="Permana Solutions"
            width={500}
            height={500}
            priority
            className="
              relative
              h-auto
              w-[420px]
              select-none
              xl:w-[500px]
            "
          />
        </div>
      </div>
    </section>
  );
}