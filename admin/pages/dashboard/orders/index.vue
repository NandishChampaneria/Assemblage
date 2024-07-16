<template>
    <main>  
        <div v-for="order in orders" :key="order._id">
            <h2>Order No.: 
                <nuxt-link :to="`/dashboard/orders/${order._id}`">{{ order._id }}</nuxt-link>
                <input type="checkbox" id="myCheckbox" name="myCheckbox" @click="onCheckboxSelect">
            </h2>
            <strong>Name: {{ order.owner.name }}</strong>
            <hr />
        </div>
    </main>
</template>

<script>
export default {
    middleware: "authenticated",
    
    async asyncData({ $axios }) {
        try {
            let response = await $axios.$get("http://localhost:3000/api/allorders");
            
            console.log(response.products);

            return {
                orders: response.products
            };
        } catch(err) {
            console.log(err);
        }
    },

    methods: {
        onCheckboxSelect() {
            const confirmation = window.confirm("Are you sure you want to confirm/unconfirm the order?");

            if(confirmation) {
                console.log("Checkbox action confirmed");
            } else {
                console.log("Checkbox action cancelled");
                return false;
            }
        }
    }
}
</script>