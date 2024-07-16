<template>
    <main class="m-content1">
        <div v-if="!sidebarStatus && !searchBarStatus" :class="{ 'cart-l-hidden' : !cartLVisible }" class="cart-l">{{ getTotalQuantity }}</div>        
        <div class="container-id">
            <div class="product-image-id">
                <div class="main-image-container">
                    <img :src="currentImage" alt="Product Image" class="main-image" :key="currentImage">
                </div>

                <div class="arrow-buttons" v-if="showArrows">
                    <button class="arrow-button" @click="prevImage"><i class="fa-solid fa-arrow-left"></i></button>
                    <button class="arrow-button" @click="nextImage"><i class="fa-solid fa-arrow-right"></i></button>
                </div>

                <div class="small-images-container" v-if="!showArrows">
                    <img v-for="(photo, index) in product.photos" :key="index" :src="photo" class="small-image" alt="Product Thumbnail" @click="changeImage(index)" :class="{ 'current' : index === currentIndex }">
                </div>
            </div>
            <div class="product-info">
                <div class="info-content">
                    <p class="title-id">{{ product.title }}</p>
                    <!-- <p class="cat-id">Type: {{ product.category.type }}</p> -->
                    
                    <div class="price-id">
                        <span>Rs. {{ product.price }}</span>
                    </div>

                    <hr />

                    <p class="qty-id">Quantity</p>
                    <div class="quantity-controls">
                        <button class="quantity-chng" @click="decrementQuantity" :disabled="quantity <= 1">
                            <i class="fa-solid fa-minus"></i>
                        </button>
                        <input type="number" class="quantity-input" v-model.number="quantity" min="1" max="5" />
                        <button class="quantity-chng" @click="incrementQuantity" :disabled="quantity >= 5">
                            <i class="fa-solid fa-plus"></i>
                        </button>
                    </div>

                    <button v-if="$auth.$state.loggedIn" class="add-to-cart-id" @click="onAddProductToCart">Add to Cart</button>
                    <template v-else>
                        <button class="add-to-cart-id" @click="showLoginMessage = true">Add to Cart</button>
                        <p style="color: rgb(210, 84, 90); font-family: Alata, sans-serif" v-if="showLoginMessage">
                            <i class="fas fa-exclamation-circle"></i>
                            Please
                            <nuxt-link class="err-add-to-cart" to="/login">login</nuxt-link> 
                            to add items to your cart.
                        </p>
                    </template>
                </div>
            </div>
        </div>
    </main>
</template>

<script>
import { mapActions } from "vuex";
import { mapGetters } from "vuex";
import { mapMutations } from "vuex";
export default {
    async asyncData({ $axios, params }) {
        try {
            let response = await $axios.$get(`http://localhost:3000/api/products/${params.id}`);
            let cart = await $axios.$get("/api/cart")

            console.log(response);

            return {
                product: response.product,
                currentImage: response.product.photos[0],
                cart: cart.cart
            }
        } catch(err) {
            console.log(err);
        }
    },

    data() {
        return {
            showLoginMessage: false,
            quantity: 1,
            currentIndex: 0,
            currentImage: '',
            showArrows: false,
            lastScrollPosition: 0,
            scrollDirection: 'down', // Assuming initially the scroll direction is down
            cartLVisible: true, // Assuming initially the navbar is visible
        };
    },

    methods: {
        ...mapMutations(["incrementCartLength"]),

        incrementQuantity() {
        this.quantity++;
        },

        decrementQuantity() {
            if (this.quantity > 1) {
                this.quantity--;
            }
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

        async onAddProductToCart() {
            try {
                let data = {
                    productID: this.$route.params.id,
                    quantity: this.quantity
                };
                let response = await this.$axios.$post("http://localhost:3000/api/cart", data);
                console.log(response);
                
                let totalQuantity = parseInt(this.quantity) ;
                this.incrementCartLength(totalQuantity);

                this.$router.push('/cart');
            } catch(err) {
                console.log(err);
            }
        },


        ...mapActions(["addProductToCart"]),

        onChangeQuantity(event, product) {
            let qty = parseInt(event.target.value);
            this.$store.commit("changeQty", { product, qty });
        },

        checkQty(prodQty, qty) {
            if (parseInt(prodQty) === parseInt(qty)) {
                return true;
            } else {
                return false;
            }
        },

        changeImage(index) {
            this.currentImage = this.product.photos[index];
            this.currentIndex = index;

            document.querySelectorAll('.small-image').forEach(img => img.classList.remove('current'));

            document.querySelectorAll('.small-image')[index].classList.add('current');
        },

        prevImage() {
            this.currentIndex = (this.currentIndex === 0) ? (this.product.photos.length - 1) : (this.currentIndex - 1);
            this.currentImage = this.product.photos[this.currentIndex];
        },

        nextImage() {
            this.currentIndex = (this.currentIndex === this.product.photos.length - 1) ? 0 : (this.currentIndex + 1);
            this.currentImage = this.product.photos[this.currentIndex];
        },

        updateShowArrows() {
            if (typeof window != 'undefined') {
                this.showArrows = (window.innerWidth <= 1016);
            }
        }
    },

    computed: {
        ...mapGetters(["getCartLength", "getCartTotalPrice", "getCart"]),

        ...mapGetters(['getMenuStatus', 'getSearchBarStatus']),

        getTotalQuantity() {
            return this.cart.reduce((total, cartItem) => {
                return total + cartItem.products.reduce((subtotal, productItem) => {
                    return subtotal + productItem.quantity;
                }, 0);
            }, 0);
        },

        sidebarStatus() {
            return this.getMenuStatus
        },

        searchBarStatus() {
            return this.getSearchBarStatus
        }
    },

    mounted() {
        window.addEventListener('resize', this.updateShowArrows);
        window.addEventListener('scroll', this.handleScroll);
    },

    created() {
        this.updateShowArrows();
    }, 

    beforeDestroy() {
        window.removeEventListener('resize', this.updateShowArrows);
        window.removeEventListener('scroll', this.handleScroll);
    }
};
</script>