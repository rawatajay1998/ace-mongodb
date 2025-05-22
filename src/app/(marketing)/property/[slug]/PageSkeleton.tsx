import { Skeleton } from "antd";

export default function PropertySkeleton() {
  return (
    <section className="property_content">
      <div className="container" style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Banner Skeleton */}
        <div className="flex w-full">
          <Skeleton.Input
            active
            style={{
              width: "100%",
              height: 400,
              marginBottom: 32,
              borderRadius: 12,
            }}
          />
        </div>

        <div
          className="property_single_row"
          style={{ display: "flex", gap: 32, alignItems: "flex-start" }}
        >
          {/* Left content */}
          <div style={{ flex: 3 }}>
            {/* Title and Developer */}
            <Skeleton.Input
              active
              style={{
                width: 320,
                height: 32,
                marginBottom: 16,
                borderRadius: 6,
              }}
            />
            <Skeleton.Input
              active
              style={{
                width: 180,
                height: 20,
                marginBottom: 24,
                borderRadius: 6,
              }}
            />

            {/* Price */}
            <Skeleton.Input
              active
              style={{
                width: 140,
                height: 28,
                marginBottom: 32,
                borderRadius: 6,
              }}
            />

            {/* Buttons */}
            <div style={{ display: "flex", gap: 16, marginBottom: 32 }}>
              <Skeleton.Button
                active
                style={{ width: 140, height: 40, borderRadius: 6 }}
              />
              <Skeleton.Button
                active
                style={{ width: 140, height: 40, borderRadius: 6 }}
              />
            </div>

            {/* Property details grid (3 rows max) */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 24,
                marginBottom: 32,
              }}
            >
              {[...Array(3)].map((_, i) => (
                <div key={i}>
                  <Skeleton.Input
                    active
                    style={{
                      width: 140,
                      height: 16,
                      marginBottom: 8,
                      borderRadius: 6,
                    }}
                  />
                  <Skeleton.Input
                    active
                    style={{ width: 100, height: 20, borderRadius: 6 }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: 1 }}>
            <Skeleton.Input
              active
              style={{
                width: "100%",
                height: 32,
                marginBottom: 24,
                borderRadius: 6,
              }}
            />
            {[...Array(3)].map((_, i) => (
              <Skeleton.Input
                key={i}
                active
                style={{
                  width: "100%",
                  height: 24,
                  marginBottom: 16,
                  borderRadius: 6,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
