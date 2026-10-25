import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useShop } from '../context/ShopContext.jsx'
import ProductCard from '../components/ProductCard.jsx'
import Marquee from '../components/Marquee.jsx'
import Reveal from '../components/Reveal.jsx'

// ✏️ Edit these to change the home page
// Put your own hero photo link here (if it fails to load, a dark background is shown)
const HERO_IMG = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80'
const WORDS = ['confident', 'beautiful', 'unstoppable', 'yourself']
const STRIP = ['NEW ARRIVALS ✦', 'FREE DELIVERY ✦', 'EASY RETURNS ✦', 'SECURE CHECKOUT ✦']
const BIG = ['RANGREZ ✦', 'STYLE ✦', 'COLOR ✦']
const TRUST = ['Free delivery', 'Easy returns', 'Secure checkout']
const STEPS = [
  ['01', 'Choose', 'Browse the collection and pick your favorites.'],
  ['02', 'Add to cart', 'Select your size and quantity in one tap.'],
  ['03', 'Delivered', 'We bring your order right to your door.'],
]

function Rotator({ words }) {
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % words.length), 2200)
    return () => clearInterval(t)
  }, [words.length])
  return <span key={i} className="inline-block animate-wordIn text-pink-400 italic">{words[i]}</span>
}

const Title = ({ small, children }) => (
  <div>
    <p className="text-pink-600 text-xs font-semibold tracking-[0.3em] uppercase">{small}</p>
    <h2 className="font-display text-3xl md:text-4xl font-bold mt-1">{children}</h2>
  </div>
)

