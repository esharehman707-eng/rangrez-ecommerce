import mongoose from 'mongoose'

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true },
    stock: { type: Number, required: true, min: 0, default: 0 },
    size: { type: String, default: '' },
    image: { type: String, required: true },
    description: { type: String, default: '' },
  },
  {
    timestamps: true,
    toJSON: { versionKey: false, transform: (_, r) => { r.id = r._id.toString(); delete r._id } },
  }
)
export default mongoose.model('Product', schema)
