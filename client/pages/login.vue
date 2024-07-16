<template>
    <main class="m-content">
        <div class="add-address-flex-box">
            <h1 class="shoptitle">LOGIN</h1>
            <form @submit.prevent="onLogin" class="lg-form">
                <div v-if="message" class="err-div">
                    <div class="err-mssg">
                        <i class="fas fa-exclamation-circle" style="margin-right: 5px"></i>
                        {{ message }}
                    </div>
                </div>

                <!-- Email -->
                <label class="form-label">Email</label>
                <input v-model="email" type="email" class="input-text-login" />

                <!-- Password -->
                <label class="form-label">Password</label>
                <input v-model="password" type="password" class="input-text-login" />

                <div class="v-space-small"></div>

                <!-- Button -->
                <button class="buy-now-add">Sign In</button>
                <hr />
                <div class="register-link">
                    <nuxt-link to="/signup" class="form-label1">Create Account</nuxt-link>
                </div>

            </form>
        </div>    
    </main>
</template>

<script>
export default {
    layout: "none",
    middleware: "auth",
    auth: "guest", 

    data() {
        return {
            email: "",
            password: "",
            message: ""
        };
    },
    methods: {
        async onLogin() {
            if(!this.email || !this.password) {
                this.message = "Please fill in all fields";
                return;
            }
            try {
                const response = await this.$auth.loginWith("local", {
                    data: {
                        email: this.email,
                        password: this.password
                    }
                });

                // Check if login was successful based on response status
                if (response.status === 200) {
                    // Redirect to home page if login was successful
                    this.$router.push("/");
                } else {
                    // Extract error message from response data
                    const errorMessage = response.data && response.data.message ? response.data.message : "Unknown error";

                    // Set error message to display to the user
                    this.message = errorMessage;
                }
            } catch (error) {
                // Log any errors to the console for debugging
                console.error("An error occurred during login:", error);

                // Set a generic error message to display to the user
                this.message = "Incorrect email or password";
            }
        }
    }
}
</script>