"use client";

import MessagesPage from "./messages/MessagesPage";
import SeoPage from "./seo/SeoPage";
import SettingsPage from "./settings/SettingsPage";
import SocialMediaPage from "./settings/SocialMediaPage";
import UsersPage from "./users/UsersPage";

import EmptyState from "./shared/EmptyState";
import SectionHeader from "./shared/SectionHeader";

type Props = {
  type: string;
};

export function AdminListPage({
  type,
}: Props) {
  switch (type) {
    case "messages":
      return (
        <MessagesPage />
      );

    case "users":
      return (
        <UsersPage />
      );

    case "settings":
      return (
        <SettingsPage />
      );

    case "social-media":
      return (
        <SocialMediaPage />
      );

    case "seo":
      return (
        <SeoPage />
      );

    default:
      return (
        <>
          <SectionHeader
            title="Admin"
            desc="Halaman admin belum tersedia."
          />

          <EmptyState>
            Menu "{type}" belum memiliki tampilan.
          </EmptyState>
        </>
      );
  }
}

export default AdminListPage;