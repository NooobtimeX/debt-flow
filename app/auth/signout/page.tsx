"use client";

import { signOut } from "next-auth/react";
import { useEffect } from "react";

export default function SignOutPage() {
  useEffect(() => {
    signOut({ callbackUrl: "/auth/signin" });
  }, []);

  return (
    <div>
      <p>Signing out...</p>
    </div>
  );
}
