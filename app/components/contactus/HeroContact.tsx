
"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

export default function HeroContact() {
  const t = useTranslations("ContactHero");
  const locale = useLocale();

  return (
    <section className="bg-white py-4 lg:py-7">
      <div className="mx-auto max-w-[1590px] px-4 lg:px-10">
        
        {/* ================= DESKTOP ================= */}
        <div className="relative hidden lg:block">
          <Image
            src="/images/heroContact.png"
            alt="Contact Permana Solutions"
            width={1600}
            height={700}
            priority
            className="h-auto w-full"
          />

          {/* TEXT DESKTOP */}
          <div
            className="
              absolute
              left-[11%]
              top-[27%]
              z-20
              w-[30%]
            "
          >
           {/* Contact Us */}
<div
  className="
    mb-5
    inline-flex
    rounded-full
    border
    border-[#04BCBC]
    px-3
    py-1
    text-[10px]
    font-medium
    text-[#04AEB3]
  "
>
  {t("contactUs")}
</div>

           {/* Title */}
 <h1
      className={`
        font-semibold
        leading-[1.05]
        tracking-[-0.02em]
        text-[#006A93]

        ${
          locale === "id"
            ? "max-w-[360px] text-[30px] xl:max-w-[500px] xl:text-[50px]"
            : "max-w-[300px] text-[30px] xl:max-w-[420px] xl:text-[50px]"
        }
      `}
    >
      {t("titleStart")}{" "}
      <span className="text-[#00B9BF]">
        {t("titleEnd")}
      </span>
    </h1>
    

            {/* Office */}
            <h2
              className="
                mt-2
                text-[15px]
                font-semibold
                text-[#006A93]
                xl:text-[17px]
              "
            >
              {t("office")}
            </h2>

            {/* Address */}
            <p
              className="
                mt-3
                max-w-[250px]
                whitespace-pre-line
                text-[50px]
                leading-[1.5]
                text-[#006A93]
                xl:text-[11px]
              "
            >
              {t("address")}
            </p>
          </div>
        </div>

       {/* ================= MOBILE ================= */}
<div className="relative block lg:hidden">
  <Image
    src="/images/contactMobile.png"
    alt="Contact Permana Solutions"
    width={800}
    height={1000}
    priority
    className="h-auto w-full"
  />

  {/* TEXT MOBILE */}
  <div
    className="
      absolute
      left-[14%]
      top-[10%]
      z-20
      w-[58%]
    "
  >
    {/* Contact Us */}
    <div
      className="
        mb-5
        inline-flex
        rounded-full
        border
        border-[#04BCBC]
        px-3
        py-1
        text-[8px]
        font-regular
        text-[#04AEB3]
      "
    >
      {t("contactUs")}
    </div>

    {/* Title */}
    <h1
      className={`
        font-semibold
        leading-[1.05]
        tracking-[-0.02em]
        text-[#006A93]

        ${
          locale === "id"
            ? `
              max-w-[210px]
              text-[23px]
              sm:max-w-[240px]
              sm:text-[30px]
            `
            : `
              max-w-[195px]
              text-[33px]
              sm:max-w-[225px]
              sm:text-[40px]
            `
        }
      `}
    >
      {t("titleStart")}{" "}
      <span className="text-[#00B9BF]">
        {t("titleEnd")}
      </span>
    </h1>

    {/* Office */}
    <h2
      className="
        mt-2
        text-[15px]
        font-semibold
        leading-tight
        text-[#006A93]
      "
    >
      {t("office")}
    </h2>

    {/* Address */}
    <p
      className="
        mt-2
        max-w-[190px]
        whitespace-pre-line
        text-[10px]
        leading-[1.45]
        text-[#006A93]
      "
    >
      {t("address")}
    </p>
  </div>
</div>

      </div>
    </section>
  );
}

