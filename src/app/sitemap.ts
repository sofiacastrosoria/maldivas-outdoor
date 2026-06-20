import type { MetadataRoute } from "next";
import { products } from "@/data/products";

const BASE = "https://maldivas-outdoor.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/productos",
    "/productos/reposeras",
    "/productos/living",
    "/productos/comedor",
    "/materiales",
    "/materiales/aluminio",
    "/materiales/telas",
    "/materiales/goma-espuma",
    "/materiales/piedras",
    "/contacto",
    "/faq",
  ].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const productRoutes = products.map((p) => {
    let path = `/productos/${p.category}/${p.slug}`;
    if (p.category === "mesas") {
      path = `/productos/living/mesas/${p.slug}`;
    }
    return {
      url: `${BASE}${path}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    };
  });

  return [...staticRoutes, ...productRoutes];
}
