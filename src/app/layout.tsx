import type { Metadata } from "next";
import "./globals.css";
import WebsiteHeader from "@/components/marketing/Header";
import WebsiteFooter from "@/components/marketing/Footer";
import { Toaster } from "react-hot-toast";
import RouteLoader from "@/components/common/progressBar";
import ScrollToTop from "@/components/common/ScrollToTop";
import { Suspense } from "react";
import AlwaysViewTop from "@/components/marketing/AlwaysViewTop";
import Image from "next/image";

export const metadata: Metadata = {
  icons: {
    icon: "/favicon.png",
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
        {/* Custom Font */}
        <link
          href="https://fonts.cdnfonts.com/css/futura-pt"
          rel="stylesheet"
        />

        {/* Google Analytics */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-B03JVGPLE9"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-B03JVGPLE9');
            `,
          }}
        />

        {/* Meta Pixel Code */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '1631820150778366');
              fbq('track', 'PageView');
            `,
          }}
        />
      </head>
      <body>
        {/* Meta Pixel NoScript fallback */}
        <noscript>
          <Image
            alt="Facebook Pixel Code"
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1631820150778366&ev=PageView&noscript=1"
          />
        </noscript>

        {/* App Components */}
        <AlwaysViewTop />
        <Suspense fallback={null}>
          <RouteLoader />
        </Suspense>
        <WebsiteHeader />
        {children}
        <WebsiteFooter />
        <Toaster />
        <ScrollToTop />
      </body>
    </html>
  );
}
