-- Insert Categories
INSERT INTO categories (name, slug, icon_name, color_code, sort_order) VALUES
('Electronics', 'electronics', 'laptop', '#3b82f6', 1),
('Fashion & Accessories', 'fashion', 'shirt', '#ec4899', 2),
('Home & Garden', 'home-garden', 'home', '#10b981', 3),
('Sports & Recreation', 'sports', 'football', '#f59e0b', 4),
('Art & Collectibles', 'art', 'palette', '#8b5cf6', 5),
('Automotive', 'automotive', 'car', '#ef4444', 6),
('Books & Media', 'books', 'book', '#06b6d4', 7),
('Jewelry & Watches', 'jewelry', 'gem', '#f97316', 8),
('Antiques', 'antiques', 'museum', '#84cc16', 9),
('Miscellaneous', 'miscellaneous', 'package', '#6b7280', 10);

-- Insert Admin User (we'll hash passwords properly later)
INSERT INTO users (username, email, password_hash, first_name, last_name, is_admin, is_verified) VALUES
('admin', 'admin@bidmaster.com', 'temp_password', 'Admin', 'User', true, true);

-- Insert Test User
INSERT INTO users (username, email, password_hash, first_name, last_name, is_verified) VALUES
('testuser', 'test@bidmaster.com', 'temp_password', 'Test', 'User', true);
