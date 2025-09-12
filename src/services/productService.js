// src/services/productService.js - Updated to fetch categories and fragrances
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';

export const productService = {
  // Get all active products (existing function)
  async getProducts() {
    try {
      console.log('🔍 Fetching products from Firestore...');
      
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

  // Get product categories with their fragrances (NEW)
  async getProductCategories() {
    try {
      console.log('🏷️ Fetching product categories from Firestore...');
      
      const q = query(
        collection(db, 'productCategories'), 
        where('status', '==', 'active')
      );
      
      const querySnapshot = await getDocs(q);
      const categories = querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
      
      console.log(`✅ Fetched ${categories.length} categories from Firebase:`, categories);
      return categories;
    } catch (error) {
      console.error('❌ Error fetching categories:', error);
      
      // Try simpler query
      try {
        console.log('🔄 Trying simpler categories query...');
        const querySnapshot = await getDocs(collection(db, 'productCategories'));
        const categories = querySnapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        }));
        
        console.log(`✅ Fetched ${categories.length} categories (simple query):`, categories);
        return categories;
      } catch (simpleError) {
        console.error('❌ Simple categories query also failed:', simpleError);
        
        // Return sample categories as fallback
        console.log('📦 Using sample categories as fallback...');
        return [
          {
            id: 'wood-infused',
            name: 'Wood Infused Air Fresheners',
            description: 'Premium wood-infused air fresheners with natural aromatic properties',
            basePrice: 299,
            image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500',
            status: 'active',
            fragrances: [
              { id: 'sandalwood', name: 'Sandalwood', price: 299, description: 'Rich, woody aroma with earthy undertones' },
              { id: 'cedar', name: 'Cedar Wood', price: 319, description: 'Fresh cedar scent with natural wood essence' },
              { id: 'pine', name: 'Pine Forest', price: 289, description: 'Invigorating pine scent reminiscent of deep forests' },
              { id: 'teak', name: 'Teak Wood', price: 349, description: 'Luxurious teak fragrance with warm notes' },
              { id: 'bamboo', name: 'Bamboo Fresh', price: 279, description: 'Light, refreshing bamboo scent' }
            ]
          },
          {
            id: 'camphor',
            name: 'Camphor Air Fresheners',
            description: 'Traditional camphor-based air fresheners with therapeutic benefits',
            basePrice: 249,
            image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
            status: 'active',
            fragrances: [
              { id: 'pure-camphor', name: 'Pure Camphor', price: 249, description: 'Traditional pure camphor with medicinal properties' },
              { id: 'camphor-rose', name: 'Camphor Rose', price: 269, description: 'Camphor blended with delicate rose essence' },
              { id: 'camphor-jasmine', name: 'Camphor Jasmine', price: 279, description: 'Aromatic jasmine with camphor base' },
              { id: 'camphor-lavender', name: 'Camphor Lavender', price: 259, description: 'Soothing lavender with therapeutic camphor' },
              { id: 'eucalyptus-camphor', name: 'Eucalyptus Camphor', price: 289, description: 'Refreshing eucalyptus and camphor blend' }
            ]
          }
        ];
      }
    }
  },

  // Get fragrances for a specific category (NEW)
  async getCategoryFragrances(categoryId) {
    try {
      console.log('🌸 Fetching fragrances for category:', categoryId);
      
      const q = query(
        collection(db, 'fragrances'), 
        where('categoryId', '==', categoryId),
        where('status', '==', 'active')
      );
      
      const querySnapshot = await getDocs(q);
      const fragrances = querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
      
      // Sort by price
      fragrances.sort((a, b) => (a.price || 0) - (b.price || 0));
      
      console.log(`✅ Fetched ${fragrances.length} fragrances for category ${categoryId}:`, fragrances);
      return fragrances;
    } catch (error) {
      console.error('❌ Error fetching fragrances:', error);
      
      // Try simpler query
      try {
        const querySnapshot = await getDocs(collection(db, 'fragrances'));
        const allFragrances = querySnapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        }));
        
        // Filter in JavaScript
        const fragrances = allFragrances
          .filter(frag => frag.categoryId === categoryId && frag.status === 'active')
          .sort((a, b) => (a.price || 0) - (b.price || 0));
        
        console.log(`✅ Fetched ${fragrances.length} fragrances (simple query)`);
        return fragrances;
      } catch (simpleError) {
        console.error('❌ Simple fragrances query also failed:', simpleError);
        return [];
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
  },

  // Create a product from category + fragrance combination (NEW)
  createProductFromCategoryFragrance(category, fragrance) {
    return {
      id: `${category.id}-${fragrance.id}`,
      name: `${category.name} - ${fragrance.name}`,
      price: fragrance.price || category.basePrice || 0,
      description: fragrance.description || category.description,
      category: category.name,
      categoryId: category.id,
      fragrance: fragrance.name,
      fragranceId: fragrance.id,
      images: [{ src: category.image || fragrance.image || '/images/placeholder.jpg' }],
      rating: fragrance.rating || category.rating || 4.8,
      reviewCount: fragrance.reviewCount || category.reviewCount || Math.floor(Math.random() * 50) + 20,
      status: 'active',
      type: 'category-fragrance'
    };
  }
};