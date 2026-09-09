"use client";

import Image from "next/image";
import Link from "next/link";
import type { CmsSectionContent } from "@/app/services/cms";

type Props = {
  content?: CmsSectionContent;
  locale: string;
};

type ServiceItem = {
  key: "asp" | "isp" | "resource";
  title: string;
  imageSrc: string;
  imageAlt: string;
  href: string;
};

function text(
  content: CmsSectionContent | undefined,
  key: string,
  fallback = ""
) {
  const value = content?.[key];
  return typeof value === "string" ? value : fallback;
}

export const Contact = ({ content, locale }: Props) => {
  const services: ServiceItem[] = [
    {
      key: "asp",
      title: text(content, "asp", "ASP"),
      imageSrc: text(content, "asp_image", "/images/asp.png"),
      imageAlt: "ASP",
      href: text(content, "asp_href", "/service/asp"),
    },
    {
      key: "isp",
      title: text(content, "isp", "ISP"),
      imageSrc: text(content, "isp_image", "/images/isp.png"),
      imageAlt: "ISP",
      href: text(content, "isp_href", "/service/isp"),
    },
    {
      key: "resource",
      title: text(
        content,
        "resource",
        locale === "id"
          ? "Konsultasi\n&\nLayanan Profesional"
          : "Consulting\n&\nProfessional Services"
      ),
      imageSrc: text(content, "resource_image", "/images/resource.png"),
      imageAlt: "Consulting & Professional Services",
      href: text(content, "resource_href", "/service/resource"),
    },
  ];

  const backgroundImage = text(
    content,
    "background_image",
    "/images/bg our service.png"
  );

  return (
    <section
      aria-labelledby="service-heading"
      className="w-full bg-white py-20"
    >
      <div className="w-full">
        <div className="mx-auto w-full px-6 md:px-8 lg:px-10 xl:px-16 2xl:px-24">
          <div className="mb-14">
            <h2
              id="service-heading"
              className="text-4xl font-bold text-[#05638B] drop-shadow-[0_5px_8px_rgba(0,0,0,0.25)] md:text-5xl"
            >
              {text(
                content,
                "title",
                locale === "id" ? "Pelayanan Kami" : "Our Services"
              )}
            </h2>
          </div>

          <div
            className="relative w-full overflow-hidden rounded-[40px]"
            style={{
              backgroundImage: `url(${JSON.stringify(backgroundImage)})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="absolute inset-0 bg-white/35" />

            <div className="relative z-10 flex min-h-[650px] items-center justify-center px-10 py-20 md:px-20">
              <div className="grid w-full grid-cols-1 place-items-center gap-10 md:grid-cols-3">
                {services.map((service) => (
                  <div
                    key={service.key}
                    className="flex flex-col items-center"
                  >
                    <div className="flex h-[290px] w-[290px] flex-col items-center justify-center rounded-full bg-[#19C5CB] p-8 shadow-xl">
                      <h3 className="mb-6 whitespace-pre-line text-center text-2xl font-bold leading-tight text-white">
                        {service.title}
                      </h3>

                      <Image
                        src={service.imageSrc}
                        alt={service.imageAlt}
                        width={110}
                        height={110}
                        className="h-auto w-auto max-h-[110px] max-w-[110px] object-contain"
                      />
                    </div>

                    <Link
                      href={`/${locale}${service.href}`}
                      className="mt-6 rounded-full bg-white px-8 py-3 font-semibold text-[#05638B] shadow-lg transition hover:bg-gray-100"
                    >
                      {text(
                        content,
                        "seeMore",
                        locale === "id" ? "Selengkapnya" : "See More"
                      )}
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            <div className="absolute -bottom-44 left-1/2 h-[300px] w-[150%] -translate-x-1/2 rounded-full bg-white" />
          </div>
        </div>
      </div>
    </section>
  );
};
