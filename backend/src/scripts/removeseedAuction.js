const { pool } = require('../config/database');

const removeSeedData = async () => {
  try {
    console.log('🧹 Removing sample/seeded auction data...');

    // First, delete auctions that belong to seeded products
    const auctionResult = await pool.query(`
      DELETE FROM auctions 
      WHERE product_id IN (
        SELECT id FROM products WHERE created_by = 1
      ) 
      RETURNING *
    `);

    // Then delete the seeded products themselves
    const productResult = await pool.query(`
      DELETE FROM products 
      WHERE created_by = 1 
      RETURNING *
    `);

    console.log(`✅ Removed ${auctionResult.rowCount} seeded auctions`);
    console.log(`✅ Removed ${productResult.rowCount} seeded products`);
    console.log('🎉 Real user data preserved!');
    
    // Verify what's left
    const remainingAuctions = await pool.query('SELECT COUNT(*) FROM auctions');
    const remainingProducts = await pool.query('SELECT COUNT(*) FROM products');
    
    console.log(`📊 Remaining auctions: ${remainingAuctions.rows[0].count}`);
    console.log(`📦 Remaining products: ${remainingProducts.rows[0].count}`);
    
  } catch (error) {
    console.error('❌ Failed to remove seeded data:', error);
  } finally {
    await pool.end();
  }
};

// Run if called directly
if (require.main === module) {
  removeSeedData().then(() => process.exit(0));
}

module.exports = removeSeedData;
