import { notFound } from "next/navigation";
import PropertyDetailsClient from "./PropertyDetailsClient";

export default async function PropertyPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  // Fetch data in parallel
  const [res, paymentRes, relatedRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/property/${slug}`),
    fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment-plan?search=${slug}`
    ),
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/property/related/${slug}`),
  ]);

  if (!res.ok) notFound();

  const propertyData = await res.json();
  const paymentData = await paymentRes.json();
  const relatedData = relatedRes.ok
    ? await relatedRes.json()
    : { relatedProperties: [] };

  return (
    <PropertyDetailsClient
      property={propertyData.property}
      paymentPlans={paymentData.paymentPlans}
      relatedProperties={relatedData.relatedProperties}
      slug={slug}
    />
  );
}
