"use client";

import BackgroundCanvas from "./BackgroundCanvas";
import OurProfile from "./OurProfile"
import PermanaSolutions from "./PermanaSolutions";
import VisionMission from "./visionmission";
import  MeetTeam  from "./MeetTeam";
import  TeamSection  from "./teamsection";

export default function CompanySection() {
  return (
    <section
  id="company"
  className="
    relative
    overflow-hidden
    -mt-[80px]
    z-30
  "
>
      {/* Background Decoration */}

      <BackgroundCanvas />

      {/* Content */}

      <div
        className="
          relative
          z-10

          mx-auto

          w-full

          max-w-[1440px]

          px-[100px]

          xl:px-[100px]

          lg:px-[70px]

          md:px-[40px]

          sm:px-6
        "
      >
        <OurProfile />

        <PermanaSolutions />

        <VisionMission />

        <MeetTeam />

        <TeamSection />
      </div>
    </section>
  );
}