
export interface User {
  // Your existing User fields...
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  isVerified?: boolean;
  isAdmin?: boolean;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
  lastLoginAt?: string;
}

export interface UserProfile extends User {
  // Extended profile fields
  dateOfBirth?: string;
  bio?: string;
  location?: string;
  website?: string;
  address?: string;
  zipCode?: string;
  city?: string;
  country?: string;
  profileImage?: string;
  
  // Settings
  emailNotifications?: boolean;
  bidNotifications?: boolean;
  auctionUpdates?: boolean;
  marketingEmails?: boolean;
  twoFactorEnabled?: boolean;
}
