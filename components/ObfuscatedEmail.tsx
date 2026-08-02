"use client";

import { useEffect, useState } from "react";

// Keeps the address out of the served HTML so scrapers/spam bots can't harvest it.
// The local part and domain travel separately and are joined in the browser after
// mount; before that the link points at the contact form.
export default function ObfuscatedEmail({
  user,
  domain,
  className = "",
  label,
  children,
}: {
  user: string;
  domain: string;
  className?: string;
  label?: string;
  children?: React.ReactNode;
}) {
  const [address, setAddress] = useState("");

  useEffect(() => {
    setAddress([user, domain].join(String.fromCharCode(64)));
  }, [user, domain]);

  if (!address) {
    return (
      <a href="/contact" className={className}>
        {children}
        {label || "Email us"}
      </a>
    );
  }

  return (
    <a href={`mailto:${address}`} className={className}>
      {children}
      {label || address}
    </a>
  );
}
