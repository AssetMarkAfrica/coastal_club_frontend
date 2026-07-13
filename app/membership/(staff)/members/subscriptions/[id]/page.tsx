import { redirect } from "next/navigation";

/**
 * Subscription detail is rendered as a slide-in panel on the list page.
 * Any direct visit to this route redirects back to the list.
 */
export default function SubscriptionDetailPage({
  params,
}: {
  params: { id: string };
}) {
  redirect(`/membership/members/subscriptions?detail=${params.id}`);
}
