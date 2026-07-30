import Image from "next/image";

export default function ContactImage() {
  return (
    <div className="relative h-full w-full">

      {/* Circle Decoration */}
      <div
        className="
          absolute
          left-1/2
          top-1/2
          h-[560px]
          w-[560px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          border-[6px]
          border-white/5
        "
      />

      {/* Logo */}
      <div className="absolute left-12 top-14 z-20">
        <Image
          src="/images/SP1.png"
          alt="Permana Solutions"
          width={230}
          height={56}
          priority
          className="h-auto w-[190px] lg:w-[230px]"
        />
      </div>

      {/* Right Dots */}
      <div className="absolute right-8 top-1/2 z-20 hidden -translate-y-1/2 lg:grid grid-cols-2 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <span
            key={i}
            className="h-3.5 w-3.5 rounded-full bg-white/20"
          />
        ))}
      </div>

      {/* Customer Service */}
      <div className="absolute bottom-0 right-0 z-10">
        <Image
          src="/images/birups.png"
          alt="Customer Service"
          width={760}
          height={620}
          priority
          className="
            h-auto
            w-[360px]

            md:w-[470px]

            lg:w-[620px]

            xl:w-[700px]

            object-contain
          "
        />
      </div>
    </div>
  );
}