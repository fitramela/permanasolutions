import AdminShell from "../../../components/admin/AdminShell";
export default async function Layout({children,params}:{children:React.ReactNode;params:Promise<{locale:string}>}){const {locale}=await params;return <AdminShell locale={locale}>{children}</AdminShell>}
