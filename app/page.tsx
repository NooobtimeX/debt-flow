"use client";

import { useState } from "react";

export default function HomePage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <main className="p-4 max-w-5xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-center">
        แอปคำนวณรายรับและการผ่อนหนี้
      </h1>
    </main>
  );
}
