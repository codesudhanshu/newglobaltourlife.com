// Registry of pages whose SEO is manageable from the admin panel.
// `key` is the stable PageSeo.pageKey; `path` is the public route.

export type SeoPageDef = {
  key: string;
  label: string;
  path: string;
  defaultTitle: string;
  defaultDescription: string;
};

export const SEO_PAGES: SeoPageDef[] = [
  {
    key: "home",
    label: "Home",
    path: "/",
    defaultTitle: "New Global Tour Life - Cab-Car Hire, Tour & Travel Services",
    defaultDescription:
      "Premium tours across India & international destinations. Book Goa, Rajasthan, Kerala, Maldives, Dubai, Thailand and more.",
  },
  {
    key: "about",
    label: "About Us",
    path: "/about",
    defaultTitle: "About Us — New Global Tour Life",
    defaultDescription:
      "Your trusted travel partner for cabs, hotels, tour packages and pilgrimages across India and abroad.",
  },
  {
    key: "flight",
    label: "Flight",
    path: "/flight",
    defaultTitle: "Cheap Flights & Air Tickets — New Global Tour Life",
    defaultDescription:
      "Book domestic and international flights at the best fares. Compare airlines and grab exclusive deals.",
  },
  {
    key: "cars",
    label: "Cars",
    path: "/cars",
    defaultTitle: "Car Rental & Cab Booking — New Global Tour Life",
    defaultDescription:
      "Book cars and cabs for local, outstation and airport transfers. Sedans, SUVs, tempo travellers and luxury cars.",
  },
  {
    key: "hotels",
    label: "Hotels",
    path: "/hotels",
    defaultTitle: "Hotel Booking — New Global Tour Life",
    defaultDescription:
      "Book budget to luxury hotels across India and abroad at the best rates.",
  },
  {
    key: "packages",
    label: "Packages",
    path: "/packages",
    defaultTitle: "Tour Packages — New Global Tour Life",
    defaultDescription:
      "Domestic and international holiday packages, customized to your budget and dates.",
  },
  {
    key: "destinations",
    label: "Destinations",
    path: "/destinations",
    defaultTitle: "Travel Destinations — New Global Tour Life",
    defaultDescription:
      "Explore trending destinations across India and the world with curated tour packages.",
  },
  {
    key: "tirth-yatra",
    label: "Tirth Yatra",
    path: "/tirth-yatra",
    defaultTitle: "Tirth Yatra — Pilgrimage Tours — New Global Tour Life",
    defaultDescription:
      "Sacred pilgrimage tours to India's most revered shrines with comfortable travel and darshan arrangements.",
  },
  {
    key: "bus",
    label: "Bus Booking",
    path: "/bus",
    defaultTitle: "Bus Booking — New Global Tour Life",
    defaultDescription:
      "Comfortable bus travel across India. Book intercity and outstation bus services.",
  },
  {
    key: "visa",
    label: "Visa",
    path: "/visa",
    defaultTitle: "Visa Services — New Global Tour Life",
    defaultDescription:
      "Hassle-free visa assistance for popular international destinations.",
  },
  {
    key: "travel-guide",
    label: "Travel Guides",
    path: "/travel-guide",
    defaultTitle: "Tour Guides — New Global Tour Life",
    defaultDescription:
      "Experienced local tour guides for a richer, hassle-free travel experience.",
  },
  {
    key: "blogs",
    label: "Blogs",
    path: "/blogs",
    defaultTitle: "Travel Blog — New Global Tour Life",
    defaultDescription:
      "Travel tips, destination guides and stories from across India and the world.",
  },
  {
    key: "services",
    label: "Services",
    path: "/services",
    defaultTitle: "Our Services — New Global Tour Life",
    defaultDescription:
      "Car rental, hotels, flights, tour packages, visa and more — all your travel needs in one place.",
  },
  {
    key: "contact",
    label: "Contact",
    path: "/contact",
    defaultTitle: "Contact Us — New Global Tour Life",
    defaultDescription:
      "Get in touch with our travel experts for bookings and enquiries. Available 24/7.",
  },
];

export function getSeoPage(key: string): SeoPageDef | undefined {
  return SEO_PAGES.find((p) => p.key === key);
}
