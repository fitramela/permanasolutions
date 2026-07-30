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

          <h2
            className="
            text-3xl
            font-bold
            text-[#005D86]

            md:text-4xl

            lg:text-5xl
          "
          >
            Meet Our Exceptional Team
          </h2>

          <h3
            className="
            mt-3

            text-2xl
            font-bold

            text-[#005D86]

            md:text-3xl

            lg:text-[38px]
          "
          >
            The People Behind Permana Solutions
          </h3>

          <p
            className="
            mx-auto

            mt-6

            max-w-2xl

            text-[15px]

            leading-8

            text-[#6D6D6D]

            lg:text-base
          "
          >
            Driven by innovation and united by a shared vision, our
            professionals work together to deliver reliable engineering,
            technology, and digital solutions for every client.
          </p>

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