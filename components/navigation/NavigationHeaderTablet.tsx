"use client";

import ThemeChanger from "@/components/ThemeChanger";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import NavigationHeaderProps from "@/types/menuItem";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { GoHomeFill } from "react-icons/go";
import { MdDashboard } from "react-icons/md";
import { RxHamburgerMenu } from "react-icons/rx";

export const publicMenuItems = [{ title: "HOME", href: "/", icon: GoHomeFill }];

export const privateMenuItems = [
  { title: "DASHBOARD", href: "/dashboard", icon: MdDashboard },
];

export default function NavigationHeaderTablet({
  isLoggedIn,
}: NavigationHeaderProps) {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const menuItems = isLoggedIn ? privateMenuItems : publicMenuItems;
  const userName = session?.user?.name;

  return (
    <div className="flex w-full items-center justify-between backdrop-blur-xs p-4 border-b xl:px-8 rounded-b-2xl bg-white/80 dark:bg-zinc-900/80">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <Link href="/">
          <img
            src="/favicon.ico"
            alt="Portfolio Logo"
            className="rounded-full"
            width={40}
            height={40}
          />
        </Link>
        <Link href="/" className="font-semibold text-lg">
          {isLoggedIn && userName ? userName : "NooobtimeX"}
        </Link>
      </div>

      {/* Menu + Theme */}
      <div className="flex items-center gap-2">
        <Separator orientation="vertical" />
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant={"outline"} onClick={() => setOpen(true)}>
              MENU <RxHamburgerMenu />
            </Button>
          </SheetTrigger>
          <SheetContent className="p-2">
            <SheetHeader>
              <SheetTitle className="text-center">MENU</SheetTitle>
            </SheetHeader>

            {/* Menu Items */}
            <div className="flex flex-col space-y-2 py-2">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-muted rounded"
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.title}</span>
                </Link>
              ))}

              {/* Auth Actions */}
              {isLoggedIn ? (
                <Button
                  variant="destructive"
                  className="mx-4"
                  onClick={() => {
                    setOpen(false);
                    signOut();
                  }}
                >
                  🚪 Sign out
                </Button>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link href="/auth/signin" onClick={() => setOpen(false)}>
                    <Button variant="default" className="w-full">
                      Sign in
                    </Button>
                  </Link>
                  <Link href="/auth/signup" onClick={() => setOpen(false)}>
                    <Button variant="default" className="w-full">
                      Sign up
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <div className="mx-auto pt-4">
              <ThemeChanger />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
