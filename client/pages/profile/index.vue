<template>
    <main class="m-content">
        <h1 class="shoptitle"> ACCOUNT </h1>
        <div class="v-space-small"></div>
        <div v-if="$auth.$state.loggedIn" class="profile-fb">
            <div>
                <div class="profile-section1">
                    <h3 style="padding-top: 10px; color: #D1E0DE">Details</h3>
                    <div>
                        <div style="font-size: 20px">{{ $auth.$state.user.name }}</div>
                        <!--  <nuxt-link to="/profile/edit">Edit</nuxt-link>  -->
                        <div class="v-space-xs"></div>
                        <div v-if="$auth.$state.user.address">
                            <p>{{ $auth.$state.user.address.streetAddress }}</p>
                            <p>{{ $auth.$state.user.address.city }}, {{ $auth.$state.user.address.state}}, {{ $auth.$state.user.address.zipCode }}</p>
                            <p>{{ $auth.$state.user.address.country }}</p>
                        </div>
                        <nuxt-link to="/address" class="view-add" style="color: #ccc; font-size: 18px">View Addresses</nuxt-link>
                    </div>
                </div>
                <div class="v-space-xs"></div>
                <button @click="onLogout" class="logout-btn">Log Out</button>
            </div>
            <div class="profile-section2">
                <h3 style="padding-top: 10px; color: #D1E0DE">Orders</h3>
                <div v-for="order in orders" :key="order._id">
                    <nuxt-link :to="`/orders/${order._id}`" style="color: #ccc; font-size: 20px">{{ order._id }}</nuxt-link>
                    <div style="color: rgb(255, 46, 46)">Rs. {{ order.total }}</div>
                    <hr/>
                </div>
            </div>
        </div>
        <div v-else>
            <div class="ss-container">
                <h4 class="shoptitle1">Login to view your profile</h4>
                <nuxt-link class="start-shopping" to="/login">Login</nuxt-link>
            </div>
        </div>
    </main>
</template>

<script>
export default {
    async asyncData({ $axios }) {
        try {
            let response = await $axios.$get("http://localhost:3000/api/orders");
            
            console.log(response.products);

            return {
                orders: response.products
            };
        } catch(err) {
            console.log(err);
        }
    },

    methods: {
        async onLogout() {
            await this.$auth.logout();
            this.$router.push("/");
            setTimeout(() => {
                location.reload();
            }, 100);
        }
    }
}
</script>