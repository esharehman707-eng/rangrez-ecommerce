import { Link } from 'react-router-dom'
import { useShop, money, sizesOf, FALLBACK_IMG } from '../context/ShopContext.jsx'

export default function ProductCard({ p }) {
  const { addToCart } = useShop()
  const out = p.stock < 1
  const needsSize = sizesOf(p).length > 1
  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl hover:shadow-pink-500/20 hover:-translate-y-1.5 transition duration-300 overflow-hidden flex flex-col">
      <Link to={`/products/${p.id}`} className="relative block aspect-square bg-pink-100 overflow-hidden">
        <img src={p.image || FALLBACK_IMG} onError={(e) => (e.currentTarget.src = FALLBACK_IMG)} alt={p.name}
          className="w-full h-full object-cover transition duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition duration-300" />
        <span className="absolute bottom-3 left-1/2 -translate-x-1/2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition duration-300 bg-white text-black text-xs font-semibold rounded-full px-4 py-1.5">Quick view</span>
        {out && <span className="absolute top-3 left-3 bg-black text-white text-xs px-3 py-1 rounded-full">Out of stock</span>}
        {!out && p.stock <= 5 && <span className="absolute top-3 left-3 bg-pink-500 text-white text-xs px-3 py-1 rounded-full">Only {p.stock} left</span>}
      </Link>
      <div className="p-4 flex flex-col flex-1">
        <span className="text-[11px] uppercase tracking-widest text-pink-600 font-semibold">{p.category}</span>
        <Link to={`/products/${p.id}`} className="font-semibold mt-1 hover:text-pink-600 transition line-clamp-2">{p.name}</Link>
        <p className="text-lg font-bold mt-1">{money(p.price)}</p>
        <div className="mt-auto pt-3">
          {needsSize ? (
            <Link to={`/products/${p.id}`} className="btn-dark w-full !py-2.5">Select size</Link>
          ) : (
            <button disabled={out} onClick={() => addToCart(p.id, sizesOf(p)[0] || '')} className="btn-pink w-full !py-2.5">{out ? 'Sold out' : 'Add to cart'}</button>
          )}
        </div>
      </div>
    </div>
  )
}
