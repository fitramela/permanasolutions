"use client";

import Image, { type StaticImageData } from "next/image";
import { useTranslations } from "next-intl";

import image19 from "@/public/images/client/image 19.png";
import image20 from "@/public/images/client/image 20.png";
import image21 from "@/public/images/client/image 21.png";
import image22 from "@/public/images/client/image 22.png";
import image23 from "@/public/images/client/image 23.png";
import image24 from "@/public/images/client/image 24.png";
import image25 from "@/public/images/client/image 25.png";
import image26 from "@/public/images/client/image 26.png";
import image27 from "@/public/images/client/image 27.png";
import image28 from "@/public/images/client/image 28.png";
import image30 from "@/public/images/client/image 30.png";
import image31 from "@/public/images/client/image 31.png";
import image33 from "@/public/images/client/image 33.png";
import image34 from "@/public/images/client/image 34.png";
import image35 from "@/public/images/client/image 35.png";
import image36 from "@/public/images/client/image 36.png";
import image37 from "@/public/images/client/image 37.png";
import image38 from "@/public/images/client/image 38.png";
import image39 from "@/public/images/client/image 39.png";
import image40 from "@/public/images/client/image 40.png";

type ClientLogo = {
  src: StaticImageData;
  alt: string;
};

const clients: ClientLogo[] = [
  { src: image19, alt: "Client 19" },
  { src: image20, alt: "Client 20" },
  { src: image21, alt: "Client 21" },
  { src: image22, alt: "Client 22" },
  { src: image23, alt: "Client 23" },
  { src: image24, alt: "Client 24" },
  { src: image25, alt: "Client 25" },
  { src: image26, alt: "Client 26" },
  { src: image27, alt: "Client 27" },
  { src: image28, alt: "Client 28" },
  { src: image30, alt: "Client 30" },
  { src: image31, alt: "Client 31" },
  { src: image33, alt: "Client 33" },
  { src: image34, alt: "Client 34" },
  { src: image35, alt: "Client 35" },
  { src: image36, alt: "Client 36" },
  { src: image37, alt: "Client 37" },
  { src: image38, alt: "Client 38" },
  { src: image39, alt: "Client 39" },
  { src: image40, alt: "Client 40" },
];

export const Client= () => {
  const t = useTranslations("Service");


  return (
    <section className="relative z-20 -mt-28 bg-white pb-20">
      <div className="mx-auto w-full">
         <h2
  className="
    relative
    z-10
    mb-12
    text-center
    text-5xl
    font-bold
    text-[#05638B]
    drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)]
  "
>
  {t("title-clientlayanan")}
</h2>

        <div className="overflow-hidden">
  <div className="flex w-max animate-scroll gap-6 md:gap-12">
    {[...clients, ...clients].map((client, index) => (
      <div
        key={index}
        className="flex h-16 min-w-[120px] md:h-24 md:min-w-[180px] flex-shrink-0 items-center justify-center"
      >
        <Image
          src={client.src}
          alt={client.alt}
          className="h-auto max-h-12 md:max-h-20 w-auto object-contain"
        />
      </div>
    ))}
  </div>
        </div>
      </div>
    </section>
  );
}