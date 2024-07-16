<template>
  <main>
          <form @submit.prevent="onLogin">
              <h1>Sign In</h1>
              <!-- Email -->
              <div>
                  <label>Email</label>
                  <input v-model="email" type="email" />
              </div>
              <!-- Password -->
              <div>
                  <label>Password</label>
                  <input v-model="password" type="password" />
              </div>
              <!-- Button -->
              <div>
                  <button>Continue</button>
              </div>
          </form> 
  </main>
</template>

<script>
export default {
  middleware: "auth",
  auth: "guest", 

  data() {
      return {
          email: "",
          password: ""
      };
  },
  methods: {
      async onLogin() {
          try {
              this.$auth.loginWith("local", {
                  data: {
                      email: this.email,
                      password: this.password
                  }
              });

              this.$router.push("/dashboard");   
          } catch(err) {
              console.log(err);
          }
      }
  }
}
</script>