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
    <section className="bg-grey py-16 lg:py-24">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-6 lg:px-16">
        {/* Title */}
        <h2 className="mb-10 text-center text-3xl font-bold text-[#111111] sm:text-4xl lg:mb-16 lg:text-5xl">
          {t("title")}
        </h2>

        {/* Features */}
        <div className="mb-10 grid gap-x-8 gap-y-10 md:grid-cols-2 lg:mb-16 lg:grid-cols-3 lg:gap-x-20 lg:gap-y-14">
          {items.map((item, index) => (
            <div key={index} className="relative min-h-[110px]">
              {/* Desktop Flow */}
              {index === 0 && (
                <span className="absolute -right-14 top-2 hidden text-2xl font-light text-[#04BCBC] lg:block">
                  →
                </span>
              )}

              {index === 1 && (
                <span className="absolute -right-14 top-2 hidden text-2xl font-light text-[#04BCBC] lg:block">
                  →
                </span>
              )}

              {index === 2 && (
                <span className="absolute left-1/2 top-[82px] hidden -translate-x-1/2 text-2xl font-light text-[#04BCBC] lg:block">
                  ↓
                </span>
              )}

              {index === 4 && (
                <span className="absolute -left-14 top-2 hidden text-2xl font-light text-[#04BCBC] lg:block">
                  ←
                </span>
              )}

              {index === 5 && (
                <span className="absolute -left-14 top-2 hidden text-2xl font-light text-[#04BCBC] lg:block">
                  ←
                </span>
              )}

              <h3 className="text-base font-bold text-[#00628D]">
                {item.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#6B7280]">
                {item.description}
              </p>

              {/* Mobile Flow */}
              {index !== items.length - 1 && (
                <div className="mt-5 flex justify-center md:hidden">
                  <span className="text-2xl font-light text-[#04BCBC]">
                    ↓
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Image */}
        <div className="flex justify-center">
          <div
            className="
              relative
              h-[220px]
              w-full
              overflow-hidden
              rounded-tl-[24px]
              rounded-tr-[70px]
              rounded-bl-[70px]
              rounded-br-[24px]
              sm:h-[300px]
              sm:rounded-tl-[30px]
              sm:rounded-tr-[110px]
              sm:rounded-bl-[110px]
              sm:rounded-br-[30px]
              lg:h-[430px]
              lg:max-w-[900px]
              lg:rounded-tl-[36px]
              lg:rounded-tr-[170px]
              lg:rounded-bl-[170px]
              lg:rounded-br-[36px]
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