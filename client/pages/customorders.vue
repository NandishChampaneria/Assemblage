<template>
    <!--MAIN-->
    <main class="m-content">
        <nuxt-link to="/" class="home">Home</nuxt-link>
        <form @submit.prevent="onAddToCart">
            <label>Strings: </label>
            <input type="number" v-model="customProductData.strings" @input="calculatePrice()" />
            <label>Pattern: </label>
            <input type="text" v-model="customProductData.pattern" />
            <label>Color: </label>
            <div>
                <label v-for="(color, index) in availableColors" :key="index">
                    <input type="checkbox" :value="color.code" v-model="selectedColors">{{ color.name }}
                </label>
            </div>
            <label>Price: </label>
            <input type="text" v-model="customProductData.price" readonly />
            <select v-model="customQuantity">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
            </select>
            <button type="submit">Add to Cart</button>
        </form>
    </main>
    <!--/MAIN-->
</template>
  
<script>
export default {
    data() {
        return {
            customProductData: {
                strings: "",
                pattern: "",
                color: [],
                price: 0
            },
            customQuantity: 1,
            availableColors: [
                { name: 'Red', code: '#FF0000' },
                { name: 'Green', code: '#00FF00' },
                { name: 'Blue', code: '#0000FF' },
                // Add more colors as needed
            ],
            selectedColors: []
        };
    },

    methods: {
        calculatePrice() {
            this.customProductData.price = parseInt(this.customProductData.strings) * 50;
        },
    
        async onAddToCart() {
            try {   
                this.calculatePrice();

                this.customProductData.color = this.selectedColors;

                let data = {
                    isCustomProduct: true,
                    customProductData: this.customProductData,
                    quantity: this.customQuantity
                };

                let response = await this.$axios.$post("http://localhost:3000/api/cart", data);
                console.log(response);
            } catch(err) {
                console.log(err);
            }
        }
    }
}
</script>
  