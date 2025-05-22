"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { TrendingUp, TrendingDown } from "lucide-react";

interface Stat {
  _id: string;
  label: string;
  icon: "TrendingUp" | "TrendingDown";
}

export default function SiteStatsBar() {
  const [stats, setStats] = useState<Stat[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      const res = await axios.get("/api/analytics");
      setStats(res.data);
    };
    fetchStats();
  }, []);

  const renderIcon = (icon: "TrendingUp" | "TrendingDown") => {
    switch (icon) {
      case "TrendingDown":
        return <TrendingDown size={16} color="red" />;
      case "TrendingUp":
      default:
        return <TrendingUp size={16} color="green" />;
    }
  };

  const repeatedStats = [...stats, ...stats]; // Duplicate for seamless scroll

  return (
    <div className="bg-[#0a0f1a] py-3 overflow-hidden text-white">
      <div className="marquee">
        <div className="marquee-track">
          {repeatedStats.map((stat, idx) => (
            <div
              key={idx}
              className="stat-item inline-flex items-center px-4 text-sm font-medium gap-2 whitespace-nowrap"
            >
              {renderIcon(stat.icon)}
              <p className="text-white">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
