<template>
    <main>
        <div class="left-column1">
            <nuxt-link to="/" class="home">Home</nuxt-link>
            <template v-if="$auth.$state.loggedIn">
                <nuxt-link to="/profile">
                <h1 class="head-main">Hello, {{ $auth.$state.user.name }}</h1>
                </nuxt-link>
            </template>
            <template v-else>
                <h1 class="head-main">Hello, </h1>
                <nuxt-link to="/login" class="">Sign In</nuxt-link>
            </template>
            <h2 class="head-main1">Your Cart</h2>
            <!-- Listing page -->
            <div class="product-grid">
                <div v-for="product in getCart" :key="product._id" class="product-container">
                <div class="product-image">
                    <img src="../ok.jpg" alt="Product Image">
                </div>
                    <div class="product-details">
                        <nuxt-link :to="`/products/${product._id}`" class="title">{{ product.title }}</nuxt-link>
                        <p class="cat"></p>
                        <p class="price">${{ product.price * product.quantity }}</p>
                        <select @change="onChangeQuantity($event, product)">
                            <option v-for="i in 10" :key="i" :value="i" :selected="checkQty(product.quantity, i)">Qty: &nbsp;{{ i }}</option>
                        </select>
                        <span>|</span>
                        <span class="">
                            <a href="#" @click="$store.commit('removeProduct', product)">Delete</a>
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <div class="right-column">
            <div class="v-space-large"></div>
            <div>
                <button @click="onProceedCheckout" class="buy-now">Proceed to Checkout</button>
            </div>
            <div class="v-space-xs"></div>
            <div class="price">
                <span>Subtotal ({{ getCartLength }} item): </span>
            </div>
            <div class="v-space-xs"></div>
            <div class="price">
                <span>${{ getCartTotalPrice }}</span>
            </div>
        </div>
    </main>
</template>
  
<script>
import { mapGetters } from "vuex";
export default {
    computed: {
        ...mapGetters(["getCart", "getCartTotalPrice", "getCartLength"])
    },

    methods: {
        onChangeQuantity(event, product) {
            let qty = parseInt(event.target.value);
            this.$store.commit("changeQty", { product, qty });
        },
        checkQty(prodQty, qty) {
            if(parseInt(prodQty) === parseInt(qty)) {
                return true;
            } else {
                return false;
            }
        },
        onProceedCheckout() {
            this.$router.push("/placeorder");
        }
    }
};
</script>
  