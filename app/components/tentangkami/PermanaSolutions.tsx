"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

export default function PermanaSolutions() {
  const t = useTranslations("About");

  return (
    <section
      className="
        relative
        py-[100px]
      "
    >
      <div className="relative -mt-[60px]">

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
            top-[-139px]

            w-[330px]
            h-auto

            select-none
          "
        />
<div className="ml-[-25px]">
        {/* Title */}

        <h2
          className="
            max-w-[620px]

            text-[35px]
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
    mt-[14px]

    max-w-[1300px]

    text-[18px]
    leading-[27px]

    tracking-[0.01em]

    text-[#5C5C5C]
  "
>
  {t("company.description")}
</p>
</div>
      </div>
    </section>
  );
}