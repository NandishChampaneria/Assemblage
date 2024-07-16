<template>
    <main>
        <div class="left-column">
        <!-- Content for the left column -->
        </div>

        <div class="main-content">
            <div class="v-space-small"></div>
            <h2 class="text-main">Add a new Product</h2>
            <!-- Category Dropdown -->
            <form @submit.prevent="onAddProduct">
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
                <input type="text" class="input-text" v-model="title" />

                <!-- Price -->
                <div class="v-space-small"></div>
                <label>Price</label>
                <div class="v-space"></div>
                <input type="number" class="input-text" v-model="price" />

                <!-- Stock Quantity -->
                <div class="v-space-small"></div>
                <label>Stock Quantity</label>
                <div class="v-space"></div>
                <input type="number" class="input-text" v-model="stockQuantity" />

                <!-- Description -->
                <div class="v-space-small"></div>
                <label>Description</label>
                <div class="v-space"></div>
                <textarea placeholder="Provide details of the product" class="input-text" v-model="description"></textarea>
                
                <!-- Photo -->
                <div class="v-space-small"></div>
                <label>Add Photo</label>
                <div class="v-space"></div>
                <input type="file" multiple @change="onFileSelected" />
                <div class="v-space"></div>
                <p v-if="selectedFiles.length > 0">{{ selectedFiles.length }} files selected</p>

                <hr />

                <!-- Button -->
                <div class="v-space-medium"></div>
                <button type="submit" class="button-text">Add Product</button>
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
    
    async asyncData({ $axios }) {
        try {
            let categories = $axios.$get("http://localhost:3000/api/categories");

            const [catResponse] = await Promise.all([
                categories
            ]);

            console.log(catResponse);

            return {
                categories: catResponse.categories,
            };
        } catch(err) {
            console.log(err);
        }
    },

    data() {
        return {
            categoryID: null,
            title: "",
            price: 0,
            description: "",
            stockQuantity: 1,
            selectedFiles: [],
        };
    },

    methods: {
        onFileSelected(event) {
            this.selectedFiles = Array.from(event.target.files);
        },

        async onAddProduct() {
            let data = new FormData();
            data.append("title", this.title); 
            data.append("price", this.price);
            data.append("description", this.description);
            data.append("stockQuantity", this.stockQuantity);
            data.append("categoryID", this.categoryID);
            this.selectedFiles.forEach((file) => {
                data.append("photos", file);
            });

            console.log("FormData Content:", data);
    
            let result = await this.$axios.$post(
            "http://localhost:3000/api/products",
            data
            );
  
            this.$router.push("/dashboard");
        }
    }
};
</script>