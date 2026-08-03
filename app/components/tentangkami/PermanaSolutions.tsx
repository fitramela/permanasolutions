"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

export default function PermanaSolutions() {
  const t = useTranslations("About");

  return (
    <section
      className="
        relative
        py-[150px]
      "
    >
      <div className="relative -mt-[120px]">

        {/* Logo kanan */}

        <Image
          src="/images/pErmana.png"
          alt="Permana Solutions"
          width={520}
          height={220}
          priority
          className="
            absolute
            right-[-120px]
            top-[-215px]

            w-[350px]
            h-auto

            select-none
          "
        />

        {/* Title */}

        <h2
          className="
            max-w-[620px]

            text-[38px]
            font-bold
            leading-[1.05]

            text-[#005D86]
          "
        >
          {t("company.title")}
        </h2>

        {/* Description */}

        <p
  className="
    mt-[18px]

    max-w-[860px]

    text-[17px]
    leading-[34px]

    tracking-[0.01em]

    text-[#5C5C5C]
  "
>
  {t("company.description")}
</p>
      </div>
    </section>
  );
}