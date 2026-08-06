import { notFound } from "next/navigation";
import EmptyTablePage from "@/app/components/admin/EmptyTablePage";

const pages: Record<string,{title:string;description:string;columns:string[]}> = {
  products:{title:"Produk",description:"Kelola seluruh produk ASP dan ISP.",columns:["Nama Produk","Layanan","Kategori","Urutan"]},
  clients:{title:"Klien",description:"Kelola nama, logo, industri, dan penempatan klien.",columns:["Logo","Nama Klien","Industri","Penempatan","Urutan"]},
  technologies:{title:"Teknologi / Library",description:"Kelola teknologi yang digunakan pada Consulting & Resource.",columns:["Logo","Nama Teknologi","Kategori","Urutan"]},
  team:{title:"Anggota Tim",description:"Kelola profil anggota tim perusahaan.",columns:["Foto","Nama","Jabatan","Urutan"]},
};

export default async function Page({ params }:{ params:Promise<{type:string}> }) {
  const { type } = await params;
  const page = pages[type];
  if (!page) notFound();
  return <EmptyTablePage {...page} />;
}
