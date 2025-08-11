-- Performance Indexes
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_created_by ON products(created_by);
CREATE INDEX idx_auctions_status ON auctions(status);
CREATE INDEX idx_auctions_end_time ON auctions(end_time);
CREATE INDEX idx_auctions_product ON auctions(product_id);
CREATE INDEX idx_bids_auction ON bids(auction_id);
CREATE INDEX idx_bids_bidder ON bids(bidder_id);
CREATE INDEX idx_bids_amount ON bids(amount);
CREATE INDEX idx_bids_priority ON bids(priority_rank);
CREATE INDEX idx_watchlist_user ON watchlist(user_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(is_read);
