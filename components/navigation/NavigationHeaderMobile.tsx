"use client";

import ThemeChanger from "@/components/ThemeChanger";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import NavigationHeaderProps from "@/types/menuItem";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { GoHomeFill } from "react-icons/go";
import { MdDashboard } from "react-icons/md";
import { RxHamburgerMenu } from "react-icons/rx";

export const publicMenuItems = [{ title: "HOME", href: "/", icon: GoHomeFill }];

export const privateMenuItems = [
  { title: "DASHBOARD", href: "/dashboard", icon: MdDashboard },
  { title: "BLOG", href: "/blog", icon: MdDashboard },
];

export default function NavigationHeaderMobile({
  isLoggedIn,
}: NavigationHeaderProps) {
  const { data: session } = useSession();
  const userName = session?.user?.name ?? "NooobtimeX";
  const menuItems = isLoggedIn ? privateMenuItems : publicMenuItems;

  return (
    <div className="relative">
      {/* App name (bottom left) */}
      <div className="fixed bottom-3 left-3 flex justify-center">
        <Link href={"/"}>
          <Button variant={"outline"} className="my-auto">
            <img
              src="/favicon.ico"
              alt="NooobtimeX"
              className="rounded-full max-w-7"
            />
            {userName}
          </Button>
        </Link>
      </div>

      {/* Menu Drawer (bottom right) */}
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant={"outline"} className="fixed bottom-3 right-3">
            MENU <RxHamburgerMenu />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="text-center">MENU</DrawerTitle>
          </DrawerHeader>

          <div className="mx-auto mb-2">
            <ThemeChanger />
          </div>

          <div className="flex flex-col space-y-2 px-4">
            {menuItems.map((item) => (
              <DrawerClose asChild key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center space-x-2 p-2"
                >
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </Link>
              </DrawerClose>
            ))}

            {isLoggedIn ? (
              <Button variant="destructive" onClick={() => signOut()}>
                Sign out
              </Button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link href="/auth/signin">
                  <Button variant="default" className="w-full">
                    SIGN IN
                  </Button>
                </Link>
                <Link href="/auth/signin">
                  <Button variant="default" className="w-full">
                    SIGN UP
                  </Button>
                </Link>
              </div>
            )}
          </div>

          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant={"outline"}>CLOSE</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
