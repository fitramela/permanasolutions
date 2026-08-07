import Image from "next/image";
import ContactInfo from "./ContactInfo";
import ContactImage from "./ContactImage";

export default function HeroContact() {
  return (
    <section className="w-full bg-white pt-[72px] pb-[80px]">
      <div className="relative mx-auto h-[620px] max-w-[1280px]">

        {/* LEFT IMAGE */}
        <div
          className="
            absolute
            -left-1
            top-[-50px]

            h-[599px]
            w-[940px]
          "
        >
          <Image
            src="/images/brmudac.png"
            alt=""
            fill
            priority
            className="object-contain"
          />

          <div className="absolute inset-0 z-10">
            <ContactInfo />
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div
          className="
            absolute

            right-0
            top-[58px]

            h-[560px]
            w-[830px]
          "
        >
          

          <div className="absolute inset-0 z-10">
            <ContactImage />
          </div>
        </div>

      </div>
    </section>
  );
}