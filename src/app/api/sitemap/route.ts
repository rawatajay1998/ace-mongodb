import { exec } from "child_process";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  exec("npx next-sitemap", (error) => {
    if (error) {
      console.error(`Sitemap generation error: ${error}`);
      return res.status(500).json({ error: "Failed to generate sitemap" });
    }
    return res.status(200).json({ message: "Sitemap generated successfully" });
  });
}
