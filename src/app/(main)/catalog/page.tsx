"use client";

import { Suspense } from "react";
import Navbar from "@/shared/components/navbar";
import CatalogLoading from "./components/CatalogLoading";
import CatalogContent from "./components/CatalogContent";

export default function Catalog() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <Suspense fallback={<CatalogLoading />}>
        <CatalogContent />
      </Suspense>
    </main>
  );
}
