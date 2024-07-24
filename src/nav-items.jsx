import { Home, Image } from "lucide-react";
import Index from "./pages/Index.jsx";
import ImageUpload from "./pages/ImageUpload.jsx";

/**
 * Central place for defining the navigation items. Used for navigation components and routing.
 */
export const navItems = [
  {
    title: "Home",
    to: "/",
    icon: <Home className="h-4 w-4" />,
    page: <Index />,
  },
  {
    title: "Image Upload",
    to: "/image-upload",
    icon: <Image className="h-4 w-4" />,
    page: <ImageUpload />,
  },
];