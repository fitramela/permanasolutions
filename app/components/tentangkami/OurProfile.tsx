"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

export default function OurProfile() {
  const t = useTranslations("About");

  return (
    <section
      className="
        relative
        pt-[90px]
        pb-[110px]
      "
    >
      {/* ========================= */}
      {/* Ribbon */}
      {/* ========================= */}

      <div className="flex justify-start">
        <Image
          src="/images/ourprofile.png"
          alt="Our Profile"
          width={512}
          height={96}
          priority
          className="
            h-auto
            w-[430px]
            select-none
          "
        />
      </div>

      {/* ========================= */}
      {/* Description */}
      {/* ========================= */}

      <div
        className="
          mx-auto
          mt-[50px]
          max-w-[1120px]
        "
      >
        <p
          className="
            text-center
            text-[17px]
            leading-[34px]
            tracking-[0.01em]
            font-normal
            text-[#5C5C5C]
          "
        >
          {t("profile.description")}
        </p>
      </div>
    </section>
  );
}