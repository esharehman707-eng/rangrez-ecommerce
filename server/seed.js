const img = (s) => `https://picsum.photos/seed/${s}/600/600`
export default [
  { name: 'Rose Satin Dress', price: 6500, category: 'Dresses', stock: 8, size: 'S, M, L', image: img('rosedress'), description: 'Elegant satin dress in soft rose pink. Perfect for parties and weddings.' },
  { name: 'Black Leather Handbag', price: 4200, category: 'Bags', stock: 12, size: 'One Size', image: img('blackbag'), description: 'Spacious black handbag with gold zipper details and a detachable strap.' },
  { name: 'Pink Block Heels', price: 3800, category: 'Shoes', stock: 5, size: '36, 37, 38, 39', image: img('pinkheels'), description: 'Comfortable block heels with a cushioned sole for all-day wear.' },
  { name: 'Pearl Necklace Set', price: 1800, category: 'Jewelry', stock: 20, size: 'One Size', image: img('pearlset'), description: 'Necklace and earrings set with faux pearls. Lightweight and elegant.' },
]
