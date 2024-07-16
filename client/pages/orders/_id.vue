<template>
    <main class="m-content">
        <h2>{{ order._id }}</h2>
        <strong>Placed On:</strong>
        <p>{{ order.date }}</p>
        <p>{{ order.time }}</p>
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
            <p>Title: {{ product.productID.title }}</p>
            <p>Price: ${{ product.price }}</p>
            <p>Quantity: {{ product.quantity }}</p>
            <img :src="product.productID.photo" />
            <p>Total Price: ${{ product.price * product.quantity }}</p>
            <div class="v-space-small"></div>            
        </div>

        <strong>Custom Product info:</strong>

        <div v-for="customProduct in order.customProducts" :key="customProduct._id">
            <p>Pattern: {{ customProduct.customProductID.pattern }}</p>
            <p>Strings: {{ customProduct.customProductID.strings }}</p>
            <p>Colors: {{ customProduct.customProductID.color }}</p>
            <p>Price: ${{ customProduct.price }}</p>
            <p>Quantity: {{ customProduct.quantity }}</p>
            <p>Total Price: ${{ customProduct.price * customProduct.quantity }}</p>
            <div class="v-space-small"></div>            
        </div>
    </main>
</template>

<script>
export default {
    async asyncData({ $axios, params }) {
        try {
            let response = await $axios.$get(`http://localhost:3000/api/orders/${params.id}`);

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