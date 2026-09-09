export type FieldType = "text" | "textarea" | "url" | "number" | "image" | "select";
export type FieldDefinition = { key:string; label:string; type:FieldType; placeholder?:string; help?:string; options?:string[] };
export type SectionDefinition = { id:string; title:string; subtitle:string; fields:FieldDefinition[] };
export type PageDefinition = { title:string; description:string; breadcrumb:string[]; sections:SectionDefinition[] };

const heroFields: FieldDefinition[] = [
  { key:"labelId", label:"Label kecil — Indonesia", type:"text", placeholder:"Masukkan label kecil" },
  { key:"labelEn", label:"Small label — English", type:"text", placeholder:"Enter small label" },
  { key:"titleId", label:"Judul — Indonesia", type:"textarea", placeholder:"Masukkan judul utama" },
  { key:"titleEn", label:"Title — English", type:"textarea", placeholder:"Enter main title" },
  { key:"descriptionId", label:"Deskripsi — Indonesia", type:"textarea", placeholder:"Masukkan deskripsi" },
  { key:"descriptionEn", label:"Description — English", type:"textarea", placeholder:"Enter description" },
  { key:"background", label:"Gambar background", type:"image", help:"Format JPG, PNG, atau WebP." },
  { key:"mainImage", label:"Gambar utama", type:"image", help:"Gunakan gambar beresolusi tinggi." },
  { key:"buttonLabel", label:"Teks tombol", type:"text", placeholder:"Contoh: Hubungi Kami" },
  { key:"buttonUrl", label:"URL tombol", type:"url", placeholder:"/id/contact-us" },
];

const contentFields: FieldDefinition[] = [
  { key:"sectionTitleId", label:"Judul section — Indonesia", type:"text", placeholder:"Masukkan judul section" },
  { key:"sectionTitleEn", label:"Section title — English", type:"text", placeholder:"Enter section title" },
  { key:"sectionDescriptionId", label:"Deskripsi — Indonesia", type:"textarea", placeholder:"Masukkan deskripsi section" },
  { key:"sectionDescriptionEn", label:"Description — English", type:"textarea", placeholder:"Enter section description" },
  { key:"sectionImage", label:"Gambar section", type:"image" },
  { key:"layout", label:"Posisi gambar", type:"select", options:["Kiri","Kanan","Background"] },
];

function createPage(title:string, description:string, extraSections:SectionDefinition[] = []): PageDefinition {
  return {
    title,
    description,
    breadcrumb:["Dashboard", title],
    sections:[
      { id:"hero", title:"Hero Section", subtitle:"Kelola teks, gambar, dan tombol pada bagian paling atas.", fields:heroFields },
      { id:"content", title:"Konten Utama", subtitle:"Kelola konten utama halaman.", fields:contentFields },
      ...extraSections,
      { id:"seo", title:"SEO", subtitle:"Kelola metadata halaman.", fields:[
        { key:"metaTitle", label:"Meta title", type:"text", placeholder:"Masukkan meta title" },
        { key:"metaDescription", label:"Meta description", type:"textarea", placeholder:"Masukkan meta description" },
        { key:"ogImage", label:"Open Graph image", type:"image" },
      ] },
    ],
  };
}

export const pageDefinitions: Record<string,PageDefinition> = {
  home:createPage("Beranda","Kelola seluruh bagian pada halaman utama.",[
    { id:"about",title:"Tentang Kami Singkat",subtitle:"Kelola profil singkat perusahaan.",fields:contentFields },
    { id:"systems",title:"Smart System",subtitle:"Kelola judul dan pengaturan daftar sistem.",fields:contentFields },
    { id:"clients",title:"Klien Kami",subtitle:"Kelola tampilan section klien.",fields:[
      { key:"clientsTitleId",label:"Judul — Indonesia",type:"text",placeholder:"Masukkan judul" },
      { key:"clientsTitleEn",label:"Title — English",type:"text",placeholder:"Enter title" },
      { key:"clientsLayout",label:"Model tampilan",type:"select",options:["Slider","Grid"] },
      { key:"clientsLimit",label:"Jumlah logo",type:"number",placeholder:"0" },
    ] },
  ]),
  solutions:createPage("Solusi","Kelola halaman solusi perusahaan."),
  about:createPage("Tentang Kami","Kelola profil, visi misi, dan tim perusahaan."),
  contact:createPage("Kontak","Kelola informasi kontak, peta, dan CTA."),
  asp:createPage("ASP","Kelola hero, kategori, produk, fitur, dan CTA ASP."),
  isp:createPage("ISP","Kelola hero, paket, connectivity service, managed service, dan CTA ISP."),
  resource:createPage("Consulting & Resource","Kelola layanan consulting, posisi resource, dan teknologi.",[
    { id:"technologies",title:"Teknologi / Library",subtitle:"Kelola judul dan tampilan teknologi.",fields:[
      { key:"techTitleId",label:"Judul — Indonesia",type:"text",placeholder:"Masukkan judul" },
      { key:"techTitleEn",label:"Title — English",type:"text",placeholder:"Enter title" },
      { key:"techLayout",label:"Model tampilan",type:"select",options:["Grid","Slider"] },
      { key:"techLimit",label:"Jumlah teknologi",type:"number",placeholder:"0" },
    ] },
  ]),
};
