<template>
    <main>
        <div class="left-column">
        <!-- Content for the left column -->
        </div>

        <div class="main-content">
            <div class="v-space-small"></div>
            <h2 class="text-main">Update {{ product.title }}</h2>
            <!-- Category Dropdown -->
            <form @submit.prevent="onUpdateProduct">
                <div class="v-space-medium"></div>
                <label>Category</label>
                <div class="v-space"></div>
                <select class="select-option" v-model="categoryID">
                    <option v-for="category in categories" :value="category._id" :key="category._id">{{ category.type }}</option>
                </select>

                <!-- Title -->
                <div class="v-space-small"></div>
                <label>Title</label>
                <div class="v-space"></div>
                <input type="text" class="input-text" v-model="title" :placeholder="product.title" />

                <!-- Price -->
                <div class="v-space-small"></div>
                <label>Price</label>
                <div class="v-space"></div>
                <input type="number" class="input-text" v-model="price" :placeholder="product.price" />

                <!-- Stock Quantity -->
                <div class="v-space-small"></div>
                <label>Stock Quantity</label>
                <div class="v-space"></div>
                <input type="number" class="input-text" v-model="stockQuantity" :placeholder="product.stockQuantity" />

                <!-- Description -->
                <div class="v-space-small"></div>
                <label>Description</label>
                <div class="v-space"></div>
                <textarea class="input-text" v-model="description" :placeholder="product.description"></textarea>

                <!-- Photo -->
                <div class="v-space-small"></div>
                <label>Add Photo</label>
                <div class="v-space"></div>
                <input type="file" @change="onFileSelected" />
                <div class="v-space"></div>


                <hr />

                <!-- Button -->
                <div class="v-space-medium"></div>
                <button type="submit" class="button-text">Update Product</button>
            </form>


        </div>

        <div class="right-column">
        <!-- Content for the right column -->
        </div>
    </main>
</template>
<script>
export default {
    middleware: "authenticated",
    
    async asyncData({ $axios, params }) {
        try {
            let categories = $axios.$get("http://localhost:3000/api/categories");
            let product = $axios.$get(`http://localhost:3000/api/products/${params.id}`);

            const [catResponse, productResponse] = await Promise.all([
                categories,
                product
            ]);

            console.log(productResponse);

            return {
                categories: catResponse.categories,
                product: productResponse.product
            };
        } catch(err) {
            console.log(err);
        }
    },

    data() {
        return {
            categoryID: null,
            title: "",
            price: "",
            description: "",
            stockQuantity: "",
            selectedFile: null,
            fileName: ""
        };
    },

    methods: {
        onFileSelected(event) {
            this.selectedFile = event.target.files[0];
            this.fileName = event.target.files[0].name;
        },

        async onUpdateProduct() {
            let data = new FormData();
            data.append("title", this.title); 
            data.append("price", this.price);
            data.append("description", this.description);
            data.append("stockQuantity", this.stockQuantity);
            data.append("categoryID", this.categoryID);
            if (this.selectedFile) {
                data.append("photo", this.selectedFile, this.selectedFile.name);
            }

            console.log("FormData Content:", data);

            try {
                let result = await this.$axios.$put(
                    `http://localhost:3000/api/products/${this.$route.params.id}`,
                    data
                );
                console.log("Product updated:", result);
                this.$router.push("/dashboard");
            } catch (error) {
                console.error("Error updating product:", error);
            }
        }
    }
};
</script>