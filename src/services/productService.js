// src/services/productService.js - Updated to handle categories and fragrances
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';

export const productService = {
  // Get product categories with their fragrances
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
        
        // Filter active categories in JavaScript
        const activeCategories = categories.filter(cat => cat.status === 'active');
        
        console.log(`✅ Fetched ${activeCategories.length} categories (simple query):`, activeCategories);
        return activeCategories;
      } catch (simpleError) {
        console.error('❌ Simple categories query also failed:', simpleError);
        
        // Return sample categories as fallback with your actual data structure
        console.log('📦 Using sample categories as fallback...');
        return [
          {
            id: 'wood-infused',
            name: 'Wood Infused Air Fresheners',
            description: 'Premium wood-infused air fresheners with natural aromatic properties for a warm, earthy ambiance',
            basePrice: 299,
            image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500',
            status: 'active',
            fragrances: [
              { 
                id: 'sandalwood', 
                name: 'Sandalwood', 
                price: 299, 
                description: 'Rich, woody aroma with earthy undertones and a calming presence',
                rating: 4.8,
                reviewCount: 45
              },
              { 
                id: 'cedar', 
                name: 'Cedar Wood', 
                price: 319, 
                description: 'Fresh cedar scent with natural wood essence and forest-like freshness',
                rating: 4.7,
                reviewCount: 38
              },
              { 
                id: 'pine', 
                name: 'Pine Forest', 
                price: 289, 
                description: 'Invigorating pine scent reminiscent of deep mountain forests',
                rating: 4.9,
                reviewCount: 52
              },
              { 
                id: 'teak', 
                name: 'Teak Wood', 
                price: 349, 
                description: 'Luxurious teak fragrance with warm, sophisticated notes',
                rating: 4.8,
                reviewCount: 29
              },
              { 
                id: 'bamboo', 
                name: 'Bamboo Fresh', 
                price: 279, 
                description: 'Light, refreshing bamboo scent with zen-like tranquility',
                rating: 4.6,
                reviewCount: 33
              }
            ]
          },
          {
            id: 'camphor',
            name: 'Camphor Air Fresheners',
            description: 'Traditional camphor-based air fresheners with therapeutic benefits and purifying properties',
            basePrice: 249,
            image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
            status: 'active',
            fragrances: [
              { 
                id: 'pure-camphor', 
                name: 'Pure Camphor', 
                price: 249, 
                description: 'Traditional pure camphor with medicinal properties and refreshing clarity',
                rating: 4.9,
                reviewCount: 67
              },
              { 
                id: 'camphor-rose', 
                name: 'Camphor Rose', 
                price: 269, 
                description: 'Therapeutic camphor blended with delicate rose essence for floral harmony',
                rating: 4.7,
                reviewCount: 41
              },
              { 
                id: 'camphor-jasmine', 
                name: 'Camphor Jasmine', 
                price: 279, 
                description: 'Aromatic jasmine flowers combined with purifying camphor base',
                rating: 4.8,
                reviewCount: 36
              },
              { 
                id: 'camphor-lavender', 
                name: 'Camphor Lavender', 
                price: 259, 
                description: 'Soothing lavender fields meet therapeutic camphor for ultimate relaxation',
                rating: 4.9,
                reviewCount: 58
              },
              { 
                id: 'eucalyptus-camphor', 
                name: 'Eucalyptus Camphor', 
                price: 289, 
                description: 'Refreshing eucalyptus leaves with purifying camphor for respiratory wellness',
                rating: 4.8,
                reviewCount: 44
              }
            ]
          }
        ];
      }
    }
  },

  // Get all fragrances from all categories as individual products
  async getAllFragrances() {
    try {
      console.log('🌸 Fetching all fragrances...');
      
      const categories = await this.getProductCategories();
      const allFragrances = [];
      
      categories.forEach(category => {
        if (category.fragrances && Array.isArray(category.fragrances)) {
          category.fragrances.forEach(fragrance => {
            allFragrances.push({
              // Fragrance properties
              ...fragrance,
              
              // Category context
              categoryName: category.name,
              categoryId: category.id,
              categoryImage: category.image,
              categoryDescription: category.description,
              
              // Product-like structure for cart/display
              id: `${category.id}-${fragrance.id}`,
              name: fragrance.name,
              price: fragrance.price || category.basePrice || 0,
              description: fragrance.description || category.description,
              category: category.name,
              scent: fragrance.name,
              images: [{ 
                src: fragrance.image || category.image || '/images/placeholder.jpg' 
              }],
              rating: fragrance.rating || 4.8,
              reviewCount: fragrance.reviewCount || Math.floor(Math.random() * 50) + 20,
              status: 'active',
              type: 'fragrance'
            });
          });
        }
      });
      
      // Sort by category and then by price
      allFragrances.sort((a, b) => {
        if (a.categoryId !== b.categoryId) {
          return a.categoryName.localeCompare(b.categoryName);
        }
        return (a.price || 0) - (b.price || 0);
      });
      
      console.log(`✅ Generated ${allFragrances.length} individual fragrance products`);
      return allFragrances;
    } catch (error) {
      console.error('❌ Error fetching all fragrances:', error);
      return [];
    }
  },

  // Get fragrances for a specific category
  async getCategoryFragrances(categoryId) {
    try {
      console.log('🌸 Fetching fragrances for category:', categoryId);
      
      const categories = await this.getProductCategories();
      const category = categories.find(cat => cat.id === categoryId);
      
      if (!category || !category.fragrances) {
        console.log('❌ Category not found or has no fragrances');
        return [];
      }
      
      const fragrances = category.fragrances.map(fragrance => ({
        ...fragrance,
        categoryName: category.name,
        categoryId: category.id,
        id: `${category.id}-${fragrance.id}`,
        category: category.name,
        images: [{ src: category.image || '/images/placeholder.jpg' }]
      }));
      
      console.log(`✅ Fetched ${fragrances.length} fragrances for category ${categoryId}`);
      return fragrances;
    } catch (error) {
      console.error('❌ Error fetching category fragrances:', error);
      return [];
    }
  },

  // Get legacy products (for backward compatibility)
  async getProducts() {
    try {
      console.log('🔍 Fetching products from Firestore (legacy support)...');
      
      // First try to get from products collection
      try {
        const q = query(
          collection(db, 'products'), 
          where('status', '==', 'active')
        );
        
        const querySnapshot = await getDocs(q);
        const products = querySnapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        }));
        
        if (products.length > 0) {
          console.log(`✅ Fetched ${products.length} legacy products from Firebase`);
          return products;
        }
      } catch (error) {
        console.log('ℹ️ No legacy products collection, generating from categories...');
      }
      
      // If no legacy products, generate from categories
      return await this.getAllFragrances();
    } catch (error) {
      console.error('❌ Error fetching products:', error);
      return [];
    }
  },

  // Get featured products (categories for featured section)
  async getFeaturedProducts() {
    try {
      console.log('🌟 Fetching featured categories...');
      
      const categories = await this.getProductCategories();
      
      // For featured section, return categories themselves
      const featuredCategories = categories
        .filter(category => category.featured !== false) // Show all unless explicitly marked as not featured
        .slice(0, 3); // Limit to 3 featured categories
      
      console.log(`✅ Fetched ${featuredCategories.length} featured categories`);
      return featuredCategories;
    } catch (error) {
      console.error('❌ Error fetching featured categories:', error);
      return [];
    }
  },

  // Create a product from category + fragrance combination
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
      images: [{ 
        src: fragrance.image || category.image || '/images/placeholder.jpg' 
      }],
      rating: fragrance.rating || category.rating || 4.8,
      reviewCount: fragrance.reviewCount || category.reviewCount || Math.floor(Math.random() * 50) + 20,
      status: 'active',
      type: 'category-fragrance'
    };
  },

  // Search products by query
  async searchProducts(searchQuery) {
    try {
      console.log('🔍 Searching products for:', searchQuery);
      
      const allFragrances = await this.getAllFragrances();
      const query = searchQuery.toLowerCase();
      
      const results = allFragrances.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.scent.toLowerCase().includes(query)
      );
      
      console.log(`✅ Found ${results.length} products matching "${searchQuery}"`);
      return results;
    } catch (error) {
      console.error('❌ Error searching products:', error);
      return [];
    }
  },

  // Get products by category
  async getProductsByCategory(categoryId) {
    try {
      console.log('📂 Getting products for category:', categoryId);
      
      const allFragrances = await this.getAllFragrances();
      const categoryProducts = allFragrances.filter(product => 
        product.categoryId === categoryId
      );
      
      console.log(`✅ Found ${categoryProducts.length} products in category ${categoryId}`);
      return categoryProducts;
    } catch (error) {
      console.error('❌ Error getting products by category:', error);
      return [];
    }
  },

  // Get product by ID (handles both legacy products and generated fragrance products)
  async getProductById(productId) {
    try {
      console.log('🔍 Getting product by ID:', productId);
      
      // Check if it's a generated fragrance product ID (format: categoryId-fragranceId)
      if (productId.includes('-')) {
        const [categoryId, fragranceId] = productId.split('-');
        const categories = await this.getProductCategories();
        const category = categories.find(cat => cat.id === categoryId);
        
        if (category && category.fragrances) {
          const fragrance = category.fragrances.find(frag => frag.id === fragranceId);
          if (fragrance) {
            return this.createProductFromCategoryFragrance(category, fragrance);
          }
        }
      }
      
      // Try to get from legacy products collection
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const products = querySnapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        }));
        
        const product = products.find(p => p.id === productId);
        if (product) {
          return product;
        }
      } catch (error) {
        console.log('ℹ️ No legacy products found');
      }
      
      console.log('❌ Product not found:', productId);
      return null;
    } catch (error) {
      console.error('❌ Error getting product by ID:', error);
      return null;
    }
  }
};