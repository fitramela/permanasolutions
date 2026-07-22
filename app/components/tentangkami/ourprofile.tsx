"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

export default function OurProfile() {
  const t = useTranslations("About.profile");

  return (
    <section className="relative overflow-hidden bg-white py-20 lg:py-28">
      {/* Cyan Glow */}
      <div
        className="
          absolute
          left-1/2
          top-0
          -translate-x-1/2
          -translate-y-1/2
          h-52
          w-[90%]
          rounded-full
          bg-[#29D9E6]
          opacity-25
          blur-[110px]
        "
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-16">
        <div className="relative">

          {/* OUR PROFILE TITLE */}
          <div
  className="
    relative
    -ml-10
    lg:-ml-16
    h-[120px]
    w-[430px]
    lg:h-[145px]
    lg:w-[520px]
  "
>

            <Image
              src="/images/ourprofile.png"
              alt="Our Profile Background"
              fill
              priority
              className="object-contain"
            />

            <div className="absolute inset-0 flex items-center pl-8 lg:pl-12">
              
            </div>
          </div>

          {/* DESCRIPTION */}
<div className="mt-8">

  <p
    className="
      max-w-[980px]
      text-base
      leading-8
      text-[#5F6368]
      lg:text-lg
      lg:leading-9
    "
  >
    {t("description")}
  </p>

  {/* Logo */}
  <div className="mt-8 flex justify-end pr-4 lg:pr-8">

    <div className="relative">

      {/* Shadow */}
      <div
        className="
          absolute
          left-3
          top-3
          h-full
          w-full
          rounded-full
          bg-[#D7F4FA]
        "
      />

      {/* Card Logo */}
      <div
        className="
          relative
          rounded-full
          bg-white
          px-8
          py-5
          shadow-[0_12px_30px_rgba(0,93,134,.18)]
        "
      >
        <Image
          src="/images/pErmana.png"
          alt="Permana Logo"
          width={220}
          height={70}
          className="h-auto w-[170px] lg:w-[220px]"
        />
      </div>

    </div>

  </div>

</div>
        </div>
      </div>
    </section>
  );
}