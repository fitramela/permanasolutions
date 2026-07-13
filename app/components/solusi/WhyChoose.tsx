"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

type Feature = {
  title: string;
  description: string;
};

export default function WhyChoose() {
  const t = useTranslations("WhyChoose");

  const items = t.raw("items") as Feature[];

  return (
    <section className="bg-grey py-24">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-16">
        {/* Title */}
        <h2 className="mb-16 text-center text-5xl font-bold text-[#111111]">
          {t("title")}
        </h2>

        {/* Features */}
        <div className="mb-16 grid gap-x-14 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <div key={index} className="flex items-start gap-4">
              <span className="mt-1 text-lg text-[#04BCBC]">→</span>

              <div>
                <h3 className="text-base font-bold text-[#00628D]">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#6B7280]">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Image */}
        <div className="flex justify-center">
          <div
            className="
              relative
              h-[430px]
              w-full
              max-w-[900px]
              overflow-hidden
              rounded-tl-[36px]
              rounded-tr-[170px]
              rounded-bl-[170px]
              rounded-br-[36px]
            "
          >
            <Image
              src="/images/image 695.png"
              alt="Why Choose Us"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}