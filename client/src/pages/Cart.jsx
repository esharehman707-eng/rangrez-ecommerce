import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useShop, money, FALLBACK_IMG } from '../context/ShopContext.jsx'

export default function Cart() {
  const { lines, cartTotal, setQty, removeFromCart, checkout } = useShop()
  const [done, setDone] = useState(false)
  const [err, setErr] = useState('')

  if (done) return (
    <div className="text-center py-20 bg-white rounded-3xl">
      <p className="text-5xl mb-3">🎉</p>
      <h1 className="text-2xl font-bold mb-2">Order placed!</h1>
      <p className="text-neutral-600 mb-6">Thank you for shopping with us.</p>
      <Link to="/products" className="btn-pink">Continue shopping</Link>
    </div>
  )
  if (!lines.length) return (
    <div className="text-center py-20 bg-white rounded-3xl">
      <p className="text-5xl mb-3">🛍️</p>
      <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
      <Link to="/products" className="btn-pink mt-4">Browse products</Link>
    </div>
  )
  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <h1 className="text-3xl font-extrabold">Your cart</h1>
        {lines.map((l) => (
          <div key={l.id + l.size} className="bg-white rounded-2xl p-3 md:p-4 flex gap-4 shadow-sm">
            <img src={l.product.image || FALLBACK_IMG} onError={(e) => (e.currentTarget.src = FALLBACK_IMG)} alt="" className="w-24 h-24 md:w-28 md:h-28 rounded-xl object-cover bg-pink-100" />
            <div className="flex-1 min-w-0">
              <Link to={`/products/${l.id}`} className="font-semibold hover:text-pink-600 block truncate">{l.product.name}</Link>
              <p className="text-sm text-neutral-500">{l.size && `Size: ${l.size} · `}{money(l.product.price)}</p>
              <div className="flex items-center gap-3 mt-3">
                <button className="w-8 h-8 rounded-full border hover:border-pink-500" onClick={() => setQty(l.id, l.size, l.qty - 1)}>−</button>
                <span className="w-6 text-center font-semibold">{l.qty}</span>
                <button className="w-8 h-8 rounded-full border hover:border-pink-500" onClick={() => setQty(l.id, l.size, l.qty + 1)} disabled={l.qty >= l.product.stock}>+</button>
                <button onClick={() => removeFromCart(l.id, l.size)} className="ml-auto text-sm text-red-600 hover:underline">Remove</button>
              </div>
            </div>
            <p className="font-bold hidden sm:block">{money(l.qty * l.product.price)}</p>
          </div>
        ))}
      </div>
      <aside className="bg-white rounded-2xl p-6 shadow-sm h-fit lg:mt-12">
        <h2 className="text-xl font-bold mb-4">Order summary</h2>
        <div className="flex justify-between mb-2"><span>Subtotal</span><span>{money(cartTotal)}</span></div>
        <div className="flex justify-between mb-4 text-neutral-500"><span>Shipping</span><span>Free</span></div>
        <div className="flex justify-between text-lg font-bold border-t pt-4"><span>Total</span><span>{money(cartTotal)}</span></div>
        {err && <p className="bg-red-50 text-red-700 rounded-xl px-4 py-2 text-sm mt-4">{err}</p>}
        <button className="btn-dark w-full mt-6" onClick={async () => { setErr(''); try { await checkout(); setDone(true) } catch (e) { setErr(e.message) } }}>Place order</button>
      </aside>
    </div>
  )
}
