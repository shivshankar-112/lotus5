"use client";

import { Suspense } from "react";
import PaymentContent from "./Pcmt";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentContent />
    </Suspense>
  );
}