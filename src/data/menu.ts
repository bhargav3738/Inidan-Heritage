export type CategoryId = "starters" | "mains" | "breads" | "desserts";

export interface Category {
  id: CategoryId;
  label: string;
}

export interface MenuItem {
  id: string;
  name: string;
  category: CategoryId;
  veg: boolean;
  signature: boolean;
  price: number;
  desc: string;
  img: string;
}

export const MENU_CATEGORIES: Category[] = [
  { id: "starters", label: "Starters" },
  { id: "mains", label: "Mains" },
  { id: "breads", label: "Breads & Rice" },
  { id: "desserts", label: "Desserts" },
];

export const MENU_ITEMS: MenuItem[] = [
  {
    id: "samosa",
    name: "Vegetable Samosa",
    category: "starters",
    veg: true,
    signature: false,
    price: 6.5,
    desc: "Crisp pastry, spiced potato & peas, tamarind chutney.",
    img: "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "seekh",
    name: "Seekh Kebab",
    category: "starters",
    veg: false,
    signature: false,
    price: 9.5,
    desc: "Minced lamb skewers, charred over open flame.",
    img: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "butter-chicken",
    name: "Butter Chicken",
    category: "mains",
    veg: false,
    signature: true,
    price: 17.5,
    desc: "Slow-cooked tomato-cashew curry, tandoori chicken.",
    img: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "dal-makhani",
    name: "Dal Makhani",
    category: "mains",
    veg: true,
    signature: true,
    price: 13.5,
    desc: "Eighteen-hour black lentils, cream, smoked butter.",
    img: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "palak-paneer",
    name: "Palak Paneer",
    category: "mains",
    veg: true,
    signature: false,
    price: 14.5,
    desc: "Fresh spinach purée, house-made paneer.",
    img: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "lamb-rogan",
    name: "Lamb Rogan Josh",
    category: "mains",
    veg: false,
    signature: true,
    price: 19.5,
    desc: "Kashmiri chillies, yogurt, slow-braised lamb shoulder.",
    img: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "garlic-naan",
    name: "Garlic Naan",
    category: "breads",
    veg: true,
    signature: false,
    price: 4.5,
    desc: "Tandoor-charred flatbread, roasted garlic & herbs.",
    img: "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "jeera-rice",
    name: "Jeera Rice",
    category: "breads",
    veg: true,
    signature: false,
    price: 5.5,
    desc: "Basmati rice tempered with cumin & ghee.",
    img: "https://images.unsplash.com/photo-1596797038530-2c107229654b?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "gulab-jamun",
    name: "Gulab Jamun",
    category: "desserts",
    veg: true,
    signature: false,
    price: 6.0,
    desc: "Warm milk dumplings in cardamom-rose syrup.",
    img: "https://images.unsplash.com/photo-1601303516361-1c1e5aa5e7b3?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "kulfi",
    name: "Saffron Kulfi",
    category: "desserts",
    veg: true,
    signature: true,
    price: 6.5,
    desc: "Hand-churned pistachio-saffron kulfi.",
    img: "https://images.unsplash.com/photo-1590080876229-7b2f2eaf3a6d?q=80&w=800&auto=format&fit=crop",
  },
];

export const SPECIALS: MenuItem[] = MENU_ITEMS.filter((i) => i.signature);

export function findItem(id: string): MenuItem | undefined {
  return MENU_ITEMS.find((i) => i.id === id);
}
