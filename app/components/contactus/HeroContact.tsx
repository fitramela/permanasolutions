import ContactInfo from "./ContactInfo";
import ContactImage from "./ContactImage";

export default function HeroContact() {
  return (
    <section className="relative mt-[72px] overflow-hidden bg-white">
      <div className="mx-auto max-w-[1400px] px-5 py-12 lg:px-8">

        <div className="relative h-[620px]">

          {/* Circle Decoration */}
          <div className="absolute left-[240px] top-1/2 hidden h-[520px] w-[520px] -translate-y-1/2 rounded-full border-[8px] border-[#0098C6]/10 lg:block" />

          {/* Left Card */}
          <div
            className="
              absolute
              left-0
              top-6

              h-[500px]
              w-[60%]

              rounded-[28px]

              bg-[#16C5C7]
            "
          />

          {/* Right Card */}
          <div
            className="
              absolute

              right-0
              top-14

              h-[540px]
              w-[64%]

              overflow-hidden

              rounded-[34px]

              bg-gradient-to-br
              from-[#0D96B8]
              to-[#076A91]

              shadow-[0_25px_70px_rgba(0,0,0,.18)]
            "
          >
            <ContactImage />
          </div>

          {/* Left Text */}
          <div className="absolute left-[90px] top-[160px] z-20">
            <ContactInfo />
          </div>

          {/* Dots Left */}
          <div className="absolute bottom-16 left-8 z-20 hidden grid-cols-2 gap-4 lg:grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <span
                key={i}
                className="h-3.5 w-3.5 rounded-full bg-white/35"
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}