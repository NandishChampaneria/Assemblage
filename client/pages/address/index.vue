<template>
    <main class="m-content">
      <!-- Buttons -->
      <nuxt-link to="/address/add" class="button">Add a new Address</nuxt-link>
      <p>{{ message }}</p>
      <!-- Listing page -->
      <div class="product-grid">
        <div v-for="(address, index) in addresses" :key="address._id" class="product-container">
          <div class="product-details">
            <p>{{ address.fullName }}</p>
            <ul class="info">  
                <!-- Address street address -->
                <li>{{ address.streetAddress }}</li>
                <!-- Address city state zip code -->
                <li>{{ address.city }}, {{ address.state}} {{ address.zipCode }}</li>
                <!-- Address country -->
                <li>{{ address.country }}</li>
                <!-- Address Phone number -->
                <li>Phone number: {{ address.phoneNumber }}</li>
            </ul>
          </div>  
          <div class="product-actions">
            <nuxt-link :to="`/address/${address._id}`">Edit</nuxt-link> &nbsp; | &nbsp;
            <a href="#" @click="onDeleteAddress(address._id, index)">Delete</a> &nbsp; | &nbsp;
            <a href="#" @click="onSetDefault(address._id)">Select Address</a>
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
      let response = await $axios.$get("http://localhost:3000/api/addresses");

      return {
        addresses: response.addresses
      };
    } catch (err) {
      console.log(err);
    }
  },
  data() {
    return {
      message: ""
    };
  },
  methods: {
    async onDeleteAddress(id, index) {
      try {
        let response = await this.$axios.$delete(`http://localhost:3000/api/addresses/${id}`);

        if (response.success) {
          this.message = response.message;
          this.addresses.splice(index, 1);
        }
      } catch (err) {
        this.message = err.message;
        console.log(err);
      }
    },

    async onSetDefault(id) {
      try {
        let response = await this.$axios.$put(`/api/addresses/set/default`, {
          id: id
        });

        if (response.success) {
          this.message = response.message;
          await this.$auth.fetchUser();
          this.$router.push("/placeorder")
        }
      } catch (err) {
        this.message = err.message;
        console.log(err);
      }
    }
  }
};
</script>