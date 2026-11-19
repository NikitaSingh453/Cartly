import { Heart, Star, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { getProductSVG } from "./ProductSVG";
import { getProductImageUrl } from "../utils/categoryHelpers";

const formatINR = (n) => "₹" + Number(n).toLocaleString("en-IN");

function ProductImage({ name, cat, imgSrc }) {
  const [errored, setErrored] = useState(false);
  const src = imgSrc || getProductImageUrl(name);

  if (!src || errored) {
    return <div className="svg-thumb">{getProductSVG(name, cat, 110)}</div>;
  }
  return (
    <img
      className="thumb real-img"
      src={src}
      alt={name}
      onError={() => setErrored(true)}
    />
  );
}

export default function ProductCard({ p, onAdd, gridClass = "" }) {
  const navigate = useNavigate();

  const id      = p.id || p.productId || p.product_id;
  const name    = p.name;
  const price   = p.price;
  const oldPrice = p.old;
  const off     = p.off;
  const color   = p.color || "purple";
  const cat     = p.categoryName || p.category_name || "";
  const imgSrc  = p.img;
  const avg     = p.rating || p.avgRating || p.avg_rating || 0;
  const reviews = p.reviews || (p.reviewCount || p.review_count
    ? `${(p.reviewCount || p.review_count).toLocaleString()}`
    : null);

  const [wished, setWished] = useState(() => {
    try {
      const w = JSON.parse(localStorage.getItem("cartly_wishlist") || "[]");
      return w.some((x) => x.product_id === (p.id || p.productId || p.product_id));
    } catch { return false; }
  });

  const toggleWish = (e) => {
    e.stopPropagation();
    const item = { product_id: id, name, price, category_name: cat };
    const prev = JSON.parse(localStorage.getItem("cartly_wishlist") || "[]");
    const next = wished ? prev.filter((x) => x.product_id !== id) : [...prev, item];
    localStorage.setItem("cartly_wishlist", JSON.stringify(next));
    window.dispatchEvent(new Event("storage"));
    setWished(!wished);
  };

  const handleAdd = (e) => {
    e.stopPropagation();
    if (onAdd) {
      onAdd(p);
    } else {
      const cart = JSON.parse(localStorage.getItem("cartly_cart") || "[]");
      const existing = cart.find((i) => i.product_id === id);
      if (existing) existing.quantity += 1;
      else cart.push({ product_id: id, name, price, quantity: 1 });
      localStorage.setItem("cartly_cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("storage"));
    }
  };

  return (
    <article
      className={`product-card${gridClass ? " " + gridClass : ""}`}
      onClick={() => id && navigate(`/products/${id}`)}
    >
      <div className="product-card-img">
        {off && <span className={`tag tag-${color}`}>-{off}%</span>}
        <button
          className="heart"
          aria-label="Add to wishlist"
          onClick={toggleWish}
        >
          <Heart size={14} fill={wished ? "#ff5c8a" : "none"} color={wished ? "#ff5c8a" : "currentColor"} />
        </button>
        <ProductImage name={name} cat={cat} imgSrc={imgSrc} />
      </div>
      <h5>{name}</h5>
      {(avg > 0 || reviews) && (
        <div className="rating">
          <Star size={11} fill="currentColor" />
          {avg > 0 && <span>{avg}</span>}
          {reviews && <span>({reviews} reviews)</span>}
        </div>
      )}
      <div className="product-card-foot">
        <div className="price">
          {formatINR(price)}
          {oldPrice && <s>{formatINR(oldPrice)}</s>}
        </div>
        <button className="btn btn-sm" onClick={handleAdd}>
          <ShoppingCart size={11} /> Add to Cart
        </button>
      </div>
    </article>
  );
}

