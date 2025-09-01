// src/services/orderService.js
import { collection, addDoc, updateDoc, doc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

export const orderService = {
  // Create order in Firebase (simplified)
  async createOrder(orderData) {
    try {
      console.log('📝 Creating order in Firebase:', orderData);
      
      const orderNumber = `CP-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
      
      // Simplified order structure to avoid validation issues
      const order = {
        orderNumber,
        userId: orderData.userId,
        status: 'pending',
        paymentStatus: 'pending',
        
        // Order items
        items: orderData.items || [],
        
        // Pricing (ensure all are numbers)
        subtotal: Number(orderData.subtotal) || 0,
        tax: Number(orderData.tax) || 0,
        shipping: Number(orderData.shipping) || 0,
        total: Number(orderData.total) || 0,
        
        // Customer info
        customerName: `${orderData.customer?.firstName || ''} ${orderData.customer?.lastName || ''}`.trim(),
        customerEmail: orderData.customer?.email || '',
        customerPhone: orderData.customer?.phone || '',
        
        // Address (simplified)
        shippingAddress: orderData.shippingAddress ? {
          street: orderData.shippingAddress.street || '',
          city: orderData.shippingAddress.city || '',
          state: orderData.shippingAddress.state || '',
          pincode: orderData.shippingAddress.pincode || '',
          country: orderData.shippingAddress.country || 'India'
        } : {},
        
        // Timestamps
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      console.log('📝 Final order object:', order);
      
      const docRef = await addDoc(collection(db, 'orders'), order);
      
      console.log('✅ Order created in Firebase with ID:', docRef.id);
      return { 
        success: true, 
        id: docRef.id, 
        orderNumber, 
        ...order 
      };
    } catch (error) {
      console.error('❌ Failed to create order:', error);
      console.error('❌ Error details:', error.message);
      console.error('❌ Error code:', error.code);
      return { success: false, error: error.message };
    }
  },

  // Update order after payment (simplified)
  async updateOrderPayment(orderId, paymentData) {
    try {
      console.log('💳 Updating order payment:', orderId, paymentData);
      
      const docRef = doc(db, 'orders', orderId);
      const updateData = {
        status: 'confirmed',
        paymentStatus: 'paid',
        paymentId: paymentData.paymentId || '',
        razorpayOrderId: paymentData.orderId || '',
        paymentSignature: paymentData.signature || '',
        paidAt: new Date(),
        updatedAt: new Date()
      };
      
      await updateDoc(docRef, updateData);
      
      console.log('✅ Order payment updated successfully');
      return { success: true };
    } catch (error) {
      console.error('❌ Failed to update order payment:', error);
      return { success: false, error: error.message };
    }
  },

  // Get user orders (simplified query)
  async getUserOrders(userId) {
    try {
      console.log('📋 Fetching orders for user:', userId);
      
      // Simple query without orderBy to avoid index issues
      const q = query(
        collection(db, 'orders'),
        where('userId', '==', userId)
      );
      
      const querySnapshot = await getDocs(q);
      const orders = querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
      
      // Sort in JavaScript instead of Firestore
      orders.sort((a, b) => {
        const aTime = a.createdAt?.toDate?.() || new Date(a.createdAt) || new Date();
        const bTime = b.createdAt?.toDate?.() || new Date(b.createdAt) || new Date();
        return bTime - aTime;
      });
      
      console.log(`✅ Fetched ${orders.length} orders for user`);
      return orders;
    } catch (error) {
      console.error('❌ Failed to fetch user orders:', error);
      return [];
    }
  }
};