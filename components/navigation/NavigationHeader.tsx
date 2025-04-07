"use client";

import NavigationHeaderDesktop from "@/components/navigation/NavigationHeaderDesktop";
import NavigationHeaderMobile from "@/components/navigation/NavigationHeaderMobile";
import NavigationHeaderTablet from "@/components/navigation/NavigationHeaderTablet";
import { useSession } from "next-auth/react";

export default function NavigationHeader() {
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;

  return (
    <nav className="z-50 fixed bottom-0 left-0 right-0 md:sticky md:top-0 max-w-full">
      {/* Desktop Header: lg and up */}
      <div className="hidden lg:block">
        <NavigationHeaderDesktop isLoggedIn={isLoggedIn} />
      </div>

      {/* Tablet Header: md only */}
      <div className="hidden md:block lg:hidden">
        <NavigationHeaderTablet isLoggedIn={isLoggedIn} />
      </div>

      {/* Mobile Header: below md */}
      <div className="block md:hidden">
        <NavigationHeaderMobile isLoggedIn={isLoggedIn} />
      </div>
    </nav>
  );
}
