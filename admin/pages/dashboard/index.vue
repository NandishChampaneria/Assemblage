<template>
  <main>
    <h1 class="head-main">All Products</h1>
    <!-- Buttons -->
    <nuxt-link to="/dashboard/products" class="button">Add a new product</nuxt-link>
    <nuxt-link to="/dashboard/category" class="button1">Add a new category</nuxt-link>

    <nuxt-link to="/dashboard/orders" class="button allorders">Orders</nuxt-link>
    <button @click="onLogout">Logout</button>
    <!-- Listing page -->
    <div class="product-grid">
      <div v-for="(product, index) in products" :key="product._id"  class="product-container">
        <div class="product-image">
          <img :src="product.photos[0]" alt="Product Image">
        </div>
        <div class="product-details">
          <p>{{ product.title }}</p>
          <p>${{ product.price }}</p>
        </div>
        <div class="product-actions">
          <nuxt-link :to="`/dashboard/products/${product._id}`" class="button2">Update</nuxt-link>
          <a href="#" class="button2" @click="onDeleteProduct(product._id)">Delete</a>
        </div> 
      </div>
    </div>
  </main>
</template>

<script>
export default {
  middleware: 'authenticated',

  async asyncData({ $axios }) {
    try {
      let response = await $axios.$get("http://localhost:3000/api/products");
      console.log(response);
      return {
        products: response.products
      };
    } catch(err) {
      console.log(err);
    }
  },

  methods: {
    async onDeleteProduct(id) {
      try {
        let response = await this.$axios.$delete(`http://localhost:3000/api/products/${id}`);

        if(response.status) {
          this.product.splice(index, 1);
        } 
      } catch(err) {
        console.log(err);
      }
    },

    async onLogout() {
      await this.$auth.logout();
    }
  }
};
</script>
