// src/services/userService.js
import { 
  collection, 
  doc, 
  updateDoc, 
  addDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  setDoc
} from 'firebase/firestore';
import { db } from '../firebase';

export const userService = {
  // Update user profile
  async updateUserProfile(userId, profileData) {
    try {
      console.log('📝 Updating user profile:', userId, profileData);
      
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        ...profileData,
        updatedAt: new Date()
      });
      
      console.log('✅ Profile updated successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to update profile:', error);
      return false;
    }
  },

  // Wishlist Management
  async getUserWishlist(userId) {
    try {
      console.log('💝 Fetching wishlist for user:', userId);
      
      const q = query(
        collection(db, 'wishlist'),
        where('userId', '==', userId),
        orderBy('addedAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const wishlist = querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
      
      console.log(`✅ Fetched ${wishlist.length} wishlist items`);
      return wishlist;
    } catch (error) {
      console.error('❌ Failed to fetch wishlist:', error);
      
      // Try simple query if orderBy fails
      try {
        const simpleQuery = query(
          collection(db, 'wishlist'),
          where('userId', '==', userId)
        );
        
        const querySnapshot = await getDocs(simpleQuery);
        const wishlist = querySnapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        }));
        
        return wishlist;
      } catch (simpleError) {
        console.error('❌ Simple wishlist query also failed:', simpleError);
        return [];
      }
    }
  },

  async addToWishlist(userId, productData) {
    try {
      console.log('💝 Adding to wishlist:', productData);
      
      const wishlistItem = {
        userId,
        productId: productData.id,
        name: productData.name,
        price: productData.price,
        image: productData.images?.[0]?.src || '',
        addedAt: new Date()
      };
      
      await addDoc(collection(db, 'wishlist'), wishlistItem);
      
      console.log('✅ Added to wishlist successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to add to wishlist:', error);
      return false;
    }
  },

  async removeFromWishlist(wishlistItemId) {
    try {
      console.log('🗑️ Removing from wishlist:', wishlistItemId);
      
      await deleteDoc(doc(db, 'wishlist', wishlistItemId));
      
      console.log('✅ Removed from wishlist successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to remove from wishlist:', error);
      return false;
    }
  },

  // Address Management
  async getUserAddresses(userId) {
    try {
      console.log('📍 Fetching addresses for user:', userId);
      
      const q = query(
        collection(db, 'addresses'),
        where('userId', '==', userId)
      );
      
      const querySnapshot = await getDocs(q);
      const addresses = querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
      
      console.log(`✅ Fetched ${addresses.length} addresses`);
      return addresses;
    } catch (error) {
      console.error('❌ Failed to fetch addresses:', error);
      return [];
    }
  },

  async addUserAddress(userId, addressData) {
    try {
      console.log('📍 Adding address:', addressData);
      
      const address = {
        userId,
        ...addressData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const docRef = await addDoc(collection(db, 'addresses'), address);
      
      console.log('✅ Address added successfully:', docRef.id);
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('❌ Failed to add address:', error);
      return { success: false, error: error.message };
    }
  },

  async updateUserAddress(addressId, addressData) {
    try {
      console.log('📍 Updating address:', addressId, addressData);
      
      const addressRef = doc(db, 'addresses', addressId);
      await updateDoc(addressRef, {
        ...addressData,
        updatedAt: new Date()
      });
      
      console.log('✅ Address updated successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to update address:', error);
      return false;
    }
  },

  async deleteUserAddress(addressId) {
    try {
      console.log('🗑️ Deleting address:', addressId);
      
      await deleteDoc(doc(db, 'addresses', addressId));
      
      console.log('✅ Address deleted successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to delete address:', error);
      return false;
    }
  },

  // Notifications Management
  async getUserNotifications(userId) {
    try {
      console.log('🔔 Fetching notifications for user:', userId);
      
      const q = query(
        collection(db, 'notifications'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const notifications = querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
      
      console.log(`✅ Fetched ${notifications.length} notifications`);
      return notifications;
    } catch (error) {
      console.error('❌ Failed to fetch notifications:', error);
      
      // Try simple query if orderBy fails
      try {
        const simpleQuery = query(
          collection(db, 'notifications'),
          where('userId', '==', userId)
        );
        
        const querySnapshot = await getDocs(simpleQuery);
        const notifications = querySnapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        }));
        
        // Sort in JavaScript
        notifications.sort((a, b) => {
          const aTime = a.createdAt?.toDate?.() || new Date(a.createdAt) || new Date();
          const bTime = b.createdAt?.toDate?.() || new Date(b.createdAt) || new Date();
          return bTime - aTime;
        });
        
        return notifications;
      } catch (simpleError) {
        console.error('❌ Simple notifications query also failed:', simpleError);
        return [];
      }
    }
  },

  async createNotification(userId, notificationData) {
    try {
      console.log('🔔 Creating notification:', notificationData);
      
      const notification = {
        userId,
        title: notificationData.title,
        message: notificationData.message,
        type: notificationData.type || 'info',
        read: false,
        createdAt: new Date()
      };
      
      await addDoc(collection(db, 'notifications'), notification);
      
      console.log('✅ Notification created successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to create notification:', error);
      return false;
    }
  },

  async markNotificationAsRead(notificationId) {
    try {
      console.log('📖 Marking notification as read:', notificationId);
      
      const notificationRef = doc(db, 'notifications', notificationId);
      await updateDoc(notificationRef, {
        read: true,
        readAt: new Date()
      });
      
      console.log('✅ Notification marked as read');
      return true;
    } catch (error) {
      console.error('❌ Failed to mark notification as read:', error);
      return false;
    }
  },

  // User Statistics
  async getUserStats(userId) {
    try {
      console.log('📊 Fetching user stats for:', userId);
      
      // Get orders count
      const ordersQuery = query(
        collection(db, 'orders'),
        where('userId', '==', userId)
      );
      const ordersSnapshot = await getDocs(ordersQuery);
      const ordersCount = ordersSnapshot.size;

      // Get wishlist count
      const wishlistQuery = query(
        collection(db, 'wishlist'),
        where('userId', '==', userId)
      );
      const wishlistSnapshot = await getDocs(wishlistQuery);
      const wishlistCount = wishlistSnapshot.size;

      // Calculate total spent
      const orders = ordersSnapshot.docs.map(doc => doc.data());
      const totalSpent = orders
        .filter(order => order.paymentStatus === 'paid')
        .reduce((sum, order) => sum + (Number(order.total) || 0), 0);

      const stats = {
        ordersCount,
        wishlistCount,
        totalSpent,
        memberSince: null // Will be fetched from user document
      };

      console.log('✅ User stats fetched:', stats);
      return stats;
    } catch (error) {
      console.error('❌ Failed to fetch user stats:', error);
      return {
        ordersCount: 0,
        wishlistCount: 0,
        totalSpent: 0,
        memberSince: null
      };
    }
  },

  // User Preferences
  async getUserPreferences(userId) {
    try {
      console.log('⚙️ Fetching user preferences for:', userId);
      
      const q = query(
        collection(db, 'userPreferences'),
        where('userId', '==', userId)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        // Return default preferences
        return {
          emailNotifications: true,
          smsNotifications: false,
          marketingEmails: true,
          orderUpdates: true,
          theme: 'dark',
          language: 'en'
        };
      }
      
      const preferences = querySnapshot.docs[0].data();
      console.log('✅ User preferences fetched:', preferences);
      return preferences;
    } catch (error) {
      console.error('❌ Failed to fetch user preferences:', error);
      return {
        emailNotifications: true,
        smsNotifications: false,
        marketingEmails: true,
        orderUpdates: true,
        theme: 'dark',
        language: 'en'
      };
    }
  },

  async updateUserPreferences(userId, preferences) {
    try {
      console.log('⚙️ Updating user preferences:', preferences);
      
      const preferencesData = {
        userId,
        ...preferences,
        updatedAt: new Date()
      };
      
      // Use setDoc to create or update
      await setDoc(
        doc(db, 'userPreferences', userId), 
        preferencesData, 
        { merge: true }
      );
      
      console.log('✅ User preferences updated successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to update user preferences:', error);
      return false;
    }
  },

  // Account Management
  async deactivateAccount(userId, reason) {
    try {
      console.log('❌ Deactivating account:', userId, reason);
      
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        isActive: false,
        deactivatedAt: new Date(),
        deactivationReason: reason || 'User requested',
        updatedAt: new Date()
      });
      
      console.log('✅ Account deactivated successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to deactivate account:', error);
      return false;
    }
  },

  async reactivateAccount(userId) {
    try {
      console.log('✅ Reactivating account:', userId);
      
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        isActive: true,
        reactivatedAt: new Date(),
        deactivatedAt: null,
        deactivationReason: null,
        updatedAt: new Date()
      });
      
      console.log('✅ Account reactivated successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to reactivate account:', error);
      return false;
    }
  }
};