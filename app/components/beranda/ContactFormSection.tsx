"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

import aspIcon from "@/public/images/asp.png";
import ispIcon from "@/public/images/isp.png";
import resourceIcon from "@/public/images/resource.png";

type ServiceItem = {
  key: "asp" | "isp" | "resource";
  imageSrc: StaticImageData;
  imageAlt: string;
  href: string;
};

export const ContactFormSection = () => {
  const t = useTranslations("Service");

  const services: ServiceItem[] = [
    {
      key: "asp",
      imageSrc: aspIcon,
      imageAlt: "ASP",
      href: "/service/asp",
    },
    {
      key: "isp",
      imageSrc: ispIcon,
      imageAlt: "ISP",
      href: "/service/isp",
    },
    {
      key: "resource",
      imageSrc: resourceIcon,
      imageAlt: "Consulting & Resource",
      href: "/service/resource",
    },
  ];

  return (
    <section
  id="our-service"
  aria-labelledby="service-heading"
  className="w-full bg-white py-20"
>
  <div className="w-full">
    <div className="mx-auto w-full px-6 md:px-8 lg:px-10 xl:px-16 2xl:px-24">

      {/* Heading */}
      <div className="mb-14">
        <h2
          id="service-heading"
          className="
            text-4xl
            font-bold
            text-[#05638B]
            drop-shadow-[0_5px_8px_rgba(0,0,0,0.25)]
            md:text-5xl
          "
        >
          {t("title")}
        </h2>
      </div>

      {/* Background */}
      <div
        className="relative w-full overflow-hidden rounded-[40px]"
        style={{
          backgroundImage: "url('/images/bg our service.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-white/35" />

        {/* Content */}
        <div className="relative z-10 flex min-h-[650px] items-center justify-center px-10 py-20 md:px-20">
          <div className="grid w-full grid-cols-1 place-items-center gap-10 md:grid-cols-3">

            {services.map((service) => (
              <div
                key={service.key}
                className="flex flex-col items-center"
              >
                <div className="flex h-[290px] w-[290px] flex-col items-center justify-center rounded-full bg-[#19C5CB] p-8 shadow-xl">

                  <h3 className="mb-6 whitespace-pre-line text-center text-2xl font-bold leading-tight text-white">
                    {t(service.key)}
                  </h3>

                  <Image
                    src={service.imageSrc}
                    alt={service.imageAlt}
                    width={110}
                    height={110}
                  />
                </div>

                <Link
                  href={service.href}
                  className="mt-6 rounded-full bg-white px-8 py-3 font-semibold text-[#05638B] shadow-lg transition hover:bg-gray-100"
                >
                  {t("seeMore")}
                </Link>
              </div>
            ))}

          </div>
        </div>

        {/* Bottom Curve */}
        <div className="absolute -bottom-44 left-1/2 h-[300px] w-[150%] -translate-x-1/2 rounded-full bg-white" />
      </div>

    </div>
  </div>
</section>
  );
};