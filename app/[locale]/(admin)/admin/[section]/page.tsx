import {
  notFound,
} from "next/navigation";

import {
  AdminListPage,
} from "@/app/components/admin/AdminListPage";

const validSections = [
  "seo",
  "social-media",
  "messages",
  "users",
  "settings",
];

export default async function Page({
  params,
}: {
  params: Promise<{
    section: string;
  }>;
}) {
  const {
    section,
  } =
    await params;

  if (
    !validSections.includes(
      section
    )
  ) {
    notFound();
  }

  return (
    <AdminListPage
      type={
        section
      }
    />
  );
}