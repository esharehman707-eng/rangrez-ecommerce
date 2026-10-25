import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const router = Router()

router.post('/login', async (req, res) => {
  const { email = '', password = '' } = req.body || {}
  const user = await User.findOne({ email: String(email).trim().toLowerCase() })
  if (!user || !(await bcrypt.compare(String(password), user.password)))
    return res.status(401).json({ message: 'Wrong email or password.' })
  const token = jwt.sign({ id: user._id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '7d' })
  res.json({ token })
})

export default router
