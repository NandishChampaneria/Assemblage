<template>
    <main>
        <div class="left-column">
        <!-- Content for the left column -->
        </div>
        <div class="main-content">
            <div class="v-space-small"></div>
            <h2>Add a new Category</h2>
            <div class="v-space-xs"></div>
            <form>
                <label>Type</label>
                <input class="input-text" v-model="type" />

                <!-- Button -->
                <div class="v-space-medium"></div>
                <button type="submit" class="button-text" @click="onAddCategory">Add Category</button>
            </form>
            <div class="v-space-medium"></div>
            <ul class="list">
                <li v-for="category in categories" :key="category._id">{{ category.type }}</li>
            </ul>
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
            let response = await $axios.$get("http://localhost:3000/api/categories");
            return {
                categories: response.categories
            }
        } catch(err) {
            console.log(err);
        }
    },

    data() {
        return {
            type: ""
        }
    },

    methods: {
        async onAddCategory() {
            event.preventDefault();

            try {
                let data = { type: this.type }
                let response = await this.$axios.$post("http://localhost:3000/api/categories", data);

                this.categories.push(data);
                this.type="";

            } catch(err) {
                console.log(err);
            }
        }
    }
}
</script>