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
    key: "flight",
    label: "Flight",
    path: "/flight",
    defaultTitle: "Cheap Flights & Air Tickets — New Global Tour Life",
    defaultDescription:
      "Book domestic and international flights at the best fares. Compare airlines and grab exclusive deals.",
  },
  {
    key: "about",
    label: "About Us",
    path: "/about",
    defaultTitle: "About Us — New Global Tour Life",
    defaultDescription:
      "Your trusted travel partner for cabs, hotels, tour packages and pilgrimages across India and abroad.",
  },
];

export function getSeoPage(key: string): SeoPageDef | undefined {
  return SEO_PAGES.find((p) => p.key === key);
}
