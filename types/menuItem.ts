import { IconType } from "react-icons";

export interface MenuItem {
  title: string;
  href: string;
  icon: IconType;
}

export default interface NavigationHeaderProps {
  isLoggedIn: boolean;
  menuItems?: MenuItem[]; // ✅ ทำให้ optional
}
