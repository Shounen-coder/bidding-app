const UserProfile = require('../../models/UserProfile');
const User = require('../../models/User');

class UserProfileController {
  /**
   * Get current user's complete profile
   */
  static async getMyProfile(req, res) {
    try {

         console.log('🔍 DEBUG: getMyProfile called');
    console.log('🔍 DEBUG: req.user:', req.user);


      const userId = req.user.id;
        console.log('🔍 DEBUG: extracted userId:', userId);
      
      const profileData = await UserProfile.getCompleteProfile(userId);
       console.log('🔍 DEBUG: profile query result:', profileData);
      
      if (!profileData) {
        console.log('❌ DEBUG: Profile data is null/undefined');
        return res.status(404).json({
          success: false,
          message: 'Profile not found'
        });
      }

      // Log activity
      await UserProfile.logActivity(userId, 'profile_viewed', {}, req);

      res.json({
        success: true,
        data: profileData
      });
    } catch (error) {
        
      console.error('Get my profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch profile'
      });
    }
  }

  /**
   * Update current user's profile
   */
  static async updateMyProfile(req, res) {
    try {
      const userId = req.user.id;
      const profileData = req.body;

      // Validate required fields if provided
      const {
        firstName,
        lastName,
        phone,
        address,
        dateOfBirth,
        bio,
        location,
        website,
        socialMedia,
        preferences,
        notificationSettings,
        timezone,
        language
      } = profileData;

      // Basic validation
      if (firstName && firstName.trim().length < 2) {
        return res.status(400).json({
          success: false,
          message: 'First name must be at least 2 characters long'
        });
      }

      if (lastName && lastName.trim().length < 2) {
        return res.status(400).json({
          success: false,
          message: 'Last name must be at least 2 characters long'
        });
      }

      if (website && !isValidUrl(website)) {
        return res.status(400).json({
          success: false,
          message: 'Please enter a valid website URL'
        });
      }

      if (dateOfBirth) {
        const birthDate = new Date(dateOfBirth);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        
        if (age < 18) {
          return res.status(400).json({
            success: false,
            message: 'You must be at least 18 years old to use this platform'
          });
        }
      }

      // Update profile
      const updatedUser = await UserProfile.updateProfile(userId, {
        firstName,
        lastName,
        phone,
        address,
        dateOfBirth,
        bio,
        location,
        website,
        socialMedia,
        preferences,
        notificationSettings,
        timezone,
        language
      });

      // Log activity
      await UserProfile.logActivity(userId, 'profile_updated', {
        updatedFields: Object.keys(profileData)
      }, req);

      // Get updated complete profile
      const completeProfile = await UserProfile.getCompleteProfile(userId);

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: completeProfile
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to update profile'
      });
    }
  }

  /**
   * Get user's activity history
   */
  static async getMyActivity(req, res) {
    try {
      const userId = req.user.id;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const offset = (page - 1) * limit;

      const activities = await UserProfile.getRecentActivity(userId, limit, offset);

      res.json({
        success: true,
        data: {
          activities,
          pagination: {
            current_page: page,
            limit,
            has_more: activities.length === limit
          }
        }
      });
    } catch (error) {
      console.error('Get activity error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch activity history'
      });
    }
  }

  /**
   * Update notification settings
   */
  static async updateNotificationSettings(req, res) {
    try {
      const userId = req.user.id;
      const { notificationSettings } = req.body;

      if (!notificationSettings || typeof notificationSettings !== 'object') {
        return res.status(400).json({
          success: false,
          message: 'Invalid notification settings'
        });
      }

      await UserProfile.updateProfile(userId, { notificationSettings });

      // Log activity
      await UserProfile.logActivity(userId, 'notification_settings_updated', {
        settings: notificationSettings
      }, req);

      res.json({
        success: true,
        message: 'Notification settings updated successfully'
      });
    } catch (error) {
      console.error('Update notification settings error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update notification settings'
      });
    }
  }

  /**
   * Get public user profile (for other users to view)
   */
  static async getPublicProfile(req, res) {
    try {
      const { userId } = req.params;
      const requestingUserId = req.user?.userId;

      if (!userId || isNaN(parseInt(userId))) {
        return res.status(400).json({
          success: false,
          message: 'Invalid user ID'
        });
      }

      const profileData = await UserProfile.getCompleteProfile(parseInt(userId));
      
      if (!profileData) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Filter sensitive information for public view
      const publicProfile = {
        user: {
          id: profileData.user.id,
          username: profileData.user.username,
          firstName: profileData.user.firstName,
          lastName: profileData.user.lastName,
          profileImage: profileData.user.profileImage,
          bio: profileData.user.bio,
          location: profileData.user.location,
          website: profileData.user.website,
          socialMedia: profileData.user.socialMedia,
          createdAt: profileData.user.createdAt
        },
        statistics: {
          totalBids: profileData.statistics.totalBids,
          totalAuctionsWon: profileData.statistics.totalAuctionsWon,
          totalAuctionsCreated: profileData.statistics.totalAuctionsCreated
          // Hide financial information
        },
        recentActivity: profileData.recentActivity.filter(activity => 
          !['profile_updated', 'password_changed'].includes(activity.action_type)
        )
      };

      // Log activity if different user is viewing
      if (requestingUserId && requestingUserId !== parseInt(userId)) {
        await UserProfile.logActivity(requestingUserId, 'profile_viewed', {
          viewedUserId: parseInt(userId)
        }, req);
      }

      res.json({
        success: true,
        data: publicProfile
      });
    } catch (error) {
      console.error('Get public profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch profile'
      });
    }
  }
}

// Helper function to validate URL
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

module.exports = UserProfileController;
