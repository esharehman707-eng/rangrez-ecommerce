import { Routes, Route, Link, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx'
import Products from './pages/Products.jsx'
import ProductDetail from './pages/ProductDetail.jsx'
import Cart from './pages/Cart.jsx'
import Login from './pages/Login.jsx'
import Admin from './pages/Admin.jsx'
import { useShop } from './context/ShopContext.jsx'

function Skeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-2xl overflow-hidden">
          <div className="aspect-square bg-pink-100 animate-pulse" />
          <div className="p-4 space-y-3">
            <div className="h-3 w-1/3 bg-pink-100 rounded animate-pulse" />
            <div className="h-4 w-2/3 bg-pink-100 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function App() {
  const { loading, error } = useShop()
  const { pathname } = useLocation()
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6">
        {error && <div className="bg-red-50 text-red-700 rounded-xl px-4 py-3 mb-4">{error}</div>}
        {loading ? <Skeleton /> : (
          <div key={pathname} className="animate-fadeUp">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<div className="text-center py-20"><p className="text-xl mb-4">Page not found</p><Link className="btn-pink" to="/">Go home</Link></div>} />
            </Routes>
          </div>
        )}
      </main>
      <footer className="bg-black text-neutral-400 mt-10">
        <div className="max-w-6xl mx-auto px-4 py-10 grid gap-8 md:grid-cols-3">
          <div>
            <p className="font-display text-2xl font-extrabold text-white">Rang<span className="text-pink-500 italic">rez</span></p>
            <p className="text-sm mt-2">Style, color and confidence in every order.</p>
          </div>
          <div className="text-sm space-y-2">
            <p className="text-white font-semibold">Shop</p>
            <Link to="/products" className="block hover:text-pink-400">All products</Link>
            <Link to="/cart" className="block hover:text-pink-400">Your cart</Link>
          </div>
          <div className="text-sm space-y-2">
            <p className="text-white font-semibold">Owner</p>
            <Link to="/login" className="block hover:text-pink-400">Admin login</Link>
          </div>
        </div>
        <p className="border-t border-white/10 text-center text-xs py-4">© {new Date().getFullYear()} Rangrez. All rights reserved.</p>
      </footer>
    </div>
  )
}
