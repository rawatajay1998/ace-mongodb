import { notFound } from "next/navigation";
import PropertyDetailsClient from "./PropertyDetailsClient";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/property/${params.slug}`
  );

  if (!res.ok) return { title: "Property Not Found" };

  const data = await res.json();
  const property = data.property;

  return {
    title: `${property.projectName} in ${property.cityName} | ${property.propertyTypeName}`,
    description: `Explore ${property.projectName}, a premium ${property.propertyTypeName} in ${property.cityName}. Price starts at ${property.propertyPrice ? `AED ${property.propertyPrice.toLocaleString()}` : "competitive rates"}. Learn more about amenities, payment plans, and more.`,
  };
}

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
