<template>
    <main class="m-content">
        <div v-if="!sidebarStatus && !searchBarStatus" :class="{ 'cart-l-hidden' : !cartLVisible }" class="cart-l">{{ getTotalQuantity }}</div>
        <h1 class="shoptitle"> CART </h1>
        <template v-if="!$auth.$state.loggedIn">
            <div class="ss-container">
                <h4 class="shoptitle1">Login to view cart</h4>
                <nuxt-link class="start-shopping" to="/login">Login</nuxt-link>
            </div>
        </template>
        <div class="content-wrapper">
            <div class="main-content-cart">
                <!-- Listing page -->  
                <template v-if="cart && cart.length > 0">
                    <div class="product-grid-cart">
                        <div class="heading-container">
                            <div>Product</div>
                            <div>Quantity</div>
                            <div>Total</div>
                        </div>


                        <div v-for="(cartItem, cartIndex) in cart" :key="cartIndex" v-if="cartItem.products && cartItem.products.length > 0" class="product-container-cart">
                            <div v-for="(productItem, productIndex) in cartItem.products" :key="productIndex" class="product-details-cart">
                                <div class="product-image-cart">
                                    <img :src="productItem.product.photos[0]" alt="Product Image">
                                </div>

                                <div class="details-container">
                                    <div class="title-price">
                                        <nuxt-link :to="`/products/${productItem.product._id}`" class="title-cart">{{ productItem.product.title }}</nuxt-link>
                                        <p class="price-cart">Rs. {{ productItem.product.price }}</p>
                                    </div>
                                
                                    <div class="quantity-delete">
                                        <span>
                                            Qty: {{ productItem.quantity }}
                                        </span>
                                        <button class="del-item-cart" @click="deleteCartItem(productItem.product._id)">Delete</button>
                                    </div>
                                    
                                    <div class="total-price">
                                        <p class="total-cart">Rs. {{ productItem.product.price * productItem.quantity }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Display custom products -->
                    <template v-if="hasCustomProducts">
                        <div class="product-grid-cart">
                            <div v-for="(cartItem, cartIndex) in cart" :key="'custom_' + cartIndex" v-if="cartItem.customProducts && cartItem.customProducts.length > 0" class="product-container-cart">
                                <div v-for="(customProduct, customIndex) in cartItem.customProducts" :key="customIndex" class="product-details-cart">
                                    <div class="product-image-cart">
                                        <img src="../ok.jpg" alt="Custom Product Image">
                                    </div>

                                    <div class="details-container">
                                        <div class="title-price">
                                            <p class="title-cart">Custom Product</p>
                                            <p class="price-cart">Rs. {{ customProduct.customProduct.price }}</p>
                                        </div>
                                        
                                        <div class="quantity-delete">
                                            <span>
                                                Qty: {{ customProduct.customQuantity }}
                                            </span>
                                            <button @click="deleteCustomProduct(customProduct.customProduct._id)">Delete</button>
                                        </div>

                                        <div class="total-price">
                                            <p class="total-cart">Rs. {{ customProduct.customProduct.price * customProduct.customQuantity }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                </template>
                <template v-if="$auth.$state.loggedIn && cart.length === 0">
                    <div class="ss-container">
                        <h4 class="shoptitle1">Your cart is empty</h4>
                        <nuxt-link class="start-shopping1" to="/">Start Shopping</nuxt-link>
                    </div>
                </template>
            </div>
            <div v-if="$auth.$state.loggedIn && cart && cart.length > 0" class="checkout-section">
                <h3 class="title-checkout">Total</h3>
                <div class="price-checkout">
                    <span>Rs. {{ getTotalPrice }}</span>
                </div>
                <div>
                    <button @click="onProceedCheckout" class="buy-now">Proceed to Checkout</button>
                </div>
                <p class="foot-text">Taxes are included</p>
            </div>
        </div>
    </main>
</template>
  
<script>
import { mapState } from "vuex";
import { mapGetters } from "vuex";
export default {
    data() {
        return {
            cartLVisible: true, // Assuming initially the navbar is visible
        }
    },

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


    methods: {
        async deleteCartItem(productId) {
            try {
            const response = await this.$axios.delete(`/api/cart/${productId}`);
            if (!response.data.success) {
                throw new Error(response.data.message || 'Failed to delete product from cart');
            }

            // Find the cart item containing the product to be deleted
            const cartItem = this.cart.find(item => item.products.some(product => product.product._id === productId));

            // Get the quantity of the product to be deleted
            const deletedProductQuantity = cartItem.products.find(product => product.product._id === productId).quantity;

            // Remove the deleted product from the local cart array
            this.cart = this.cart.filter(cartItem => !cartItem.products.some(product => product.product._id === productId));
            this.$store.commit('decrementCartLength', deletedProductQuantity);
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

        onProceedCheckout() {
            this.$router.push("/placeorder");
        },

        handleScroll() {
            const currentScrollPosition = window.scrollY;

            if (currentScrollPosition > this.lastScrollPosition) {
                this.scrollDirection = 'down';
                this.cartLVisible = false; 
            } else {
                this.scrollDirection = 'up';
                this.cartLVisible = true;
            }

            this.lastScrollPosition = currentScrollPosition;
        },
    },

    computed: {
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
                return total + cartItem.products.reduce((subtotal, productItem) => {
                return subtotal + productItem.quantity;
                }, 0);
            }, 0);
        },

        hasCustomProducts() {
            return this.cart.some(cartItem => cartItem.customProducts && cartItem.customProducts.length > 0);
        },

        ...mapGetters(['getMenuStatus', 'getSearchBarStatus']),

        sidebarStatus() {
            return this.getMenuStatus
        },

        searchBarStatus() {
            return this.getSearchBarStatus
        }
    },
    mounted() {
        // Listen for scroll events
        window.addEventListener('scroll', this.handleScroll);
    },

    beforeDestroy() {
        // Remove scroll event listener before component is destroyed
        window.removeEventListener('scroll', this.handleScroll);
    }
}
</script>
  