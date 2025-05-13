import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "./globals.css";
import WebsiteHeader from "@/components/marketing/Header";
import WebsiteFooter from "@/components/marketing/Footer";
import { Toaster } from "react-hot-toast";

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700"], // Choose the weights you need
  display: "swap",
});

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
      <body className={`${lato.className} antialiased`}>
        <WebsiteHeader />
        {children}
        <WebsiteFooter />
        <Toaster />
      </body>
    </html>
  );
}
