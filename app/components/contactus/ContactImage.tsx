import Image from "next/image";

export default function ContactImage() {
  return (
    <div className="contact-image">

      {/* Gambar Customer Service */}
      <Image
        src="/images/birups.png"
        alt="Customer Service"
        width={700}
        height={550}
        className="contact-person"
      />

      {/* Logo Permana */}
      <Image
        src="/images/SP1.png"
        alt="Permana Solutions"
        width={220}
        height={60}
        className="contact-logo"
      />

    </div>
  );
}