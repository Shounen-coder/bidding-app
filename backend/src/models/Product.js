const { pool } = require('../config/database');

class Product {
  constructor(productData) {
    this.id = productData.id;
    this.title = productData.title;
    this.description = productData.description;
    this.categoryId = productData.category_id;
    this.subcategoryId = productData.subcategory_id;
    this.startingPrice = parseFloat(productData.starting_price);
    this.reservePrice = productData.reserve_price ? parseFloat(productData.reserve_price) : null;
    this.buyNowPrice = productData.buy_now_price ? parseFloat(productData.buy_now_price) : null;
    this.bidIncrement = parseFloat(productData.bid_increment);
    this.condition = productData.condition;
    this.images = productData.images || [];
    this.createdBy = productData.created_by;
    this.createdAt = productData.created_at;
    this.updatedAt = productData.updated_at;
  }

  // Create new product
  static async create(productData) {
    const {
      title,
      description,
      categoryId,
      subcategoryId = null,
      startingPrice,
      reservePrice = null,
      buyNowPrice = null,
      bidIncrement = 1.00,
      condition,
      images = [],
      createdBy
    } = productData;

    try {
      const query = `
        INSERT INTO products (title, description, category_id, subcategory_id, starting_price, 
                             reserve_price, buy_now_price, bid_increment, condition, images, created_by)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *
      `;

      const values = [
        title, description, categoryId, subcategoryId, startingPrice,
        reservePrice, buyNowPrice, bidIncrement, condition, images, createdBy
      ];

      const result = await pool.query(query, values);
      return new Product(result.rows[0]);
    } catch (error) {
      console.error('Product creation error:', error);
      throw error;
    }
  }

  // Get product by ID with category info
  static async findByIdWithCategory(id) {
    const query = `
      SELECT p.*, c.name as category_name, c.slug as category_slug,
             sc.name as subcategory_name, sc.slug as subcategory_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN subcategories sc ON p.subcategory_id = sc.id
      WHERE p.id = $1
    `;

    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return null;
    }

    const productData = result.rows;
    const product = new Product(productData);
    
    // Add category info
    product.category = {
      id: productData.category_id,
      name: productData.category_name,
      slug: productData.category_slug
    };
    
    if (productData.subcategory_id) {
      product.subcategory = {
        id: productData.subcategory_id,
        name: productData.subcategory_name,
        slug: productData.subcategory_slug
      };
    }

    return product;
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      categoryId: this.categoryId,
      subcategoryId: this.subcategoryId,
      startingPrice: this.startingPrice,
      reservePrice: this.reservePrice,
      buyNowPrice: this.buyNowPrice,
      bidIncrement: this.bidIncrement,
      condition: this.condition,
      images: this.images,
      createdBy: this.createdBy,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      category: this.category,
      subcategory: this.subcategory
    };
  }
}

module.exports = Product;
