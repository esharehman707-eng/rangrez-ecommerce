import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import User from './models/User.js'
import Product from './models/Product.js'
import SEED from './seed.js'
import authRoutes from './routes/auth.js'
import productRoutes from './routes/products.js'

const {
  PORT = 5000,
  MONGO_URI = 'mongodb://127.0.0.1:27017/rangrez',
  JWT_SECRET,
  ADMIN_EMAIL = 'admin@shop.com',
  ADMIN_PASSWORD = 'admin123',
} = process.env

if (!JWT_SECRET) {
  console.error('Missing JWT_SECRET. Copy .env.example to .env and set it.')
  process.exit(1)
}

const app = express()
app.use(cors())
app.use(express.json())
app.get('/api/health', (_req, res) => res.json({ ok: true }))
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)

// Error handler (Express 5 forwards async errors here)
app.use((err, _req, res, _next) => {
  const bad = err.name === 'ValidationError' || err.name === 'CastError'
  if (!bad) console.error(err)
  res.status(bad ? 400 : 500).json({ message: bad ? err.message : 'Server error' })
})

async function start() {
  await mongoose.connect(MONGO_URI)
  console.log('MongoDB connected')
  const email = ADMIN_EMAIL.toLowerCase()
  if (!(await User.findOne({ email }))) {
    await User.create({ email, password: await bcrypt.hash(ADMIN_PASSWORD, 10) })
    console.log('Admin user created:', email)
  }
  if ((await Product.countDocuments()) === 0) await Product.insertMany(SEED)
  app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`))
}
start().catch((e) => { console.error('Startup failed:', e.message); process.exit(1) })
