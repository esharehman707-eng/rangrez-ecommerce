import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true }, // bcrypt hash
})
export default mongoose.model('User', schema)
