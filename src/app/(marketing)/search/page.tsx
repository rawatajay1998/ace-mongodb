"use client";

import { Card, Col, Row, Spin } from "antd";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import PropertyCard from "@/components/marketing/PropertyCard";
import { IPropertyCardProps } from "@/types/PropertyCardProps";
import SearchBar from "./SearchBar";

const SearchResultsPage = () => {
  const searchParams = useSearchParams();
  const [results, setResults] = useState<IPropertyCardProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const params = new URLSearchParams();

        // Get all search parameters from the URL
        searchParams.forEach((value, key) => {
          params.append(key, value);
        });

        const res = await fetch(`/api/properties/search?${params.toString()}`);
        const data = await res.json();

        if (data.success) {
          setResults(data.data);
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="container py-12 flex justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <>
      <SearchBar />
      <section className="search_page">
        <div className="container py-8">
          <h1 className=" font-bold mb-6">Search Results ({results.length})</h1>

          {results.length === 0 ? (
            <Card>
              <p className="text-center py-8">
                No properties found matching your criteria
              </p>
            </Card>
          ) : (
            <Row gutter={[16, 16]}>
              {results.map((property: IPropertyCardProps) => (
                <Col key={Math.random()} xs={24} sm={12} lg={8}>
                  <PropertyCard item={property} />
                </Col>
              ))}
            </Row>
          )}
        </div>
      </section>
    </>
  );
};

export default SearchResultsPage;
