<template>
    <main class="m-content">
        <div class="add-address-flex-box">
            <h1 class="shoptitle">SIGNUP</h1>
            <form @submit.prevent="onSignUp" class="lg-form">
                <div v-if="message" class="err-div">
                    <div class="err-mssg">
                        <i class="fas fa-exclamation-circle" style="margin-right: 5px"></i>
                        {{ message }}
                    </div>
                </div>
                <!-- Name -->
                <label class="form-label">Name</label>
                <input v-model="name" type="text" class="input-text-login" />

                <!-- Email -->
                <label class="form-label">Email</label>
                <input v-model="email" type="email" class="input-text-login" />

                <!-- Password -->
                <label class="form-label">Password</label>
                <input v-model="password" type="password" class="input-text-login" />

                <div class="v-space-small"></div>

                <!-- Button -->
                <button class="buy-now-add">Create Account</button>
                <hr />
                <div class="register-link">
                    <nuxt-link to="/login" class="form-label1">Already have an account?</nuxt-link>
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
            name: "",
            email: "",
            password: "",
            message: ""
        }
    },
    methods: {
        async onSignUp() {
            if(!this.name || !this.email || !this.password) {
                this.message = "Please fill in all fields";
                return;
            }
            try {
                let data = {
                    name: this.name,
                    email: this.email,
                    password: this.password
                }

                let response = await this.$axios.$post("http://localhost:3000/api/auth/signup", data);

                console.log(response);

                if(response.success) {
                    this.$auth.loginWith("local", {
                        data: {
                            email: this.email,
                            password: this.password
                        }
                    });

                    this.$router.push("/");
                }
            } catch(err) {
                console.log(err);
                this.message = "Email already registered"
            }
        }
    }
}
</script>