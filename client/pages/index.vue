<template>
  <main class="m-content">
    <div v-if="!sidebarStatus && !searchBarStatus" :class="{ 'cart-l-hidden' : !cartLVisible }" class="cart-l"></div>
    <h1 class="shoptitle"> OUR <span> PRODUCTS </span> </h1>
    <!-- Listing page -->
    <div class="product-grid">
      <div v-for="(product, index) in products" :key="product._id" class="product-container">
        <div class="product-image product-image-hover" 
             @mouseenter="toggleHovered(index)" 
             @mouseleave="toggleHovered(index)">
          <nuxt-link :to="`/products/${product._id}`">
            <img :src="hovered[index] ? product.photos[1] : product.photos[0]" alt="Product Image" class="transition-image">
          </nuxt-link>
          <div v-if="$auth.$state.loggedIn" class="fa-solid fa-cart-plus cart-shop-icon" @click="addToCart" v-show="hovered[index]"></div>
        </div>
        <div class="product-details">
          <nuxt-link :to="`/products/${product._id}`" class="product-title">{{ product.title }}</nuxt-link>
          <p class="price-title">Rs. {{ product.price }}</p>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      hovered: [],
      lastScrollPosition: 0,
      scrollDirection: 'down', // Assuming initially the scroll direction is down
      cartLVisible: true, // Assuming initially the navbar is visible
    };
  },
  methods: {
    toggleHovered(index) {
      this.$set(this.hovered, index, !this.hovered[index]);
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

    async addToCart() {
      try {
        const hoveredIndex = this.hovered.findIndex(isHovered => isHovered);
        const productId = this.products[hoveredIndex]._id;
        let data = {
          productID: productId,
          quantity: 1
        };

        let response = await this.$axios.$post("http://localhost:3000/api/cart", data);
        console.log(response);
        
        this.$router.push('/cart');
      } catch(err) {
        console.log(err);
      }
    },
  },

  computed: {


    ...mapGetters(['getMenuStatus', 'getSearchBarStatus']),

    sidebarStatus() {
      return this.getMenuStatus
    },

    searchBarStatus() {
      return this.getSearchBarStatus
    }
  },

  async asyncData({ $axios }) {
    try {
      let response = await $axios.$get("http://localhost:3000/api/products");
      let cart = await $axios.$get("/api/cart")

      const hovered = Array(response.products.length).fill(false);

      response.products.forEach(product => {
        product.currentPhotoIndex = 0;
      });
      return {
        products: response.products,
        hovered: hovered,
        cart: cart.cart
      }
      
    } catch(err) {
      console.log(err);
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
};
</script>

<style>
body {
  background-color: #F7F2F0;
}

.product-grid {
  overflow-x: hidden;
}

.product-image {
  position: relative;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  transition: transform 0.3s ease;
}

.transition-image {
  width: 100%;
  height: auto;
  transition: src 0.3s ease;
}

.product-image-hover img:hover {
  transform: scale(1.1); /* Optional: zoom effect on hover */
}
</style>
