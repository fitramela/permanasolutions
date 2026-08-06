"use client";

import TeamCard from "./teamcard";
import { teamData } from "./teamdata";

export default function TeamSection() {
  return (
    <section className="relative overflow-hidden bg-[#F7FCFE] py-20 lg:py-28">

      {/* Glow */}
      <div className="absolute -left-40 top-20 h-[340px] w-[340px] rounded-full bg-[#7BE7FF]/20 blur-[120px]" />

      <div className="absolute -right-40 bottom-10 h-[340px] w-[340px] rounded-full bg-[#8DDFFF]/20 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10 lg:px-16">

        {/* Heading */}

        <div className="mx-auto max-w-3xl text-center">

          

        </div>

        {/* Team */}

        <div
          className="
          mt-20

          flex

          gap-6

          overflow-x-auto

          scroll-smooth

          snap-x

          snap-proximity

          px-1

          pt-24

          pb-6

          scrollbar-hide
        "
        >
          {teamData.map((member) => (
            <div
              key={member.id}
              className="
                snap-start

                shrink-0

                w-[88%]

                sm:w-[340px]

                lg:w-[310px]
              "
            >
              <TeamCard member={member} />
            </div>
          ))}
        </div>

      </div>

    </section>
  );
}