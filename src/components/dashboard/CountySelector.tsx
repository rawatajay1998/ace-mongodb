// components/CountrySelector.tsx
"use client";
import { useEffect, useState } from "react";

type Country = {
  code: string;
  name: string;
  cities: string[];
};

export default function CountrySelector() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("/api/location");
        const data = await response.json();

        if (data.success) {
          setCountries(data.data);
        }
      } catch (error) {
        console.error("Failed to load countries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  if (loading) return <div>Loading countries...</div>;

  return (
    <select>
      {countries.map((country) => (
        <option key={country.code} value={country.code}>
          {country.name}
        </option>
      ))}
    </select>
  );
}
