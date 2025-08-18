const { pool } = require('../config/database');

const sampleProducts = [
  {
    title: "iPhone 14 Pro Max - 256GB",
    description: "Brand new iPhone 14 Pro Max in Deep Purple, 256GB storage, factory sealed with all accessories included.",
    category_id: 1, // Electronics
    subcategory_id: 101, // Smartphones
    starting_price: 899.99,
    reserve_price: 950.00,
    bid_increment: 25.00,
    condition: 'new',
    images: ['iphone-1.jpg', 'iphone-2.jpg'],
    created_by: 1 // Admin user
  },
  {
    title: "MacBook Air M2 - 13 inch",
    description: "2023 MacBook Air with M2 chip, 8GB RAM, 256GB SSD. Excellent condition, barely used.",
    category_id: 1, // Electronics
    subcategory_id: 102, // Laptops & Computers
    starting_price: 999.99,
    reserve_price: 1100.00,
    bid_increment: 50.00,
    condition: 'like-new',
    images: ['macbook-1.jpg', 'macbook-2.jpg'],
    created_by: 1
  },
  {
    title: "Vintage Rolex Submariner",
    description: "1980s Rolex Submariner, authentic with papers. Serviced recently, excellent working condition.",
    category_id: 2, // Fashion & Accessories
    subcategory_id: 203, // Jewelry & Watches
    starting_price: 5000.00,
    reserve_price: 7500.00,
    bid_increment: 250.00,
    condition: 'good',
    images: ['rolex-1.jpg', 'rolex-2.jpg'],
    created_by: 1
  },
  {
    title: "Nike Air Jordan 1 Retro High OG",
    description: "Size 10 Nike Air Jordan 1 in Chicago colorway. New in box, never worn.",
    category_id: 2, // Fashion & Accessories
    subcategory_id: 204, // Shoes & Footwear
    starting_price: 200.00,
    bid_increment: 20.00,
    condition: 'new',
    images: ['jordan-1.jpg', 'jordan-2.jpg'],
    created_by: 1
  },
  {
    title: "Original Picasso Sketch",
    description: "Authenticated Pablo Picasso sketch from 1960s, comes with certificate of authenticity.",
    category_id: 5, // Art & Collectibles
    subcategory_id: 501, // Fine Art & Paintings
    starting_price: 15000.00,
    reserve_price: 25000.00,
    bid_increment: 500.00,
    condition: 'good',
    images: ['picasso-1.jpg'],
    created_by: 1
  }
];

const seedAuctions = async () => {
  try {
    console.log('Seeding auction data...');

    // Clear existing auction and product data
    await pool.query('DELETE FROM auctions');
    await pool.query('DELETE FROM products');
    await pool.query('ALTER SEQUENCE products_id_seq RESTART WITH 1');
    await pool.query('ALTER SEQUENCE auctions_id_seq RESTART WITH 1');

    console.log('Cleared existing data');

    // Insert products
    for (const product of sampleProducts) {
      const productResult = await pool.query(`
        INSERT INTO products (title, description, category_id, subcategory_id, starting_price, 
                             reserve_price, bid_increment, condition, images, created_by)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING id
      `, [
        product.title, product.description, product.category_id, product.subcategory_id,
        product.starting_price, product.reserve_price, product.bid_increment,
        product.condition, product.images, product.created_by
      ]);

      const productId = productResult.rows[0].id;

      // Create auction for this product
      const startTime = new Date();
      const endTime = new Date(Date.now() + (Math.random() * 7 + 1) * 24 * 60 * 60 * 1000); // Random 1-8 days from now

      await pool.query(`
        INSERT INTO auctions (product_id, start_time, end_time, current_price, total_bids, status)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [productId, startTime, endTime, product.starting_price, 0, 'active']);

      console.log(`Created auction for: ${product.title}`);
    }

    console.log('✅ Auction data seeded successfully');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  }
};

// Run seeding if called directly
if (require.main === module) {
  seedAuctions().then(() => process.exit(0));
}

module.exports = seedAuctions;
