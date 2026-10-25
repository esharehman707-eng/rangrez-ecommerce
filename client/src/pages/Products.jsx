import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useShop } from '../context/ShopContext.jsx'
import ProductCard from '../components/ProductCard.jsx'

export default function Products() {
  const { products } = useShop()
  const [params] = useSearchParams()
  const [q, setQ] = useState(params.get('q') || '')
  const [cat, setCat] = useState(params.get('category') || 'All')
  const [sort, setSort] = useState('new')
  const [inStock, setInStock] = useState(false)

  const categories = ['All', ...new Set(products.map((p) => p.category).filter(Boolean))]
  const list = useMemo(() => {
    let l = products.filter((p) =>
      (cat === 'All' || p.category === cat) &&
      (!inStock || p.stock > 0) &&
      (p.name + ' ' + p.category + ' ' + p.description).toLowerCase().includes(q.toLowerCase())
    )
    if (sort === 'low') l = [...l].sort((a, b) => a.price - b.price)
    if (sort === 'high') l = [...l].sort((a, b) => b.price - a.price)
    if (sort === 'az') l = [...l].sort((a, b) => a.name.localeCompare(b.name))
    return l
  }, [products, q, cat, sort, inStock])

  return (
    <div>
      <h1 className="text-3xl font-extrabold mb-5">All products</h1>
      <div className="bg-white rounded-2xl p-4 grid gap-3 md:grid-cols-4 mb-6 shadow-sm">
        <input className="input md:col-span-2" placeholder="Search products..." value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="input" value={cat} onChange={(e) => setCat(e.target.value)}>
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select className="input" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="new">Newest</option>
          <option value="low">Price: low to high</option>
          <option value="high">Price: high to low</option>
          <option value="az">Name: A to Z</option>
        </select>
        <label className="flex items-center gap-2 text-sm md:col-span-4">
          <input type="checkbox" className="accent-pink-500 w-4 h-4" checked={inStock} onChange={(e) => setInStock(e.target.checked)} />
          In stock only
        </label>
      </div>
      <p className="text-sm text-neutral-500 mb-3">{list.length} product{list.length !== 1 && 's'} found</p>
      {list.length ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">{list.map((p) => <ProductCard key={p.id} p={p} />)}</div>
      ) : (
        <div className="text-center py-16 text-neutral-500">No products match your search.</div>
      )}
    </div>
  )
}
