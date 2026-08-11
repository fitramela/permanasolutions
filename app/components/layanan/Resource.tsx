"use client";

import { useRef, useState } from "react";
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


export default function Resource() {
  const t = useTranslations("Resource");

  const [activeCard, setActiveCard] = useState<number | null>(null);


  const technologies = [
    "/images/powering/react.png",
    "/images/powering/node.png",
    "/images/powering/laravel.png",
    "/images/powering/android.png",
    "/images/powering/flutter.png",
    "/images/powering/net.png",
    "/images/powering/py.png",
    "/images/powering/postgresql.png",
    "/images/powering/figma.png",
    "/images/powering/selenium.png",
    "/images/powering/mysql.png",
    "/images/powering/jira.png"
    
  ];


  const cards = t.raw("standOut.cards") as {
    image: string;
    title: string;
    desc: string;
  }[];

 const scrollRef = useRef<HTMLDivElement>(null);

const [showLeftArrow, setShowLeftArrow] = useState(false);
const [showRightArrow, setShowRightArrow] = useState(true);


const handleScroll = () => {
  if (!scrollRef.current) return;

  const {
    scrollLeft,
    scrollWidth,
    clientWidth,
  } = scrollRef.current;

  setShowLeftArrow(scrollLeft > 10);

  setShowRightArrow(
    scrollLeft + clientWidth < scrollWidth - 10
  );
};


const scrollRight = () => {
  if (!scrollRef.current) return;

  scrollRef.current.scrollBy({
    left: 320,
    behavior: "smooth",
  });
};


const scrollLeft = () => {
  if (!scrollRef.current) return;

  scrollRef.current.scrollBy({
    left: -320,
    behavior: "smooth",
  });
};

  return (
    <main className="overflow-hidden bg-white">

        {/* ================= HERO ================= */}

<section
  className="
    resource-hero
    relative
    h-[calc(100vw*2.222)]
    overflow-hidden
    md:h-[600px]
    lg:h-[680px]
    xl:h-[760px]
    2xl:h-[860px]
  "
>
 <div className="absolute inset-0">
  <div
    className="
      mx-auto flex h-full w-full max-w-[1440px]
      items-start
      px-5 pt-[85px]
      sm:items-center sm:px-8 sm:pt-0
      md:px-10
      lg:px-16
      xl:px-20
      2xl:px-24
    "
  >
    
      <div
  className="
    max-w-[320px]
    translate-y-16
    sm:max-w-[480px]
    sm:translate-y-0
    md:max-w-[560px]
    lg:max-w-[600px]
    xl:max-w-[640px]
    lg:-translate-y-8
  "
>

        {/* TITLE */}
        <h1
          className="
            whitespace-nowrap
            text-[28px]
            font-extrabold
            leading-[1]
            text-[#04BCBC]
            sm:text-[36px]
            md:text-[44px]
            lg:text-[50px]
            xl:text-[40px]
          "
        >
          {t("title")}
        </h1>

        {/* SUBTITLE */}
        <h2
          className="
            mt-3
            text-[18px]
            font-bold
            leading-tight
            text-[#111827]
            sm:text-[20px]
            md:text-[26px]
            lg:text-[34px]
            xl:text-[30px]
          "
        >
          {t("subtitle")}
        </h2>

        {/* DESCRIPTION */}
        <p
          className="
            mt-3
            max-w-[520px]
            text-[13px]
            leading-relaxed
            text-[#4B5563]
            sm:text-[14px]
            md:text-[10px]
            lg:text-[16px]
          "
        >
          {t.rich("description", {
            managed: (chunks) => (
              <span className="font-regular text-[#05638B]">
                {chunks}
              </span>
            ),
            outsourcing: (chunks) => (
              <span className="font-regular text-[#05638B]">
                {chunks}
              </span>
            ),
          })}
        </p>

      </div>
    </div>
  </div>
</section>

     {/* ================= WHY WE STAND OUT ================= */}

<section 
  className="
    relative 
    overflow-hidden 
    bg-white 
    py-12 
    sm:py-16 
    lg:py-20
  "
>

  <div 
    className="
      absolute 
      -left-40 
      top-0 
      h-[260px] 
      w-[260px] 
      rounded-full 
      bg-[#04BCBC]/15

      sm:-left-52
      sm:h-[420px]
      sm:w-[420px]
    " 
  />


  <div 
    className="
      absolute 
      -right-40 
      bottom-0 
      h-[260px] 
      w-[260px] 
      rounded-full 
      bg-[#04BCBC]/15

      sm:-right-52
      sm:h-[420px]
      sm:w-[420px]
    " 
  />


  <div
    className="
      relative
      mx-auto
      max-w-[1440px]
      px-5 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20
    "
  >

    <div 
      className="
        mb-8 
        text-center
        sm:mb-10
      "
    >

      <h2 
        className="
          text-2xl 
          font-bold 
          text-[#111827]

          sm:text-4xl
        "
      >
        {t("standOut.title")}
      </h2>


      <p 
        className="
          mt-2 
          text-sm 
          text-gray-500

          sm:text-base
        "
      >
        {t("standOut.subtitle")}
      </p>

    </div>



    {/* CARD SCROLL */}

    <div className="relative">


      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="
          overflow-x-auto
          scrollbar-hide
          scroll-smooth
        "
      >

        <div 
          className="
            flex 
            w-max 
            gap-3
            pb-3
        {cards.map((item, index) => (

         <button
  key={item.title}
  type="button"
  className="
    group
    relative
    h-[320px]
    w-[240px]
    sm:h-[380px]
    sm:w-[290px]
    flex-shrink-0
    overflow-hidden
    rounded-[24px]
    text-left
  "
>

            <Image
              src={item.image}
              alt={item.title}
              fill
              className="
                object-cover 
                transition 
                duration-500 
                group-hover:scale-105
              "
            />


            sm:gap-9
          "
        >

          {cards.map((item) => (

            <button
              key={item.title}
              type="button"
              className="
                group
                relative
                h-[320px]
                w-[240px]

                sm:h-[380px]
                sm:w-[290px]

                flex-shrink-0
                overflow-hidden
                rounded-[24px]
                text-left
              "
            >

              <Image
                src={item.image}
                alt={item.title}
                fill
                className="
                  object-cover 
                  transition 
                  duration-500 
                  group-hover:scale-105
                "
              />


              <div 
                className="
                  absolute 
                  inset-0 
                  bg-gradient-to-t 
                  from-[#05638B] 
                  via-[#05638B]/40 
                  to-transparent
                "
              />


              <div 
                className="
                  absolute 
                  bottom-5 
                  left-5 
                  right-5 
                  text-white

                  sm:bottom-6
                  sm:left-6
                  sm:right-6
                "
              >
              <div
  className="
    mt-0
    max-h-0
    overflow-hidden
    opacity-0
    transition-all
    duration-500
    group-hover:mt-3
    group-hover:max-h-40
    group-hover:opacity-100
  "
>

                <h3 
                  className="
                    text-xl 
                    font-light

                    sm:text-2xl
                  "
                >
                  {item.title}
                </h3>


                <div
                  className="
                    mt-0
                    max-h-0
                    overflow-hidden
                    opacity-0
                    transition-all
                    duration-500

                    group-hover:mt-3
                    group-hover:max-h-40
                    group-hover:opacity-100
                  "
                >

                  <p className="text-sm leading-6">
                    {item.desc}
                  </p>

                </div>

              </div>

            </button>

          ))}

        </div>

      </div>



      {/* LEFT ARROW */}
          {showLeftArrow && (

            <button
              type="button"
              onClick={scrollLeft}
              className="
                absolute
                z-10

                left-[-12px]
                md:left-[-24px]

                top-1/2
                -translate-y-1/2

                flex
                h-10
                w-10
                md:h-12
                md:w-12

                items-center
                justify-center

                rounded-full
                bg-white/90
                shadow-xl
                backdrop-blur-sm

                transition
                duration-300
                hover:scale-110
              "
            >

              <span className="text-2xl md:text-3xl leading-none text-[#04BCBC]/70">
                ❮
              </span>

            </button>

          )}



          {/* RIGHT ARROW */}
          {showRightArrow && (

            <button
              type="button"
              onClick={scrollRight}
              className="
                absolute
                z-10

                right-[-12px]
                md:right-[-24px]

                top-1/2
                -translate-y-1/2

                flex
                h-10
                w-10
                md:h-12
                md:w-12

                items-center
                justify-center

                rounded-full
                bg-white/90
                shadow-xl
                backdrop-blur-sm

                transition
                duration-300
                hover:scale-110
              "
            >

              <span className="text-2xl md:text-3xl leading-none text-[#04BCBC]/70">
                ❯
              </span>

            </button>

          )}

    </div>


  </div>

</section>

    

{/* ================= POWERING ================= */}

      <section className="relative overflow-hidden py-16">

        <div className="bg-[#05BDBD] py-4">
          <h2 className="text-center text-2xl font-bold text-white">
  {t("powering.title")}
</h2>
        </div>


        <div className="overflow-hidden py-10">

          <div className="marquee flex w-max gap-8">

            {[...technologies, ...technologies].map((logo,index)=>(
              <div
                key={index}
                className="
                  flex 
                  h-24 
                  w-24 
                  items-center 
                  justify-center 
                  rounded-full 
                  bg-white 
                  shadow-lg
                "
              >

                <Image
                  src={logo}
                  alt=""
                  width={100}
                  height={100}
                  className="object-contain"
                />

              </div>
            ))}

          </div>

        </div>

      </section>



     {/* ================= CLIENT ================= */}

<section className="relative overflow-hidden py-3">


  <div className="overflow-hidden py-10">
    <div
  className="animate-scroll flex w-max gap-8"
  style={{
    animationDuration: "15s",
    animationTimingFunction: "linear",
    animationIterationCount: "infinite",
  }}
>
<section className="relative overflow-hidden py-5">


  <div className="overflow-hidden py-10">
    <div className="marquee flex w-max gap-8">
      {[...technologies, ...technologies].map((logo, index) => (
        <div
          key={index}
          className="flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-lg"
        >
          <Image
            src={logo}
            alt=""
            width={100}
            height={100}
            className="object-contain"
          />
        </div>
      ))}
    </div>
  </div>
</section>


    </main>
  );
}