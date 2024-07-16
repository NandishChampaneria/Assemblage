<template>
  <!--MAIN-->
  <main class="m-content">
      <nuxt-link to="/" class="home">Home</nuxt-link>
      <!--Payment -->
      <div class="registerAddress mt-3">
          <div class="container-fluid c-section">
              <div class="row">
                  <div class="col-sm-3"></div>
                  <div class="col-sm-6">
                      <div class="a-section a-spacing-medium">

                      </div>
                      <div class="a-section">
                          <h2>Make a payment</h2>
                          <div class="a-section a-spacing-none a-spacing-top-small">
                              <b>The total price is ${{ getTotalPrice }}</b>
                          </div>

                          <!-- Error message  -->
                          <div>
                              <b>{{ error }}</b>
                          </div>

                          <div class="v-space-medium"></div>
                          <!-- Purchase Button -->
                          <div>
                              <span>
                                  <span>
                                      <span @click="onPurchase" class="button4">Purchase</span>
                                  </span>
                              </span>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
      <!--/Payment ADDRESS-->
  </main>
  <!--/MAIN-->
</template>

<script>
import { mapGetters } from "vuex";
export default {
    async asyncData({ $axios }) {
        try {
            let response = await $axios.$get("http://localhost:3000/api/cart");

            return {
                cart: response.cart
            }
        } catch(err) {
            console.log(err);
        }
    },

    data() {
        return {
            error: "",
            razorpay: null,
            orderId: null,
            currentTimeDisplay: '',
            currentDateDisplay: ''
        };
    },

    computed: {
        ...mapGetters(["getCartTotalPriceWithShipping", "getEstimatedDelivery", "getCartTotalPrice"]),

        getTotalPrice() {
            return this.cart.reduce((total, cartItem) => {
                // Add the price of products
                total += cartItem.products.reduce((subtotal, productItem) => {
                    return subtotal + (productItem.product.price * productItem.quantity);
                }, 0);

                // Add the price of custom products
                total += cartItem.customProducts.reduce((subtotal, customProduct) => {
                    return subtotal + (customProduct.customProduct.price * customProduct.customQuantity);
                }, 0);

                return total;
            }, 0);
        },
    },

    mounted() {
        // Load Razorpay SDK from CDN
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => {
            // Initialize Razorpay with key ID (public key)
            this.razorpay = new Razorpay({
                key: 'rzp_test_jEsSeEWhrd0Pw2', // Replace with your Razorpay key ID (public key)
                handler: response => {
                    // Handle successful payment response from Razorpay
                    if (response.razorpay_payment_id) {
                        // Payment succeeded, proceed to create order
                        this.createOrder();
                    } else {
                        // Payment failed, handle error
                        this.error = "Payment failed";
                    }
                }
            });
        };
        document.body.appendChild(script);

        this.updateDateTime();
        this.interval = setInterval(this.updateDateTime, 1000);
    },
    beforeDestroy() {
    // Clear the interval to stop updating when the component is destroyed
    clearInterval(this.interval);
    },

    methods: {
        updateDateTime() {
            const now = new Date();
            // Format the time and date separately
            const timeOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
            const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            this.currentTimeDisplay = now.toLocaleTimeString(undefined, timeOptions);
            this.currentDateDisplay = now.toLocaleDateString(undefined, dateOptions);
        },

        async onPurchase() {
            try {
                // Open Razorpay checkout form
                const options = {
                    amount: this.getTotalPrice * 100, // Amount in paisa (Indian currency), adjust as needed
                    currency: 'INR', // Change to your currency code if needed
                    name: 'Your Company Name',
                    description: 'Purchase description'
                };
                this.razorpay.open(options);
            } catch (err) {
                console.log(err);
                this.error = "Error processing payment";
            }
        },

        getCart() {
            const cart = this.cart;
                // Extract product details and quantities from each cart item
                const regularProducts = cart.flatMap(cartItem => {
                    return cartItem.products.map(productItem => ({
                        productId: productItem.product._id,
                        productName: productItem.product.title,
                        price: productItem.product.price,
                        quantity: productItem.quantity,
                    }));
                });

                const customProducts = cart.flatMap(cartItem => {
                    return cartItem.customProducts.map(customProduct => ({
                        customProductId: customProduct.customProduct._id,
                        price: customProduct.customProduct.price,
                        quantity: customProduct.customQuantity,
                    }));
                });

                return regularProducts.concat(customProducts);
        },

        async updateCartToDatabase() {
            try {
                // Make a request to your backend to clear the cart in the database
                await this.$axios.$delete("http://localhost:3000/api/cart");
            } catch (err) {
                console.log(err);
                // Handle error while updating cart to the database
            }
        },

        async createOrder() {
            try {
                // Make a request to your backend to create the order
                const response = await this.$axios.$post("http://localhost:3000/api/payment", {
                    totalPrice: this.getTotalPrice,
                    products: this.getCart(),
                    date: this.currentDateDisplay,
                    time: this.currentTimeDisplay
                });

                if (response.success) {
                    // Order created successfully
                    await this.updateCartToDatabase();
                    this.$router.push("/");
                } else {
                    // Failed to create order, handle error
                    this.error = "Failed to create order";
                }
            } catch (err) {
                console.log(err);
                this.error = "Error creating order";
            }
        }
    }
};
</script>

<style>
  /* Your existing styles */
</style>
