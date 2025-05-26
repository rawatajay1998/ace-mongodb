"use client";

import { useEffect, useState, useMemo } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface Stat {
  _id: string;
  label: string;
  icon: "TrendingUp" | "TrendingDown";
  url: string;
}

export default function SiteStatsBar() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [show, setShow] = useState(false);

  // Fetch data ASAP
  useEffect(() => {
    fetch("/api/analytics")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(console.error);
  }, []);

  // Show after delay
  useEffect(() => {
    const timeout = setTimeout(() => {
      setShow(true);
    }, 200);
    return () => clearTimeout(timeout);
  }, []);

  const renderIcon = (icon: "TrendingUp" | "TrendingDown") =>
    icon === "TrendingDown" ? (
      <TrendingDown size={16} color="red" />
    ) : (
      <TrendingUp size={16} color="#11FE08" />
    );

  const renderedStats = useMemo(() => {
    const repeated = [...stats, ...stats];
    return repeated.map((stat, idx) => (
      <div
        key={idx}
        className="inline-flex items-center px-4 text-sm gap-2 whitespace-nowrap"
      >
        {renderIcon(stat.icon)}
        {stat.url ? (
          <a
            href={stat.url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-blue-300 text-white"
          >
            {stat.label}
          </a>
        ) : (
          <p className="text-white">{stat.label}</p>
        )}
      </div>
    ));
  }, [stats]);

  if (!show || stats.length === 0) return null;

  return (
    <div
      className="site-stats-bar bg-[#0A264A] py-3 overflow-hidden text-white animate-appear"
      style={{
        whiteSpace: "nowrap",
        position: "relative",
        opacity: 0,
        animation: "fadeInSlide 0.8s ease-out forwards",
      }}
    >
      <div
        style={{
          display: "inline-block",
          minWidth: "100vw",
          animation: "scroll 30s linear infinite",
        }}
      >
        {renderedStats}
      </div>

      {/* Inline styles to ensure immediate load */}
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes fadeInSlide {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
