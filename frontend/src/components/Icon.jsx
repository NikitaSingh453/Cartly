import { Laptop, Tablet, Headphones, Watch, Camera, User, Smartphone, ShoppingBag, Circle } from "lucide-react";

const icons = { Laptop, Tablet, Headphones, Watch, Camera, User, Smartphone, ShoppingBag };

export default function Icon({ name, size = 16, ...rest }) {
  const C = icons[name] || Circle;
  return <C size={size} {...rest} />;
}
