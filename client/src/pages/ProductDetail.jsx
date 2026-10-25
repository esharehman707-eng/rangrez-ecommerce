import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useShop, money, sizesOf, FALLBACK_IMG } from '../context/ShopContext.jsx'
import ProductCard from '../components/ProductCard.jsx'
import Reveal from '../components/Reveal.jsx'

// ✏️ Edit these to match your shop's real policies
const PERKS = [['🚚', 'Free delivery'], ['↩️', '7-day returns'], ['🔒', 'Secure checkout']]
const DELIVERY = 'Orders are delivered to your door. If something is not right, you can return it within 7 days.'

const delay = (ms) => ({ animationDelay: `${ms}ms` })

export default function ProductDetail() {
  const { id } = useParams()
  const { products, addToCart } = useShop()
  const p = products.find((x) => x.id === id)
  const [size, setSize] = useState('')
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [warn, setWarn] = useState(false)
  const [zoom, setZoom] = useState({ on: false, x: 50, y: 50 })

  useEffect(() => { window.scrollTo({ top: 0 }) }, [id])

  if (!p) return (
    <div className="text-center py-20">
      <p className="text-xl mb-4">Product not found</p>
      <Link to="/products" className="btn-pink">Back to products</Link>
    </div>
  )

  const sizes = sizesOf(p)
  const out = p.stock < 1
  const chosen = size || (sizes.length === 1 ? sizes[0] : '')
  const related = products.filter((x) => x.id !== p.id && x.category === p.category)
  const more = (related.length ? related : products.filter((x) => x.id !== p.id)).slice(0, 4)
  const catLink = `/products?category=${encodeURIComponent(p.category || '')}`

  const add = () => {
    if (sizes.length > 0 && !chosen) { setWarn(true); return }
    let ok = false
    for (let i = 0; i < qty; i++) ok = addToCart(p.id, chosen) || ok
    if (ok) { setAdded(true); setTimeout(() => setAdded(false), 3000) }
  }

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    setZoom({ on: true, x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 })
  }

  return (
    <div className="space-y-16">
      <div>
        {/* Breadcrumb */}
        <nav className="animate-fadeUp text-sm text-neutral-500 mb-5 flex flex-wrap items-center gap-2">
          <Link to="/" className="hover:text-pink-600">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-pink-600">Products</Link>
          <span>/</span>
          {p.category && (
            <>
              <Link to={catLink} className="hover:text-pink-600">{p.category}</Link>
              <span>/</span>
            </>
          )}
          <span className="text-neutral-900 font-medium truncate max-w-[12rem]">{p.name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-6 md:gap-12 bg-white rounded-[2rem] p-4 md:p-10 shadow-sm">
          {/* Image with hover zoom */}
          <div
            className="animate-fadeUp relative overflow-hidden rounded-2xl bg-pink-100 aspect-square md:cursor-zoom-in"
            onMouseMove={onMove}
            onMouseLeave={() => setZoom((z) => ({ ...z, on: false }))}
          >
            <img
              src={p.image || FALLBACK_IMG}
              onError={(e) => (e.currentTarget.src = FALLBACK_IMG)}
              alt={p.name}
              style={{ transformOrigin: `${zoom.x}% ${zoom.y}%` }}
              className={`w-full h-full object-cover transition-transform duration-300 ${zoom.on ? 'md:scale-150' : 'scale-100'}`}
            />
            {out && <span className="absolute top-4 left-4 bg-black text-white text-xs px-4 py-1.5 rounded-full">Out of stock</span>}
            <span className="hidden md:block absolute bottom-3 right-3 bg-black/60 text-white text-xs rounded-full px-3 py-1">Hover to zoom</span>
          </div>

          {/* Info */}
          <div className="flex flex-col">
            {p.category && (
              <Link
                to={catLink}
                style={delay(100)}
                className="animate-fadeUp self-start text-xs uppercase tracking-[0.25em] text-pink-600 font-semibold bg-pink-50 rounded-full px-4 py-1.5 hover:bg-pink-100 transition"
              >
                {p.category}
              </Link>
            )}
            <h1 style={delay(180)} className="animate-fadeUp font-display text-3xl md:text-5xl font-extrabold leading-tight mt-4">{p.name}</h1>
            <p style={delay(260)} className="animate-fadeUp text-3xl font-bold mt-4">{money(p.price)}</p>

            <p style={delay(320)} className={`animate-fadeUp mt-3 text-sm font-medium flex items-center gap-2 ${out ? 'text-red-600' : p.stock <= 5 ? 'text-orange-600' : 'text-green-600'}`}>
              <span className={`w-2.5 h-2.5 rounded-full ${out ? 'bg-red-500' : p.stock <= 5 ? 'bg-orange-500' : 'bg-green-500'}`} />
              {out ? 'Out of stock' : p.stock <= 5 ? `Hurry, only ${p.stock} left` : 'In stock and ready to ship'}
            </p>

            {sizes.length > 0 && (
              <div style={delay(380)} className="animate-fadeUp mt-6">
                <p className="font-semibold mb-2">Size {chosen && <span className="text-neutral-400 font-normal">· {chosen}</span>}</p>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => { setSize(s); setWarn(false) }}
                      className={`min-w-[3rem] px-4 py-2 rounded-full border font-medium transition duration-200 hover:-translate-y-0.5 ${chosen === s ? 'bg-black text-white border-black' : 'border-neutral-300 hover:border-pink-500'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                {warn && <p className="text-red-600 text-sm mt-2">Please select a size first.</p>}
              </div>
            )}

            {/* Quantity + add to cart */}
            <div style={delay(440)} className="animate-fadeUp flex gap-3 mt-7">
              <div className="flex items-center border border-neutral-300 rounded-full">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-11 h-12 text-xl hover:text-pink-600" aria-label="Decrease">−</button>
                <span className="w-8 text-center font-semibold">{qty}</span>
                <button onClick={() => setQty((q) => Math.min(p.stock, q + 1))} disabled={out || qty >= p.stock} className="w-11 h-12 text-xl hover:text-pink-600 disabled:opacity-30" aria-label="Increase">+</button>
              </div>
              <button onClick={add} disabled={out} className="btn-pink flex-1">
                {out ? 'Sold out' : added ? 'Added to cart ✓' : 'Add to cart'}
              </button>
            </div>
            {added && (
              <div className="animate-fadeUp flex gap-5 mt-3 text-sm font-semibold">
                <Link to="/cart" className="text-pink-600 hover:underline">Go to cart →</Link>
                <Link to="/products" className="text-neutral-600 hover:underline">Continue shopping</Link>
              </div>
            )}

            {/* Perks */}
            <div style={delay(500)} className="animate-fadeUp grid grid-cols-3 gap-3 mt-7">
              {PERKS.map(([icon, t]) => (
                <div key={t} className="bg-pink-50 rounded-xl py-3 text-center text-xs font-medium">
                  <div className="text-xl mb-1">{icon}</div>
                  {t}
                </div>
              ))}
            </div>

            {/* Details */}
            <div style={delay(560)} className="animate-fadeUp mt-7">
              {[['Description', p.description || 'No description yet.', true], ['Delivery and returns', DELIVERY, false]].map(([t, body, open]) => (
                <details key={t} open={open} className="group border-t border-neutral-200 py-4">
                  <summary className="font-semibold cursor-pointer flex justify-between items-center list-none [&::-webkit-details-marker]:hidden">
                    {t}
                    <span className="text-2xl text-pink-500 transition duration-300 group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-neutral-600 whitespace-pre-line">{body}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Related */}
      {more.length > 0 && (
        <section>
          <Reveal>
            <p className="text-pink-600 text-xs font-semibold tracking-[0.3em] uppercase">More to love</p>
            <h2 className="font-display text-3xl font-bold mt-1 mb-6">You may also like</h2>
          </Reveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {more.map((x, i) => <Reveal key={x.id} delay={i * 100}><ProductCard p={x} /></Reveal>)}
          </div>
        </section>
      )}
    </div>
  )
}
