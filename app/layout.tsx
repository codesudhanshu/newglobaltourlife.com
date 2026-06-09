import type { Metadata } from "next";
import "./globals.css";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
