<template>
    <main class="m-content">
        <div class="add-address-flex-box">
            <h1 class="shoptitle">ADD A NEW ADDRESS</h1>
            <form class="add-form">
                <!-- Phone -->
                <div class="v-space-xs"></div>
                <h4 style="font-family: Alata, sans-serif;">Contact</h4>
                <input type="text" class="input-text" v-model="phoneNumber" placeholder="Mobile number" />

                <!-- Country / Region -->
                <div class="v-space-small"></div>
                <h4 style="font-family: Alata, sans-serif;">Delivery</h4>
                <select style="font-family: Alata, sans-serif; " class="input-text" v-model="country">
                    <option v-for="country in countries" :key="country.cc2a" :value="country.name.common">{{ country.name.common }}</option>
                </select>

                <!-- Full Name -->
                <div class="v-space-xs"></div>
                <div class="add-fb-v">
                    <input type="text" class="input-text" v-model="firstName" placeholder="First name" />
                    <input type="text" class="input-text" v-model="lastName" placeholder="Last name" />
                </div>

                <!-- Street Address -->
                <div class="v-space-xs"></div>
                <input type="text" class="input-text" placeholder="Address" v-model="streetAddress1" />

                <div v-if="!showStreetAddress2"> 
                <div class="v-space-xs"></div>
                <p @click="onToggleStreetAddress2" style="font-family: Alata, sans-serif; color:rgb(0, 162, 255); cursor: pointer;">+ Add apartment, suite, etc.</p>
                </div>

                <!-- Street Address 2 -->
                <div class="v-space-xs"></div>
                <div v-if="showStreetAddress2">
                    <input type="text" class="input-text" placeholder="Apartment, suite, unit, building, floor, etc." v-model="streetAddress2" />
                </div>
                <div class="v-space-xs"></div>

                <div class="add-fb-v">
                    <!-- City -->
                    <input type="text" class="input-text" v-model="city" placeholder="City" />

                    <!-- State -->
                    <input type="text" class="input-text" v-model="state" placeholder="State" />

                    <!-- Zip code -->
                    <input type="text" class="input-text" v-model="zipCode" placeholder="Pin code" />
                </div>

                <!-- Delivery Instructions -->
                <div class="v-space-small"></div>
                <h4 style="font-family: Alata, sans-serif;">Instructions</h4>
                <textarea class="input-text" placeholder="Provide details such as building description, a nearby landmark, or other navigation instructions (optional)" v-model="deliverInstructions"></textarea>

                <!-- Security Code -->
                <div class="v-space-xs"></div>
                <input type="text" class="input-text" placeholder="Security code, call box number, etc. (optional)" v-model="securityCode" />

                <!-- Button -->
                <div class="v-space-small"></div>
                <button class="buy-now-add" @click="onAddAddress">Add Address</button>
            </form>
        </div>
    </main>
</template>

<script>
export default {
  middleware: 'authenticated',
  async asyncData({ $axios }) {
    try {
      let response = await $axios.$get("http://localhost:3000/api/countries");

      return {
        countries: response
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
      securityCode: "",

      showStreetAddress2: false
    };
  },

  methods: {
    async onAddAddress() {
      try {
        let data = {
          country: this.country,
          fullName: this.firstName + " " + this.lastName,
          streetAddress: this.streetAddress2 + " " + this.streetAddress1,
          city: this.city,
          state: this.state,
          zipCode: this.zipCode,
          phoneNumber: this.phoneNumber,
          deliverInstructions: this.deliverInstructions,
          securityCode: this.securityCode
        };

        let response = await this.$axios.$post("http://localhost:3000/api/addresses", data);

        if (response.success) {
          this.$router.push("/address");
        }
      } catch (err) {
        console.log(err);
      }
    },

    onToggleStreetAddress2() {
      this.showStreetAddress2 =!this.showStreetAddress2;
    }
  }
};
</script>