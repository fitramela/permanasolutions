"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

export default function WhoWeAreSection() {
  const t = useTranslations("WhoWeAre");

  return (
    <section className="w-full bg-white py-16 lg:py-20">
      <div className="mx-auto flex max-w-[1600px] flex-col items-center justify-between gap-12 px-6 lg:flex-row lg:px-20">

        {/* LEFT */}
        <div className="relative w-full lg:w-[45%]">

          {/* Watermark */}
          <Image
            src="/images/image 10.png"
            alt=""
            width={1000}
            height={500}
            className="
              pointer-events-none
              absolute
              inset-0
              m-auto
              w-[300px]
              opacity-100

              sm:w-[320px]
              md:w-[420px]
              lg:w-[520px]
            "
          />

          <h2
  className="
    relative
    z-10
    mb-10
    text-center
    text-[40px]
    font-bold
    text-[#05638B]
    drop-shadow-[0_4px_6px_rgba(0,0,0,0.25)]
    lg:text-[40px]
  "
>
  {t("title")}
</h2>

          <p className="relative z-10 mb-8 text-justify text-[20px] leading-[2.1] text-[#4F5965]">
            {t("description1")}
          </p>

          <p className="relative z-10 text-justify text-[21px] leading-[2.1] text-[#4F5965]">
            {t("description2")}
          </p>
        </div>

        {/* RIGHT */}
        <div className="flex w-full items-center justify-center lg:w-[55%]">
         <Image
  src="/images/newWHO.png"
  alt="Who We Are"
  width={2000}
  height={5000}
  priority
  className="w-full max-w-[7000px] h-auto"
/>
        </div>

      </div>
    </section>
  );
}