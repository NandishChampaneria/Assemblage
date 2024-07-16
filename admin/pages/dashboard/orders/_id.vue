<template>
    <main>
        <h2>{{ order._id }}</h2>
        <strong>Placed On:</strong>
        <p>{{ order.date }}</p>
        <p>{{ order.time }}</p>

        <strong>User info: </strong>
        <p>{{ order.owner.name }}</p>
        <p>{{ order.owner.email }}</p>

        <strong>Address: </strong>
        <p>Country: {{ order.owner.address.country }}</p>
        <p>Street Address: {{ order.owner.address.streetAddress }}</p>
        <p>City: {{ order.owner.address.city }}</p>
        <p>State: {{ order.owner.address.state }}</p>
        <p>Zip Code: {{ order.owner.address.zipCode }}</p>
        <p>Phone Number: {{ order.owner.address.phoneNumber }}</p>
        <p>Delivery Instructions: {{ order.owner.address.deliverInstructions }}</p>
        <p>Security Code: {{ order.owner.address.securityCode }}</p>

        <strong>Product info:</strong>
        <div v-for="product in order.products" :key="product._id">
            <template v-if="product.productID">
                <p>Title: {{ product.productID.title }}</p>
                <p>Price: ${{ product.price }}</p>
                <p>Quantity: {{ product.quantity }}</p>
                <p>Total Price: ${{ product.price * product.quantity }}</p>
                <div class="v-space-small"></div>
                <hr />           
            </template>  
            <template v-else>
                <p>Product Not Found</p>
                <hr />
            </template>   
        </div>
    </main>
</template>

<script>
export default {
    middleware: "authenticated",
    
    async asyncData({ $axios, params }) {
        try {
            let response = await $axios.$get(`http://localhost:3000/api/allorders/${params.id}`);

            console.log(response);

            return {
                order: response.order
            }
        } catch(err) {
            console.log(err);
        }
    }
}
</script>