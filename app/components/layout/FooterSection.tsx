"use client";

import { FormEvent, useId, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

type FormData = {
  fullName: string;
  companyName: string;
  phone: string;
  email: string;
  description: string;
};

  const formFields = [
  {
    key: "fullName",
    label: "fullName",
    placeholder: "fullNamePlaceholder",
    type: "text",
  },
  {
    key: "companyName",
    label: "companyName",
    placeholder: "companyNamePlaceholder",
    type: "text",
  },
  {
    key: "phone",
    label: "phone",
    placeholder: "phonePlaceholder",
    type: "tel",
  },
  {
    key: "email",
    label: "email",
    placeholder: "emailPlaceholder",
    type: "email",
  },
] as const;

export const FooterSection = () => {
  const formId = useId();
   const t = useTranslations("Contact");
  const tf = useTranslations("Footer");

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    companyName: "",
    phone: "",
    email: "",
    description: "",
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <footer className="w-full">

      {/* ================= CTA ================= */}

      <section className="relative overflow-hidden py-24">

        <Image
          src="/images/bgFooter.png"
          alt=""
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-white/75" />

        <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-8">

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_650px] items-center gap-10 lg:gap-24 py-10 lg:py-0">

            {/* LEFT */}

           <div className="max-w-[yy0px]">

              <h2 className="
text-4xl
md:text-5xl
lg:text-[64px]
leading-tight
font-extralight
text-primary
whitespace-pre-line
">
  {t("title")}
</h2>
              <div className="mt-10 flex items-center gap-5">

                <a
                  href="/company-profile.pdf"
                  download
                  className="rounded-full bg-[#04BCBC] px-7 py-3 font-semibold text-white"
                >
                  {t("companyProfile")}
                </a>

                <span className="font-semibold text-primary">
  {t("download")}
</span>

              </div>

            </div>

          {/* RIGHT */}
<div className="flex justify-center lg:justify-end">
  <div
  className="
    w-full
    w-[680px]
    
    rounded-[38px]
    aspect-square
    bg-white
    px-8
    py-10
    shadow-[0_10px_30px_rgba(0,0,0,0.15)]
    lg:px-10
  "
>

    {/* Title */}
    <h3 className="whitespace-pre-line text-center text-[22px] font-bold leading-[30px] text-black">
  {t("formTitle")}
</h3>

    {/* Line */}
    <div className="mt-5 mb-6 h-[2px] w-full bg-[#1FC8E7]" />

    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      {formFields.map((field) => (
        <div key={field.key}>
          <label
            htmlFor={`${formId}-${field.key}`}
            className="mb-1 block text-[15px] font-medium text-black"
          >
            <span className="text-red-500">*</span>
            {t(field.label)}
          </label>

          <input
            id={`${formId}-${field.key}`}
            type={field.type}
            required
           placeholder={t(field.placeholder)}
            value={formData[field.key]}
            onChange={(e) =>
              setFormData({
                ...formData,
                [field.key]: e.target.value,
              })
            }
            className="
              h-[50px]
              w-full
              rounded-xl
              border
              border-[#E4E4E4]
              bg-white
              px-4
              text-[14px]
              placeholder:text-[#B8B8B8]
              shadow-[0_4px_12px_rgba(0,0,0,0.12)]
              outline-none
              focus:border-[#04BCBC]
            "
          />
        </div>
      ))}

      {/* Description */}
      <div>
        <label
          htmlFor={`${formId}-description`}
          className="mb-1 block text-[15px] font-medium text-black"
        >
          <span className="text-red-500">*</span>
         {t("description")}
        </label>

        <textarea
          id={`${formId}-description`}
          rows={4}
          placeholder={t("descriptionPlaceholder")}
          value={formData.description}
          onChange={(e) =>
            setFormData({
              ...formData,
              description: e.target.value,
            })
          }
          className="
            w-full
            rounded-[10px]
            border
            border-[#E4E4E4]
            bg-white
            p-4
            text-[14px]
            placeholder:text-[#B8B8B8]
            shadow-[0_4px_12px_rgba(0,0,0,0.12)]
            outline-none
            focus:border-[#04BCBC]
          "
        />
      </div>

      {/* Button */}
      <button
        type="submit"
        className="
          mt-2
          rounded-[8px]
          bg-[#05638B]
          px-6
          py-2
          text-sm
          font-semibold
          text-white
          shadow-lg
          transition
          hover:bg-[#04506F]
        "
      >
        {t("submit")}
      </button>
    </form>
  </div>
</div>

</div>

</div>

</section>

{/* ================= FOOTER ================= */}

<section className="bg-primary text-white">
  <div className="-mb-1 overflow-hidden leading-none">
    <svg
        viewBox="0 0 1440 120"
        className="block h-[90px] w-full"
        preserveAspectRatio="none"
    >
        <path
            fill="#05638B"
            d="
            M0,80
            C300,10
            1140,10
            1440,80
            L1440,120
            L0,120
            Z
            "
        />
    </svg>
</div>

  <div className="container-custom py-10 lg:py-12">

    <div className="grid gap-12 lg:grid-cols-2">

      {/* LEFT */}

      <div>

        <div className="flex items-center gap-4">

          <Image
            src="/images/icon-logo.png"
            alt="Permana Solutions"
            width={70}
            height={78}
          />

          <div>

            <p className="mt-1 text-sm text-white/80">
              Automate, Boost
              <br />
              Efficiency, Grow Faster
            </p>

          </div>

        </div>

        <div className="mt-8 flex gap-4">

          <Link
            href="https://linkedin.com"
            target="_blank"
          >
            <Image
              src="/images/linkedin.png"
              alt="LinkedIn"
              width={42}
              height={42}
            />
          </Link>

          <Link
            href="https://www.instagram.com/permana.solutions?igsh=ajh6aDdtenNvaWM0"
            target="_blank"
          >
            <Image
              src="/images/instagram-logo.png"
              alt="Instagram"
              width={42}
              height={42}
            />
          </Link>

        </div>

      </div>

      {/* RIGHT */}

      <div className="space-y-6">

        <div className="flex items-start gap-4">

          <Image
            src="/images/g-maps.png"
            alt="Location"
            width={24}
            height={24}
          />

          <p className="text-sm leading-6 text-white/90">
            Jl. Cideng Barat No.21B 3,
            RT.11/RW.11,
            Duri Pulo,
            Kecamatan Gambir,
            Kota Jakarta Pusat,
            Daerah Khusus Ibukota Jakarta 10140
          </p>

        </div>

        <div className="flex items-center gap-4">

          <Image
            src="/images/phone.png"
            alt="Phone"
            width={24}
            height={24}
          />

          <a href="tel:+62216332103">
            (021) 6332103
          </a>

        </div>

        <div className="flex items-center gap-4">

          <Image
            src="/images/email.png"
            alt="Email"
            width={24}
            height={24}
          />

          <a href="mailto:mbusiness@permanasolutions.com">
            mbusiness@permanasolutions.com
          </a>

        </div>

      </div>

    </div>

    <div className="mt-12 border-t border-white/20 pt-6 text-center text-sm text-white/80">
      © Permana Solutions 2026. All Rights Reserved.
    </div>

  </div>

</section>

</footer>
);
};