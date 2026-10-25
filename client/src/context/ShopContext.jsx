import { createContext, useContext, useEffect, useState, useCallback } from 'react'

const Ctx = createContext(null)
export const useShop = () => useContext(Ctx)

const API = import.meta.env.VITE_API_URL || '/api'
export const money = (n) => 'Rs. ' + Number(n || 0).toLocaleString()
export const sizesOf = (p) => (p.size || '').split(',').map((s) => s.trim()).filter(Boolean)
export const FALLBACK_IMG = 'https://placehold.co/600x600/fbcfe8/000000?text=No+Image'

const load = (key, fallback) => {
  try { const v = JSON.parse(localStorage.getItem(key)); return v ?? fallback } catch { return fallback }
}

export function ShopProvider({ children }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cart, setCart] = useState(() => load('shop_cart', [])) // cart stays in the customer's browser
  const [token, setToken] = useState(() => localStorage.getItem('shop_token') || '')

  useEffect(() => localStorage.setItem('shop_cart', JSON.stringify(cart)), [cart])
  useEffect(() => { token ? localStorage.setItem('shop_token', token) : localStorage.removeItem('shop_token') }, [token])

  const api = async (path, opts = {}) => {
    const res = await fetch(API + path, {
      ...opts,
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    })
    const data = await res.json().catch(() => ({}))
    if (res.status === 401 && token && !path.startsWith('/auth')) setToken('')
    if (!res.ok) throw new Error(data.message || 'Something went wrong')
    return data
  }

  const refresh = useCallback(async () => {
    try {
      const r = await fetch(API + '/products')
      if (!r.ok) throw new Error()
      setProducts(await r.json())
      setError('')
    } catch {
      setError('Cannot reach the server. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }, [])
  useEffect(() => { refresh() }, [refresh])

  const login = async (email, password) => {
    const d = await api('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) })
    setToken(d.token)
  }
  const logout = () => setToken('')

  const addProduct = async (p) => {
    const created = await api('/products', { method: 'POST', body: JSON.stringify(p) })
    setProducts((l) => [created, ...l])
  }
  const updateProduct = async (id, p) => {
    const u = await api(`/products/${id}`, { method: 'PUT', body: JSON.stringify(p) })
    setProducts((l) => l.map((x) => (x.id === id ? u : x)))
  }
  const deleteProduct = async (id) => {
    await api(`/products/${id}`, { method: 'DELETE' })
    setProducts((l) => l.filter((x) => x.id !== id))
    setCart((c) => c.filter((i) => i.id !== id))
  }

  const addToCart = (id, size = '') => {
    const p = products.find((x) => x.id === id)
    if (!p || p.stock < 1) return false
    setCart((c) => {
      const found = c.find((i) => i.id === id && i.size === size)
      if (found) return c.map((i) => (i === found ? { ...i, qty: Math.min(i.qty + 1, p.stock) } : i))
      return [...c, { id, size, qty: 1 }]
    })
    return true
  }
  const setQty = (id, size, qty) =>
    setCart((c) => c.map((i) => {
      if (i.id !== id || i.size !== size) return i
      const p = products.find((x) => x.id === id)
      return { ...i, qty: Math.max(1, Math.min(qty, p ? p.stock : 1)) }
    }))
  const removeFromCart = (id, size) => setCart((c) => c.filter((i) => !(i.id === id && i.size === size)))

  const lines = cart.map((i) => ({ ...i, product: products.find((p) => p.id === i.id) })).filter((l) => l.product)
  const cartCount = lines.reduce((s, l) => s + l.qty, 0)
  const cartTotal = lines.reduce((s, l) => s + l.qty * l.product.price, 0)

  const checkout = async () => {
    try {
      await api('/products/checkout', { method: 'POST', body: JSON.stringify({ items: lines.map((l) => ({ id: l.id, qty: l.qty })) }) })
      setCart([])
    } finally {
      await refresh()
    }
  }

  return (
    <Ctx.Provider value={{ products, loading, error, addProduct, updateProduct, deleteProduct, cart, lines, cartCount, cartTotal, addToCart, setQty, removeFromCart, checkout, isAdmin: !!token, login, logout }}>
      {children}
    </Ctx.Provider>
  )
}