export default function Home() {
  const { products } = useShop()
  const nav = useNavigate()
  const [q, setQ] = useState('')
  const rail = useRef(null)
  const slide = (d) => rail.current?.scrollBy({ left: d * 300, behavior: 'smooth' })

  const counts = products.reduce((m, p) => (p.category ? { ...m, [p.category]: (m[p.category] || 0) + 1 } : m), {})
  const categories = Object.keys(counts)
  const trending = [...products].sort((a, b) => (b.stock > 0) - (a.stock > 0)).slice(0, 8)

  const search = (e) => {
    e.preventDefault()
    nav(q.trim() ? `/products?q=${encodeURIComponent(q.trim())}` : '/products')
  }

  return (
    <div className="space-y-14 md:space-y-20">
      {/* Photo hero */}
      <section className="relative overflow-hidden bg-black text-white rounded-[2rem] min-h-[520px] md:min-h-[640px] flex items-center justify-center text-center px-6 py-20">
        {HERO_IMG && (
          <img src={HERO_IMG} alt="" onError={(e) => { e.currentTarget.style.display = 'none' }}
            className="absolute inset-0 w-full h-full object-cover animate-kenburns" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/85" />
        <div className="absolute -top-24 -left-16 w-72 h-72 bg-pink-500/40 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-28 -right-10 w-80 h-80 bg-fuchsia-600/30 rounded-full blur-3xl animate-float [animation-delay:-3s]" />

        <div className="relative max-w-3xl">
          <p className="animate-fadeUp text-pink-400 tracking-[0.35em] text-xs md:text-sm font-semibold">NEW COLLECTION 2026</p>
          <h1 className="animate-fadeUp [animation-delay:150ms] font-display font-extrabold text-4xl sm:text-6xl md:text-7xl leading-tight mt-5">
            Wear what makes<br />you feel <Rotator words={WORDS} />
          </h1>
          <p className="animate-fadeUp [animation-delay:300ms] text-neutral-200 mt-6 max-w-xl mx-auto">Fresh styles, bold colors and everyday comfort, picked with love and delivered to your door.</p>
          <form onSubmit={search} className="animate-fadeUp [animation-delay:450ms] flex bg-white rounded-full p-1.5 mt-8 max-w-md mx-auto shadow-2xl">
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search dresses, shirts, bags..." className="flex-1 min-w-0 bg-transparent px-4 outline-none text-sm text-black placeholder:text-neutral-400" />
            <button className="btn-pink !py-2.5 !px-6 text-sm">Search</button>
          </form>
          <div className="animate-fadeUp [animation-delay:600ms] mt-6 flex flex-wrap justify-center gap-x-5 gap-y-1 text-sm text-neutral-200">
            {TRUST.map((t) => <span key={t}><span className="text-pink-400 font-bold">✓</span> {t}</span>)}
          </div>
          <div className="animate-fadeUp [animation-delay:750ms] mt-7">
            <Link to="/products" className="btn border border-white/40 hover:bg-white hover:text-black">Shop all products</Link>
          </div>
        </div>
      </section>

      {/* Scrolling strip */}
      <Marquee items={STRIP} className="rounded-full bg-black text-pink-300 font-bold tracking-widest py-3.5 text-sm" />

      {/* Categories */}
      {categories.length > 0 && (
        <section>
          <Reveal><Title small="Browse">Shop by category</Title></Reveal>
          <div className="flex gap-3 overflow-x-auto pt-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <Link to="/products" className="shrink-0 bg-black text-white rounded-full px-6 py-2.5 font-medium">All</Link>
            {categories.map((c) => (
              <Link key={c} to={`/products?category=${encodeURIComponent(c)}`}
                className="shrink-0 bg-white border border-pink-100 hover:bg-pink-500 hover:text-white hover:-translate-y-0.5 transition rounded-full px-6 py-2.5 font-medium shadow-sm">
                {c} <span className="text-xs opacity-60 ml-1">{counts[c]}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Trending slider */}
      <section>
        <Reveal>
          <div className="flex items-end justify-between mb-6">
            <Title small="Trending now">Customer favorites</Title>
            <div className="hidden md:flex gap-2">
              <button onClick={() => slide(-1)} aria-label="Previous" className="w-10 h-10 rounded-full border border-neutral-300 bg-white hover:bg-black hover:text-white transition">←</button>
              <button onClick={() => slide(1)} aria-label="Next" className="w-10 h-10 rounded-full border border-neutral-300 bg-white hover:bg-black hover:text-white transition">→</button>
            </div>
          </div>
        </Reveal>
        {trending.length ? (
          <div ref={rail} className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {trending.map((p) => (
              <div key={p.id} className="snap-start shrink-0 w-[62%] sm:w-[34%] lg:w-[24%]"><ProductCard p={p} /></div>
            ))}
          </div>
        ) : (
          <p className="text-neutral-500">No products yet. Check back soon!</p>
        )}
        <div className="text-center mt-4"><Link to="/products" className="btn-dark">View all products</Link></div>
      </section>

      {/* How it works */}
      <section>
        <Reveal><Title small="Simple & easy">How it works</Title></Reveal>
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          {STEPS.map(([n, t, s], i) => (
            <Reveal key={n} delay={i * 120}>
              <div className="bg-white rounded-2xl p-7 h-full hover:shadow-xl hover:-translate-y-1 transition duration-300">
                <p className="font-display text-6xl font-extrabold text-outline">{n}</p>
                <p className="font-semibold text-lg mt-3">{t}</p>
                <p className="text-sm text-neutral-500 mt-1">{s}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <Reveal>
        <section className="relative overflow-hidden bg-black text-white rounded-[2rem] py-16 md:py-20 text-center">
          <Marquee items={BIG} reverse className="absolute inset-x-0 top-4 font-display font-extrabold text-7xl text-outline opacity-25" />
          <div className="relative px-6">
            <h2 className="font-display text-3xl md:text-5xl font-bold">Find your next favorite look</h2>
            <p className="text-neutral-300 mt-3">New styles are added all the time.</p>
            <Link to="/products" className="btn-pink mt-8">Start shopping</Link>
          </div>
        </section>
      </Reveal>
    </div>
  )
}
