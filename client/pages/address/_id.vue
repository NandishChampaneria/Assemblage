<template>
    <main class="m-content">
        <div class="add-address-flex-box">
            <h1 class="shoptitle">UPDATE ADDRESS</h1>
            <form @submit.prevent="onUpdateAddress" class="add-form">
                <!-- Phone -->
                <div class="v-space-xs"></div>
                <h4 style="font-family: Alata, sans-serif;">Contact</h4>
                <input type="text" class="input-text" v-model="phoneNumber" :placeholder="address.phoneNumber" />

                <!-- Country / Region -->
                <div class="v-space-small"></div>
                <h4 style="font-family: Alata, sans-serif;">Delivery</h4>
                <select class="input-text" v-model="country">
                    <option v-for="country in countries" :key="country.cc2a" :value="country.name.common">{{ country.name.common }}</option>
                </select>

                <!-- Full Name -->
                <div class="v-space-xs"></div>
                <div class="add-fb-v">
                    <input type="text" class="input-text" v-model="firstName" :placeholder="address.fullName" />
                    <input type="text" class="input-text" v-model="lastName" placeholder="Last name"/>
                </div>

                <!-- Street Address -->
                <div class="v-space-xs"></div>
                <input type="text" class="input-text" v-model="streetAddress1" :placeholder="address.streetAddress" />

                <!-- Street Address 2 -->
                <div class="v-space-xs"></div>
                <input type="text" class="input-text" v-model="streetAddress2" placeholder="Apartment, suite, unit, building, floor, etc." />

                <div class="v-space-xs"></div>
                <div class="add-fb-v">
                    <!-- City -->
                    <input type="text" class="input-text" v-model="city" :placeholder="address.city" />

                    <!-- State -->
                    <input type="text" class="input-text" v-model="state" :placeholder="address.state" />

                    <!-- Zip code -->
                    <input type="text" class="input-text" v-model="zipCode" :placeholder="address.zipCode" />
                </div>


                <!-- Delivery Instructions -->
                <div class="v-space-small"></div>
                <h4 style="font-family: Alata, sans-serif;">Instructions</h4>
                <textarea class="input-text" v-model="deliverInstructions" :placeholder="address.deliverInstructions"></textarea>

                <!-- Security Code -->
                <div class="v-space-xs"></div>
                <input type="text" class="input-text" v-model="securityCode" :placeholder="address.securityCode" />

                <!-- Button -->
                <div class="v-space-small"></div>
                <button class="buy-now-add">Update Address</button>
            </form>
        </div>
    </main>
</template>

<script>
export default {
  async asyncData({ $axios, params }) {
    try {
      let response = $axios.$get("http://localhost:3000/api/countries");
      let singleAddress = $axios.$get(`http://localhost:3000/api/addresses/${params.id}`);

      let [countriesResponse, addressResponse] = await Promise.all([
        response,
        singleAddress
      ]);

      return {
        countries: countriesResponse,
        address: addressResponse.address
      };
    } catch (err) {
      console.log(err);
    }
  },

  data() {
    return {
      country: "India",
      firstName: "",
      lastName: "",
      streetAddress1: "",
      streetAddress2: "",
      city: "",
      state: "",
      zipCode: "",
      phoneNumber: "",
      deliverInstructions: "",
      securityCode: ""
    };
  },

  methods: {
    async onUpdateAddress() {
      try {
        let data = new URLSearchParams();
        data.append("country", this.country);
        data.append("fullName", this.firstName + " " + this.lastName);
        data.append("streetAddress", this.streetAddress1 + " " + this.streetAddress2);
        data.append("city", this.city);
        data.append("state", this.state);
        data.append("zipCode", this.zipCode);
        data.append("phoneNumber", this.phoneNumber);
        data.append("deliverInstructions", this.deliverInstructions);
        data.append("securityCode", this.securityCode);

        let result = await this.$axios.$put(`http://localhost:3000/api/addresses/${this.$route.params.id}`, data);

        this.$router.push("/address");
      } catch (err) {
        console.log(err);
      }
    }
  }
};
</script>