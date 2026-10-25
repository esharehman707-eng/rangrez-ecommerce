import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useShop } from '../context/ShopContext.jsx'
import Marquee from './Marquee.jsx'

const ANNOUNCE = ['FREE DELIVERY ON ALL ORDERS ✦', 'NEW ARRIVALS EVERY WEEK ✦', 'EASY 7-DAY RETURNS ✦', 'SHOP THE RANGREZ COLLECTION ✦']

export default function Navbar() {
  const { cartCount, isAdmin, logout } = useShop()
  const nav = useNavigate()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 10)
    f()
    window.addEventListener('scroll', f)
    return () => window.removeEventListener('scroll', f)
  }, [])

  const close = () => setOpen(false)
  const link = ({ isActive }) =>
    `relative py-1 transition after:absolute after:left-0 after:-bottom-0.5 after:h-0.5 after:bg-pink-500 after:transition-all after:duration-300 ${
      isActive ? 'text-pink-400 after:w-full' : 'hover:text-pink-300 after:w-0 hover:after:w-full'
    }`

  const links = (
    <>
      <NavLink to="/" end className={link} onClick={close}>Home</NavLink>
      <NavLink to="/products" className={link} onClick={close}>Products</NavLink>
      <NavLink to="/cart" className={link} onClick={close}>
        Cart <span key={cartCount} className="ml-1 inline-block animate-wordIn bg-pink-500 text-white rounded-full px-2 py-0.5 text-xs">{cartCount}</span>
      </NavLink>
      {isAdmin ? (
        <>
          <NavLink to="/admin" className={link} onClick={close}>Admin</NavLink>
          <button onClick={() => { close(); logout(); nav('/') }} className="text-pink-300 hover:text-white text-left">Logout</button>
        </>
      ) : (
        <NavLink to="/login" className={link} onClick={close}>Owner Login</NavLink>
      )}
    </>
  )

  return (
    <header className={`sticky top-0 z-30 text-white transition duration-300 ${scrolled ? 'bg-black/85 backdrop-blur-md shadow-lg' : 'bg-black'}`}>
      <Marquee items={ANNOUNCE} className="bg-pink-500 text-white text-[11px] font-semibold tracking-widest py-1.5" />
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" onClick={close} className="font-display text-3xl font-extrabold tracking-tight">Rang<span className="text-pink-500 italic">rez</span></Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">{links}</nav>
        <button className="md:hidden p-2" aria-label="Menu" onClick={() => setOpen(!open)}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>
      {open && <nav className="md:hidden flex flex-col gap-4 px-6 pb-5 text-base font-medium animate-fadeUp">{links}</nav>}
    </header>
  )
}
