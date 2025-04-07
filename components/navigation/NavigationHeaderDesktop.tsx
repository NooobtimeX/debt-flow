"use client";

import ThemeChanger from "@/components/ThemeChanger";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import NavigationHeaderProps from "@/types/menuItem";
import { ChevronDown, UserRound } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { GiBrain } from "react-icons/gi";
import { MdDashboard } from "react-icons/md";
import { Button } from "../ui/button";

export const publicMenuItems = [{ title: "HOME", href: "/", icon: GiBrain }];

export const privateMenuItems = [
  { title: "DASHBOARD", href: "/dashboard", icon: MdDashboard },
];

export default function NavigationHeaderDesktop({
  isLoggedIn,
}: NavigationHeaderProps) {
  const { data: session } = useSession();
  const menuItems = isLoggedIn ? privateMenuItems : publicMenuItems;
  const userName = session?.user?.name || "NooobtimeX";

  return (
    <div className="flex w-full items-center justify-between backdrop-blur-xs p-4 border-b xl:px-8 rounded-b-2xl bg-white/80 dark:bg-zinc-900/80">
      {/* Logo + Name */}
      <div className="flex items-center gap-2 mx-auto">
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
          NooobtimeX
        </Link>
      </div>

      {/* Menu Items */}
      {!isLoggedIn && (
        <div className="flex items-center gap-2 mx-auto">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group px-4 py-2 transition-colors duration-500 font-bold hover:text-primary"
            >
              <div className="flex flex-col items-center">
                <div className="text-center">{item.title}</div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Right side: */}
      <div className="flex items-center gap-2 mx-auto">
        {isLoggedIn ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <UserRound className="w-4 h-4" />
                <span>{userName}</span>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link href="/dashboard">📋 Dashboard</Link>
              </DropdownMenuItem>
              {/* Divider */}
              <div className="border-t my-1" />
              <Button
                variant={"destructive"}
                onClick={() => signOut()}
                className="w-full"
              >
                🚪 Sign out
              </Button>

              {/* Divider */}
              <div className="border-t my-1" />

              {/* ThemeChanger inside dropdown */}
              <div className="px-2 py-1 flex justify-center">
                <ThemeChanger />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <>
            <Link href="/auth/signin">
              <Button variant="outline" className="flex items-center gap-2">
                SIGN IN
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button variant="default" className="flex items-center gap-2">
                SIGN UP
              </Button>
            </Link>
            <ThemeChanger />
          </>
        )}
      </div>
    </div>
  );
}
