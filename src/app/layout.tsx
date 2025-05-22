import type { Metadata } from "next";
import "./globals.css";
import WebsiteHeader from "@/components/marketing/Header";
import WebsiteFooter from "@/components/marketing/Footer";
import { Toaster } from "react-hot-toast";
import RouteLoader from "@/components/common/progressBar";

export const metadata: Metadata = {
  icons: {
    icon: "/favicon.png", // Globally used favicon
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.cdnfonts.com/css/futura-pt"
          rel="stylesheet"
        />
      </head>
      <body>
        <RouteLoader />
        <WebsiteHeader />
        {children}
        <WebsiteFooter />
        <Toaster />
      </body>
    </html>
  );
}
