/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://aceeliteproperties.com",
  generateRobotsTxt: true,
  outDir: "public",

  additionalPaths: async () => {
    const [citiesRes, propertiesRes] = await Promise.all([
      fetch("https://aceeliteproperties.com/api/cities"),
      fetch("https://aceeliteproperties.com/api/properties"),
    ]);

    const cities = await citiesRes.json();
    const properties = await propertiesRes.json();

    const propertyTypes = ["Apartment", "Office", "Villa"];

    const searchPages = cities.flatMap((city) =>
      propertyTypes.map((type) => ({
        loc: `/search/${city.name}?propertyTypeName=${encodeURIComponent(type)}`,
        changefreq: "daily",
        priority: 0.8,
      }))
    );

    const propertyPages = properties.map((property) => ({
      loc: `/property/${property.slug}`,
      changefreq: "weekly",
      priority: 0.7,
    }));

    return [...searchPages, ...propertyPages];
  },
};
