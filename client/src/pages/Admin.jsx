import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useShop, money, FALLBACK_IMG } from '../context/ShopContext.jsx'

const EMPTY = { name: '', price: '', category: '', stock: '', size: '', image: '', description: '' }

export default function Admin() {
  const { isAdmin, products, addProduct, updateProduct, deleteProduct } = useShop()
  const [form, setForm] = useState(EMPTY)
  const [editId, setEditId] = useState(null)
  const [msg, setMsg] = useState('')
  const [q, setQ] = useState('')

  if (!isAdmin) return <Navigate to="/login" replace />

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })
  const reset = () => { setForm(EMPTY); setEditId(null) }
  const flash = (t) => { setMsg(t); setTimeout(() => setMsg(''), 2500) }

  const submit = async (e) => {
    e.preventDefault()
    const data = { ...form, name: form.name.trim(), category: form.category.trim(), price: Number(form.price), stock: Number(form.stock) }
    try {
      if (editId) { await updateProduct(editId, data); flash('Product updated ✓') }
      else { await addProduct(data); flash('Product added ✓') }
      reset()
    } catch (err) { flash(err.message) }
  }
  const edit = (p) => { setEditId(p.id); setForm({ ...p, price: String(p.price), stock: String(p.stock) }); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const remove = async (p) => {
    if (!window.confirm(`Delete "${p.name}"?`)) return
    try { await deleteProduct(p.id); if (editId === p.id) reset(); flash('Product deleted') } catch (err) { flash(err.message) }
  }
  const shown = products.filter((p) => (p.name + p.category).toLowerCase().includes(q.toLowerCase()))

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-extrabold">Admin panel</h1>
      {msg && <div className="bg-black text-pink-300 rounded-xl px-4 py-3 font-medium">{msg}</div>}

      <form onSubmit={submit} className="bg-white rounded-3xl p-5 md:p-8 shadow-sm grid md:grid-cols-2 gap-4">
        <h2 className="text-xl font-bold md:col-span-2">{editId ? 'Edit product' : 'Add new product'}</h2>
        <input className="input" placeholder="Product name *" value={form.name} onChange={set('name')} required />
        <input className="input" placeholder="Category (e.g. Dresses) *" value={form.category} onChange={set('category')} required />
        <input className="input" type="number" min="0" step="any" placeholder="Price (Rs.) *" value={form.price} onChange={set('price')} required />
        <input className="input" type="number" min="0" step="1" placeholder="Stock quantity *" value={form.stock} onChange={set('stock')} required />
        <input className="input md:col-span-2" placeholder="Sizes, comma separated (e.g. S, M, L)" value={form.size} onChange={set('size')} />
        <input className="input md:col-span-2" type="url" placeholder="Image URL (https://...) *" value={form.image} onChange={set('image')} required />
        {form.image && <img src={form.image} onError={(e) => (e.currentTarget.src = FALLBACK_IMG)} alt="Preview" className="h-28 w-28 object-cover rounded-xl md:col-span-2 bg-pink-100" />}
        <textarea className="input md:col-span-2" rows="4" placeholder="Description" value={form.description} onChange={set('description')} />
        <div className="md:col-span-2 flex gap-3">
          <button className="btn-pink">{editId ? 'Save changes' : 'Add product'}</button>
          {editId && <button type="button" onClick={reset} className="btn-out">Cancel</button>}
        </div>
      </form>

      <section>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h2 className="text-xl font-bold">Products ({products.length})</h2>
          <input className="input !w-full sm:!w-64" placeholder="Search..." value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="space-y-3">
          {shown.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl p-3 flex flex-wrap items-center gap-4 shadow-sm">
              <img src={p.image || FALLBACK_IMG} onError={(e) => (e.currentTarget.src = FALLBACK_IMG)} alt="" className="w-16 h-16 rounded-xl object-cover bg-pink-100" />
              <div className="flex-1 min-w-[10rem]">
                <p className="font-semibold">{p.name}</p>
                <p className="text-sm text-neutral-500">{p.category} · {money(p.price)} · Stock: {p.stock}{p.size && ` · ${p.size}`}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => edit(p)} className="btn-dark !py-1.5 !px-4 text-sm">Edit</button>
                <button onClick={() => remove(p)} className="btn !py-1.5 !px-4 text-sm bg-red-50 text-red-700 hover:bg-red-100">Delete</button>
              </div>
            </div>
          ))}
          {!shown.length && <p className="text-neutral-500 text-center py-8">No products found.</p>}
        </div>
      </section>
    </div>
  )
}
