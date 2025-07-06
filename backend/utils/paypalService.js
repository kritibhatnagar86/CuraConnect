const paypal = require('paypal-rest-sdk');

// Configure PayPal
paypal.configure({
  mode: process.env.PAYPAL_MODE || 'sandbox', // sandbox or live
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET
});

class PayPalService {
  // Create a new payment
  static async createPayment(amount, currency = 'USD', description = 'Healthcare Consultation', appointmentId = null) {
    try {
      const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      const returnUrl = appointmentId 
        ? `${baseUrl}/payment-success?appointmentId=${appointmentId}`
        : `${baseUrl}/payment-success`;
      const cancelUrl = appointmentId 
        ? `${baseUrl}/payment-cancel?appointmentId=${appointmentId}`
        : `${baseUrl}/payment-cancel`;

      const payment = {
        intent: 'sale',
        payer: {
          payment_method: 'paypal'
        },
        redirect_urls: {
          return_url: returnUrl,
          cancel_url: cancelUrl
        },
        transactions: [{
          amount: {
            total: amount.toString(),
            currency: currency
          },
          description: description,
          item_list: {
            items: [{
              name: description,
              sku: 'consultation',
              price: amount.toString(),
              currency: currency,
              quantity: 1
            }]
          }
        }]
      };

      return new Promise((resolve, reject) => {
        paypal.payment.create(payment, (error, payment) => {
          if (error) {
            console.error('PayPal payment creation error:', error);
            reject(new Error('Failed to create PayPal payment'));
          } else {
            resolve(payment);
          }
        });
      });
    } catch (error) {
      console.error('Error creating PayPal payment:', error);
      throw new Error('Failed to create payment');
    }
  }

  // Execute payment after user approval
  static async executePayment(paymentId, payerId) {
    try {
      const execute_payment = {
        payer_id: payerId
      };

      return new Promise((resolve, reject) => {
        paypal.payment.execute(paymentId, execute_payment, (error, payment) => {
          if (error) {
            console.error('PayPal payment execution error:', error);
            reject(new Error('Failed to execute PayPal payment'));
          } else {
            resolve(payment);
          }
        });
      });
    } catch (error) {
      console.error('Error executing PayPal payment:', error);
      throw new Error('Failed to execute payment');
    }
  }

  // Get payment details
  static async getPayment(paymentId) {
    try {
      return new Promise((resolve, reject) => {
        paypal.payment.get(paymentId, (error, payment) => {
          if (error) {
            console.error('PayPal payment retrieval error:', error);
            reject(new Error('Failed to get payment details'));
          } else {
            resolve(payment);
          }
        });
      });
    } catch (error) {
      console.error('Error getting PayPal payment:', error);
      throw new Error('Failed to get payment details');
    }
  }
}

module.exports = PayPalService; 