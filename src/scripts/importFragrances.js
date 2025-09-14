// src/scripts/importFragrances.js
// Firebase Import Script to Add Fragrances Data

import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

// Fragrances data
const camphorFragrances = [
  {
    id: "pure-camphor",
    name: "Pure Camphor",
    price: 249,
    description: "Traditional pure camphor with medicinal properties and refreshing clarity",
    rating: 4.9,
    reviewCount: 67
  },
  {
    id: "camphor-rose",
    name: "Camphor Rose",
    price: 269,
    description: "Therapeutic camphor blended with delicate rose essence for floral harmony",
    rating: 4.7,
    reviewCount: 41
  },
  {
    id: "camphor-jasmine",
    name: "Camphor Jasmine",
    price: 279,
    description: "Aromatic jasmine flowers combined with purifying camphor base",
    rating: 4.8,
    reviewCount: 36
  },
  {
    id: "camphor-lavender",
    name: "Camphor Lavender",
    price: 259,
    description: "Soothing lavender fields meet therapeutic camphor for ultimate relaxation",
    rating: 4.9,
    reviewCount: 58
  },
  {
    id: "eucalyptus-camphor",
    name: "Eucalyptus Camphor",
    price: 289,
    description: "Refreshing eucalyptus leaves with purifying camphor for respiratory wellness",
    rating: 4.8,
    reviewCount: 44
  }
];

const woodFragrances = [
  {
    id: "sandalwood",
    name: "Sandalwood",
    price: 299,
    description: "Rich, woody aroma with earthy undertones and a calming presence",
    rating: 4.8,
    reviewCount: 45
  },
  {
    id: "cedar",
    name: "Cedar Wood",
    price: 319,
    description: "Fresh cedar scent with natural wood essence and forest-like freshness",
    rating: 4.7,
    reviewCount: 38
  },
  {
    id: "pine",
    name: "Pine Forest",
    price: 289,
    description: "Invigorating pine scent reminiscent of deep mountain forests",
    rating: 4.9,
    reviewCount: 52
  },
  {
    id: "teak",
    name: "Teak Wood",
    price: 349,
    description: "Luxurious teak fragrance with warm, sophisticated notes",
    rating: 4.8,
    reviewCount: 29
  },
  {
    id: "bamboo",
    name: "Bamboo Fresh",
    price: 279,
    description: "Light, refreshing bamboo scent with zen-like tranquility",
    rating: 4.6,
    reviewCount: 33
  }
];

// Import function
export const importFragrancesToFirebase = async () => {
  try {
    console.log('🚀 Starting fragrance import to Firebase...');

    // Update camphor document
    console.log('📝 Adding fragrances to Camphor Air Fresheners...');
    const camphorDocRef = doc(db, 'productCategories', 'camphor');
    await updateDoc(camphorDocRef, {
      fragrances: camphorFragrances
    });
    console.log('✅ Camphor fragrances added successfully!');

    // Update wood-infused document
    console.log('📝 Adding fragrances to Wood Infused Air Fresheners...');
    const woodDocRef = doc(db, 'productCategories', 'wood-infused');
    await updateDoc(woodDocRef, {
      fragrances: woodFragrances
    });
    console.log('✅ Wood fragrances added successfully!');

    console.log('🎉 All fragrances imported successfully!');
    console.log('📊 Import Summary:');
    console.log(`   - Camphor fragrances: ${camphorFragrances.length}`);
    console.log(`   - Wood fragrances: ${woodFragrances.length}`);
    console.log(`   - Total fragrances: ${camphorFragrances.length + woodFragrances.length}`);
    
    return {
      success: true,
      camphorCount: camphorFragrances.length,
      woodCount: woodFragrances.length,
      total: camphorFragrances.length + woodFragrances.length
    };

  } catch (error) {
    console.error('❌ Error importing fragrances:', error);
    return {
      success: false,
      error: error.message
    };
  }
};