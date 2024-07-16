<template>
    <main class="m-content">
        <template v-if="!$auth.$state.loggedIn">
            <div class="ss-container">
                <h4 class="shoptitle1">Login to order</h4>
                <nuxt-link class="start-shopping" to="/login">Login</nuxt-link>
            </div>
        </template>
        <div v-if="$auth.$state.loggedIn && cart.length > 0" class="flex-po">
            <div class="details-po">
                <div class="">
                    <div class="product-container-po">
                        <div>
                            <h2 style="color: #4D5C60; font-family: Alata, sans-serif">
                                Shipping Address
                            </h2>
                            <ul class="info" v-if="$auth.$state.user.address">
                                <li>{{ $auth.$state.user.address.fullName }}</li>
                                <li>{{ $auth.$state.user.address.streetAddress }}</li>
                                <li>{{ $auth.$state.user.address.city }}</li>
                                <li>{{ $auth.$state.user.address.country }}</li>
                                <li>
                                    Phone:
                                    <span>{{ $auth.$state.user.address.phoneNumber }}</span>
                                </li>
                            </ul>
                            <div v-else>
                                <p>No default address set</p>
                            </div>
                            <small>
                                <a href="address">Change</a>
                            </small>
                        </div>
                    </div>
                    <div class="product-container-po">
                        <div>
                            <h2 style="color: #4D5C60; font-family: Alata, sans-serif">
                                Payment Method
                            </h2>
                            <div>
                                <input type="radio" id="radio1" name="radio" checked>
                                <label class="info" for="radio1">Razorpay Secure (UPI, Cards, Wallets, NetBanking)</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div class="summary-po">
                <template v-if="cart && cart.length > 0">
                    <div class="product-grid-po">
                        <div v-for="(cartItem, cartIndex) in cart" :key="cartIndex" v-if="cartItem.products && cartItem.products.length > 0" class="product-container-po-po">
                            <div v-for="(productItem, productIndex) in cartItem.products" :key="productIndex" class="product-details1">
                                <div class="product-image-cart">
                                    <img :src="productItem.product.photos[0]" alt="Product Image">
                                </div>
                                <div class="title-price">
                                    <nuxt-link :to="`/products/${productItem.product._id}`" class="title-po">{{ productItem.product.title }}</nuxt-link>
                                    <p class="price">Rs. {{ productItem.product.price }}</p>
                                    <span>
                                        Qty: {{ productItem.quantity }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Display custom products -->
                    <template v-if="hasCustomProducts">
                        <div class="product-grid-po">
                            <div v-for="(cartItem, cartIndex) in cart" :key="'custom_' + cartIndex" v-if="cartItem.customProducts && cartItem.customProducts.length > 0" class="product-container-po-po">
                                <div class="product-image-cart">
                                    <img src="../ok.jpg" alt="Custom Product Image">
                                </div>
                                <div v-for="(customProduct, customIndex) in cartItem.customProducts" :key="customIndex" class="product-details1">
                                    <div class="title-price">
                                        <p class="title">Custom Product</p>
                                        <p class="price">Rs. {{ customProduct.customProduct.price }}</p>
                                        <span>
                                            Qty: {{ customProduct.customQuantity }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                </template>

                

                <div class="s-box">
                    <div class="price-po-s">
                        <span>Subtotal &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;₹{{ getTotalPrice }}</span>
                    </div>

                    <div class="price-po-s">
                        <span>Shipping &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; FREE</span>
                    </div>
                </div>

                <div class="price-po">
                    <span>Total &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <span class="total-price">₹{{ getTotalPrice }}</span></span>
                </div>

                <div>
                    <button style="font-family: Alata, sans-serif" @click="onPurchase" class="buy-now-po">Place Order</button>
                    <p v-if="showAddressErrorMessage" class="error-message">Please select an address before placing the order.</p>
                </div>
            </div>

            <div class="s-box-rs">
                <div class="price-po-s">
                    <span>Subtotal &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;₹{{ getTotalPrice }}</span>
                </div>

                <div class="price-po-s">
                    <span>Shipping &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; FREE</span>
                </div>
            </div>

            <div class="price-po-rs">
                <span>Total &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;₹{{ getTotalPrice }}</span>
            </div>

            <div class="bn-rs">
                <button style="font-family: Alata, sans-serif" @click="onPurchase" class="buy-now-po-rs">Place Order</button>
                <p v-if="showAddressErrorMessage" class="error-message">Please select an address before placing the order.</p>
            </div>
        </div>
        <div v-else>
            <div class="ss-container">
                <nuxt-link class="start-shopping1" to="/">Start Shopping</nuxt-link>
            </div>
        </div>
    </main>
</template>

<script>
import { mapGetters } from "vuex";
export default {
    middleware: 'authenticated',
    async asyncData({ $axios }) {
        try {
            let response = await $axios.$get("http://localhost:3000/api/cart");
            console.log(response)
            return {
                cart: response.cart
            }
        } catch(err) {
            console.log(err);
        }
    },

    data() {
        return {
            showAddressErrorMessage: false,
            error: "",
            razorpay: null,
            orderId: null,
            currentTimeDisplay: '',
            currentDateDisplay: ''
        }
    },

    computed: {
        ...mapGetters(["getCart", "getCartTotalPrice", "getCartLength"]),

        getCart: {

            get() {
                return this.cart.flatMap(cartItem => {
                const regularProducts = cartItem.products.map(productItem => ({
                productId: productItem.product._id,
                productName: productItem.product.title,
                price: productItem.product.price,
                quantity: productItem.quantity,
                }));

                const customProducts = cartItem.customProducts.map(customProduct => ({
                customProductId: customProduct.customProduct._id,
                price: customProduct.customProduct.price,
                quantity: customProduct.customQuantity,
                }));

                return regularProducts.concat(customProducts);
            });
            },
        },

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
        // Calculate total quantity by iterating over cart and summing the quantity of each product
        getTotalQuantity() {
            return this.cart.reduce((total, cartItem) => {
                total += cartItem.products.reduce((subtotal, productItem) => {
                    return subtotal + productItem.quantity;
                }, 0);

                total += cartItem.customProducts.reduce((subtotal, customProduct) => {
                    return subtotal + customProduct.customQuantity;
                }, 0);

                return total;
            }, 0);
        },

        hasCustomProducts() {
            return this.cart.some(cartItem => cartItem.customProducts && cartItem.customProducts.length > 0);
        }
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
        async deleteCartItem(productId) {
            try {
            const response = await this.$axios.delete(`/api/cart/${productId}`);
            if (!response.data.success) {
                throw new Error(response.data.message || 'Failed to delete product from cart');
            }
            // Remove the deleted product from the local cart array
            this.cart = this.cart.filter(cartItem => !cartItem.products.some(product => product.product._id === productId));
            window.location.reload();

            } catch (error) {
            console.error('Error deleting product from cart:', error.message);
            }
        },

        async deleteCustomProduct(customProductId) {
            try {
                const response = await this.$axios.delete(`/api/custom/cart/${customProductId}`);
                if (!response.data.success) {
                throw new Error(response.data.message || 'Failed to delete custom product from cart');
                }
                // Remove the deleted custom product from the local cart array
                this.cart = this.cart.filter(cartItem => !cartItem.customProducts.some(customProduct => customProduct.customProduct._id === customProductId));
                window.location.reload();
                
            } catch (error) {
                console.error('Error deleting custom product from cart:', error.message);
            }
        },

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


        async updateCartToDatabase() {
            try {
                // Make a request to your backend to clear the cart in the database
                await this.$axios.$delete("http://localhost:3000/api/cart");
                this.$store.commit('resetCartLength')
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
                    products: this.getCart,
                    date: this.currentDateDisplay,
                    time: this.currentTimeDisplay,
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