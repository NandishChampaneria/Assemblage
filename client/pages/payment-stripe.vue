<template>
    <!--MAIN-->
    <main>
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
                  <b>The total price is ${{ getCartTotalPrice }}</b>
                </div>
  
                <!-- Error message  -->
                <div>
                  <b>Error</b>
                </div>
                <form action="#" method="post">
                  <div>
                    <div class="v-space-medium"></div>
                        <!-- Stripe card -->
                        <div ref="card"></div>

                        <!-- End of Stripe card -->
  
                    <div class="v-space-medium"></div>
                    <hr />
                    <div>
                      <span>
                        <b>Make sure your address is correct</b>
                      </span>
                    </div>
                    <div>
                      <span>If the address contains typos or other errors, your package may be undeliverable.</span>
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
                </form>
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
    data() {
        return {
            error: "",
            stripe: null,
            card: null
        };
    },
    
    computed: {
      ...mapGetters(["getCart", "getCartTotalPriceWithShipping", "getEstimatedDelivery", "getCartTotalPrice"])
    },

    mounted() {
        this.stripe = Stripe("pk_test_51OlrUpF0OLrNweuub0PbgmMo2PMuEA5JnPbfMLeNEdJwfqPuI3VroUvSq7P0b3ocMko9pvaFKFuyxxlJEZmsKbB600SYX2NmqB")
        let elements = this.stripe.elements();
        this.card = elements.create("card");
        this.card.mount(this.$refs.card);
    },

    methods: {
      async onPurchase() {
        try {
          let token = await this.stripe.createToken(this.card);
          let response = await this.$axios.$post("http://localhost:3000/api/payment", {
            token: token,
            totalPrice: this.getCartTotalPrice,
            cart: this.getCart,
            //estimated delivery for future
          });

          if(response.success) {
            // Do something like redirecting to the home page
            this.$store.commit("clearCart");
            this.$router.push("/");
          }
        } catch(err) {
          console.log(err);
        }
      }
    }
}
</script>

<style>
  .StripeElement {
    box-sizing: border-box;
  
    height: 40px;
  
    padding: 10px 12px;
  
    border: 1px solid transparent;
    border-radius: 4px;
    background-color: white;
  
    box-shadow: 0 1px 3px 0 #e6ebf1;
    -webkit-transition: box-shadow 150ms ease;
    transition: box-shadow 150ms ease;
  }
  
  .StripeElement--focus {
    box-shadow: 0 1px 3px 0 #cfd7df;
  }
  
  .StripeElement--invalid {
    border-color: #fa755a;
  }
  
  .StripeElement--webkit-autofill {
    background-color: #fefde5 !important;
  }
</style>