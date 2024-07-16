<template>
    <main class="m-content">
        <div v-if="!$auth.$state.loggedIn">
            <div class="ss-container">
                <h4 class="shoptitle1">Login to view your orders</h4>
                <nuxt-link class="start-shopping" to="/login">Login</nuxt-link>
            </div>
        </div>  
        <div v-for="order in orders" :key="order._id">
            <h2>Order No.: 
                <nuxt-link :to="`/orders/${order._id}`">{{ order._id }}</nuxt-link>
            </h2>
            <strong>Name: {{ order.owner.name }}</strong>
            <hr />
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
    }
}
</script>