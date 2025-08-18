const Auction = require('../../models/Auction');
const Product = require('../../models/Product');

// Get all auctions with filtering, sorting, and pagination
const getAllAuctions = async (req, res) => {
  try {
    console.log('Get auctions request:', req.query);

    const filters = {
      category: req.query.category,
      subcategory: req.query.subcategory,
      status: req.query.status || 'active',
      condition: req.query.condition,
      minPrice: req.query.minPrice,
      maxPrice: req.query.maxPrice,
      search: req.query.search,
      sortBy: req.query.sortBy || 'newest',
      limit: parseInt(req.query.limit) || 20,
      offset: parseInt(req.query.offset) || 0
    };

    const result = await Auction.getAllWithDetails(filters);

    res.json({
      success: true,
      data: {
        auctions: result.auctions.map(auction => auction.toJSON()),
        pagination: {
          total: result.totalCount,
          limit: filters.limit,
          offset: filters.offset,
          hasMore: result.hasMore
        }
      }
    });
  } catch (error) {
    console.error('Get all auctions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch auctions',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get single auction by ID
const getAuctionById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'Valid auction ID is required'
      });
    }

    const auction = await Auction.findByIdWithDetails(parseInt(id));

    if (!auction) {
      return res.status(404).json({
        success: false,
        message: 'Auction not found'
      });
    }

    res.json({
      success: true,
      data: {
        auction: auction.toJSON()
      }
    });
  } catch (error) {
    console.error('Get auction by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch auction details',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get auctions by category
const getAuctionsByCategory = async (req, res) => {
  try {
    const { categorySlug } = req.params;
    const { subcategorySlug } = req.query;

    const filters = {
      category: categorySlug,
      subcategory: subcategorySlug,
      status: req.query.status || 'active',
      condition: req.query.condition,
      minPrice: req.query.minPrice,
      maxPrice: req.query.maxPrice,
      search: req.query.search,
      sortBy: req.query.sortBy || 'newest',
      limit: parseInt(req.query.limit) || 20,
      offset: parseInt(req.query.offset) || 0
    };

    const result = await Auction.getAllWithDetails(filters);

    res.json({
      success: true,
      data: {
        auctions: result.auctions.map(auction => auction.toJSON()),
        pagination: {
          total: result.totalCount,
          limit: filters.limit,
          offset: filters.offset,
          hasMore: result.hasMore
        },
        filters: {
          category: categorySlug,
          subcategory: subcategorySlug
        }
      }
    });
  } catch (error) {
    console.error('Get auctions by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch category auctions',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get featured auctions (ending soon, most popular, etc.)
const getFeaturedAuctions = async (req, res) => {
  try {
    const { type } = req.query; // 'ending_soon', 'popular', 'new'

    let filters = {
      status: 'active',
      limit: parseInt(req.query.limit) || 10,
      offset: 0
    };

    switch (type) {
      case 'ending_soon':
        filters.sortBy = 'ending_soon';
        break;
      case 'popular':
        filters.sortBy = 'most_bids';
        break;
      case 'new':
      default:
        filters.sortBy = 'newest';
        break;
    }

    const result = await Auction.getAllWithDetails(filters);

    res.json({
      success: true,
      data: {
        auctions: result.auctions.map(auction => auction.toJSON()),
        type: type || 'new'
      }
    });
  } catch (error) {
    console.error('Get featured auctions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured auctions',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getAllAuctions,
  getAuctionById,
  getAuctionsByCategory,
  getFeaturedAuctions
};
