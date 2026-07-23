"use client";

import { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import TeamCard from "./teamcard";
import { teamData } from "./teamdata";

export default function TeamSection() {
  const t = useTranslations("About.team");

  const [active, setActive] = useState(0);

  const scrollRef = useRef<HTMLDivElement>(null);


  return (
    <section className="bg-[#F7F9FB] py-20">

      <div className="mx-auto max-w-[1500px] px-6 lg:px-16">


        {/* TITLE */}
        <div className="text-center">

          <h2 className="font-serif text-4xl font-bold text-[#005D86]">
            {t("title")}
          </h2>


          <h3 className="mt-3 text-3xl font-bold text-[#005D86]">
            {t("subtitle")}
          </h3>


          <p className="mx-auto mt-5 max-w-4xl text-gray-500">
            {t("description")}
          </p>

        </div>



        {/* CARD SLIDER */}
        <div
          ref={scrollRef}
          className="
          mt-20
          flex
          gap-8
          overflow-x-auto
          pb-10
          scrollbar-hide
          "
        >

          {teamData.map((member,index)=>(

            <div
              key={member.name}
              className="
              min-w-[300px]
              "
            >

              <TeamCard

                {...member}

                active={active === index}

                onClick={()=>{
                  setActive(index)
                }}

              />

            </div>

          ))}


        </div>


      </div>

    </section>
  );
}