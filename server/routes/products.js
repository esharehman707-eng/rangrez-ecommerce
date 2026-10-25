import { Router } from 'express'
import mongoose from 'mongoose'
import Product from '../models/Product.js'
import auth from '../middleware/auth.js'

const router = Router()
const FIELDS = ['name', 'price', 'category', 'stock', 'size', 'image', 'description']
const pick = (b = {}) => Object.fromEntries(FIELDS.filter((k) => k in b).map((k) => [k, b[k]]))

// Public
router.get('/', async (_req, res) => res.json(await Product.find().sort('-createdAt')))

// Public: reduces stock safely (fails if any item is not available)
router.post('/checkout', async (req, res) => {
  const items = Array.isArray(req.body?.items) ? req.body.items : []
  const done = []
  for (const { id, qty } of items) {
    const n = Math.floor(Number(qty))
    const ok = mongoose.isValidObjectId(id) && n > 0 &&
      (await Product.findOneAndUpdate({ _id: id, stock: { $gte: n } }, { $inc: { stock: -n } }))
    if (!ok) {
      await Promise.all(done.map((d) => Product.updateOne({ _id: d.id }, { $inc: { stock: d.n } })))
      return res.status(409).json({ message: 'Some items are out of stock. Please update your cart.' })
    }
    done.push({ id, n })
  }
  res.json({ ok: true })
})

// Admin only
router.post('/', auth, async (req, res) => res.status(201).json(await Product.create(pick(req.body))))

router.put('/:id', auth, async (req, res) => {
  const p = await Product.findByIdAndUpdate(req.params.id, pick(req.body), { new: true, runValidators: true })
  if (!p) return res.status(404).json({ message: 'Product not found.' })
  res.json(p)
})

router.delete('/:id', auth, async (req, res) => {
  const p = await Product.findByIdAndDelete(req.params.id)
  if (!p) return res.status(404).json({ message: 'Product not found.' })
  res.json({ ok: true })
})

export default router
