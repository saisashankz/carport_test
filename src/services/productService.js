// src/services/productService.js
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';

export const productService = {
  // Get all active products (simplified query)
  async getProducts() {
    try {
      console.log('🔍 Fetching products from Firestore...');
      
      // Simplified query - just filter by status
      const q = query(
        collection(db, 'products'), 
        where('status', '==', 'active')
      );
      
      const querySnapshot = await getDocs(q);
      const products = querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
      
      console.log(`✅ Fetched ${products.length} products from Firebase:`, products);
      return products;
    } catch (error) {
      console.error('❌ Error fetching products:', error);
      
      // Try even simpler query - get all products
      try {
        console.log('🔄 Trying simpler query...');
        const querySnapshot = await getDocs(collection(db, 'products'));
        const products = querySnapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        }));
        
        console.log(`✅ Fetched ${products.length} products (simple query):`, products);
        return products;
      } catch (simpleError) {
        console.error('❌ Simple query also failed:', simpleError);
        
        // Return sample data as fallback
        console.log('📦 Using sample data as fallback...');
        return [
          {
            id: 'sample-1',
            name: "Ocean Breeze Premium Air Freshener",
            price: 24.99,
            images: [{ src: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500" }],
            description: "Transform your car with refreshing ocean breeze scent",
            category: "Premium",
            scent: "Ocean Breeze",
            rating: 4.8,
            reviewCount: 124,
            status: 'active'
          },
          {
            id: 'sample-2',
            name: "Vanilla Luxury Car Freshener",
            price: 22.99,
            images: [{ src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500" }],
            description: "Indulge in warm, comforting vanilla scent",
            category: "Luxury",
            scent: "Vanilla",
            rating: 4.9,
            reviewCount: 89,
            status: 'active'
          }
        ];
      }
    }
  },

  // Get featured products (simplified)
  async getFeaturedProducts() {
    try {
      console.log('🌟 Fetching featured products...');
      
      const querySnapshot = await getDocs(collection(db, 'products'));
      const allProducts = querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
      
      // Filter in JavaScript instead of Firestore query
      const featuredProducts = allProducts
        .filter(product => product.featured === true && product.status === 'active')
        .slice(0, 3);
      
      console.log(`✅ Fetched ${featuredProducts.length} featured products`);
      return featuredProducts;
    } catch (error) {
      console.error('❌ Error fetching featured products:', error);
      return [];
    }
  }
};