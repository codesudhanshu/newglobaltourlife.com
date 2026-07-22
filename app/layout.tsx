import type { Metadata } from "next";
import "./globals.css";
import WhatsAppButton from "@/components/WhatsAppButton";
import { getSiteConfig, organizationJsonLd } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "New Global Tour Life - Cab-Car Hire, Tour & Travel Services",
  description: "New Global Tour Life - Cab-Car Hire, Tour & Travel Services. Premium tours across India & international destinations. Book Goa, Rajasthan, Kerala, Maldives, Dubai, Thailand and more.",
  keywords: "New Global Tour Life, cab hire Indore, car rental Indore, tour packages India, travel services, Goa tour, Rajasthan tour, Kerala tour",
  authors: [{ name: "New Global Tour Life" }],
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cfg = await getSiteConfig();

  return (
    <html lang="en">
      <head>
        {/* Google Search Console */}
        <meta name="google-site-verification" content="google6eba223b15b34690.html" />

        {/* Google Analytics (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-HDX5QM2C4N" />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-HDX5QM2C4N');`,
          }}
        />

        {cfg.gscVerification && (
          <meta name="google-site-verification" content={cfg.gscVerification} />
        )}

        {/* Organization structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: organizationJsonLd(cfg) }}
        />

        {/* Google Tag Manager */}
        {cfg.gtmId && (
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${cfg.gtmId}');`,
            }}
          />
        )}

        {/* Google Analytics (GA4) */}
        {cfg.gaId && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${cfg.gaId}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${cfg.gaId}');`,
              }}
            />
          </>
        )}

        {/* Extra admin-provided head scripts / meta */}
        {cfg.headScripts && (
          <div dangerouslySetInnerHTML={{ __html: cfg.headScripts }} suppressHydrationWarning />
        )}
      </head>
      <body suppressHydrationWarning>
        {/* GTM noscript */}
        {cfg.gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${cfg.gtmId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}
        {children}
        <WhatsAppButton />
      </body>
    </html>
  );
}
