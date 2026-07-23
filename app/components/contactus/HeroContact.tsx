import "./styles.css";
import ContactInfo from "./ContactInfo";
import ContactImage from "./ContactImage";

export default function HeroContact() {
  return (
    <section className="contact-hero">

      <div className="contact-wrapper">

        {/* Background Hijau */}
        <div className="contact-bg"></div>

        {/* Lingkaran */}
        <div className="contact-circle"></div>

        {/* Isi */}
        <div className="contact-content">

          <ContactInfo />

          <ContactImage />

        </div>

        {/* Dot kiri */}
        <div className="contact-dots-left">
          {Array.from({ length: 8 }).map((_, index) => (
            <span key={index}></span>
          ))}
        </div>

      </div>

    </section>
  );
}