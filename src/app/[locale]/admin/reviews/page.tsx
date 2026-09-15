import { redirect } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

export default async function AdminReviewsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  redirect({ href: "/admin", locale });
}
