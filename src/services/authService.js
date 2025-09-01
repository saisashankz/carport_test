// src/services/authService.js
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

export const authService = {
  // Register new user
  async register(email, password, userData) {
    try {
      console.log('📝 Registering new user:', email);
      
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update profile with display name
      await updateProfile(user, {
        displayName: `${userData.firstName} ${userData.lastName}`
      });
      
      // Store additional user data in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone || '',
        role: 'customer',
        createdAt: new Date(),
        isActive: true
      });
      
      console.log('✅ User registered successfully:', user.uid);
      return { success: true, user };
    } catch (error) {
      console.error('❌ Registration error:', error);
      return { success: false, error: error.message };
    }
  },

  // Login user
  async login(email, password) {
    try {
      console.log('🔐 Logging in user:', email);
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      console.log('✅ User logged in successfully:', user.uid);
      return { success: true, user };
    } catch (error) {
      console.error('❌ Login error:', error);
      return { success: false, error: error.message };
    }
  },

  // Logout user
  async logout() {
    try {
      await signOut(auth);
      console.log('✅ User logged out successfully');
      return { success: true };
    } catch (error) {
      console.error('❌ Logout error:', error);
      return { success: false, error: error.message };
    }
  },

  // Get current user data from Firestore
  async getCurrentUserData() {
    const user = auth.currentUser;
    if (user) {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        return userDoc.exists() ? userDoc.data() : null;
      } catch (error) {
        console.error('❌ Error getting user data:', error);
        return null;
      }
    }
    return null;
  },

  // Auth state observer
  onAuthStateChange(callback) {
    return onAuthStateChanged(auth, callback);
  }
};