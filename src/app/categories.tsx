import {
  Trophy,
  Medal,
  Award,
  Gift,
  Shield,
  BookOpen,
  Briefcase,
} from "lucide-react";

export type Category = {
  id: string;
  name: string;
  type: "icon" | "image";
  icon?: any;
  image?: string;
};

// Lista de categorías
export const categories: Category[] = [
  {
    id: "metal-cups",
    name: "Copas Metálicas",
    type: "icon",
    icon: Trophy,
  },
  {
    id: "trophies",
    name: "Trofeos",
    type: "image",
    image: "/Trofeos.png",
  },
  {
    id: "medals",
    name: "Medallas",
    type: "icon",
    icon: Medal,
  },
  {
    id: "plaques",
    name: "Plaquetas",
    type: "image",
    image: "/plaquetas.png",
  },
  {
    id: "plates",
    name: "Placas",
    type: "image",
    image: "/placas.jpeg",
  },
  {
    id: "corporate-gifts",
    name: "Empresariales",
    type: "image",
    image: "/Empresariales.png",
  },
  {
    id: "leather-goods",
    name: "Marroquinería",
    type: "image",
    image: "/marroquineria.png",
  },
];
