<template>
    <main>
        <div class="left-column">
        <!-- Content for the left column -->
        </div>
        <div class="main-content">
            <nuxt-link to="/" class="home">Home</nuxt-link>
            <div class="v-space-small"></div>
            <h2>Profile</h2>
            <div class="v-space-xs"></div>
            <form @submit.prevent="onUpdateProfile">
                <!-- Name -->
                <label>Name</label>
                <input class="input-text" v-model="name" :placeholder="$auth.$state.user.name" />

                <!-- Email -->
                <label>Email</label>
                <input class="input-text" v-model="email" :placeholder="$auth.$state.user.email" />

                <!-- Password -->
                <label>Password</label>
                <input class="input-text" v-model="password" />

                <!-- Button -->
                <div class="v-space-medium"></div>
                <button type="submit" class="button-text" >Update Profile</button>
            </form>
            <a href="#" @click="onLogout">Sign Out</a>
            <div class="v-space-medium"></div>
        </div>
        <div class="right-column">
        <!-- Content for the right column -->
        </div>
    </main>
</template>

<script>
export default {

    data() {
        return {
            name: "",
            email: "",
            password: ""
        }
    },

    methods: {
        async onUpdateProfile() {
            let data = {
                name: this.name,
                email: this.email,
                password: this.password
            };
            try {
                let response = await this.$axios.$put("http://localhost:3000/api/auth/user", data);

                if(response.success) {
                    this.name = "";
                    this.email = "";
                    this.password = "";

                    await this.$auth.fetchUser();
                }
            } catch(err) {
                console.log(err);
            }
        },

        async onLogout() {
            await this.$auth.logout();
            this.$store.commit("clearCart");
        }
    }
};
</script>