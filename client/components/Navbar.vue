<template>
    <main>
        <div class="background-svg">
            <svg width="100%" height="661" viewBox="0 0 1440 661" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1542.89 194.525C1385.48 162.831 962.952 145.459 661.718 342.081C360.485 538.703 20.2794 493.375 -112.169 437.163L-151.162 420.19" stroke="#D1E0DE" stroke-width="350"/>
            </svg>
        </div>
        <nav :class="{ 'navbar-hidden' : !navbarVisible }">
            <nuxt-link to="/" class="logo">
                <img class="main-logo" src="../imgs/logo.png">
            </nuxt-link>

            <div class="ul">
                <!--

                        <nuxt-link to="/customorders" class="customorders">CUSTOMISE</nuxt-link>

                        <nuxt-link to="/#" class="about">ABOUT US</nuxt-link>

                        <nuxt-link to="/#" class="contact">CONTACT US</nuxt-link>

                        <template v-if="$auth.$state.loggedIn">
                            <nuxt-link to="/profile" class="account">
                                {{ $auth.$state.user.name }}
                            </nuxt-link>
                        </template>

                        <template v-else>
                            <nuxt-link class="account" to="/login">
                                LOGIN/ SIGNUP
                            </nuxt-link>
                        </template>

                --->

                <div @click="toggleSearchBar" class="fas fa-search menu" id="search-btn"></div>

                <nuxt-link class="cart" to="/cart">
                    <div class="fas fa-shopping-cart" id="cart-btn"></div>
                    <p v-if="cartLength > 0" style="font-size: 17px">{{ cartLength }}</p>
                </nuxt-link>

                <div @click="toggleSidebar" class="fas fa-bars menu" id="menu-btn"></div>
            </div>
            <div class="sidebar" :class="{ 'open'  : menuVisible}">
                <div class="c-s">
                    <div class="srch-sidebar">MENU</div>
                    <i @click="toggleSidebar" class="fa fa-close close-sidebar" id="close-btn"></i>
                </div>

                <nuxt-link style="color: inherit; text-decoration: none;" @click.native="closeSidebar" to="/customorders" class="customorders-sidebar">CUSTOMISE</nuxt-link>

                <nuxt-link style="color: inherit; text-decoration: none;" @click.native="closeSidebar" to="/#" class="about-sidebar">ABOUT US</nuxt-link>

                <nuxt-link style="color: inherit; text-decoration: none;" @click.native="closeSidebar" to="/#" class="contact-sidebar">CONTACT US</nuxt-link>

                <template v-if="$auth.$state.loggedIn">
                    <nuxt-link style="color: inherit; text-decoration: none;" @click.native="closeSidebar" to="/profile" class="account-sidebar">
                        {{ $auth.$state.user.name }}
                    </nuxt-link>
                </template>

                <template v-else>
                    <nuxt-link style="color: inherit; text-decoration: none;" @click.native="closeSidebar" class="account-sidebar" to="/login">
                        LOGIN
                    </nuxt-link>
                </template>

                <a class="insta-sidebar" href="https://www.instagram.com/assemblage.uditi/?igsh=MW55ZTR6OG0zMmFnYQ%3D%3D" target="_blank">
                    <i class="fa-brands fa-instagram"></i>
                </a>

                <p class="rights-sidebar">&copy; 2024 <nuxt-link class="rights-link" to="/">Assemblage</nuxt-link>. All rights reserved.</p>
            </div>


            <div class="search-sidebar" style="font-family: Alata, sans-serif;" :class="{ 'open'  : searchBarVisible}">
                <div class="c-s">
                    <div class="srch-sidebar">SEARCH</div>
                    <i @click="toggleSearchBar" class="fa fa-close close-sidebar" id="close-btn"></i>
                </div>
                <input class="srch-input" type="text" v-model="searchQuery" placeholder="Enter a keyword">
                <div class="srch-results" v-if="searchQuery">
                    <h3 v-if="searchResults.length > 0">Products</h3>
                    <h3 v-else>No results found</h3>
                    <div class="srch-product" v-for="result in searchResults" :key="result.objectID">
                        <div>
                            <img class="srch-pic" :src="result.photos[0]" alt="Product Image">
                        </div>
                        <div class="srch-product-info">
                            <nuxt-link :to="`/products/${result.objectID}`" @click.native="closeSearchBar" class="srch-product-title">{{ result.title }}</nuxt-link>
                            <div class="srch-product-price">Rs. {{ result.price }}</div>
                        </div>
                    </div>
                </div>
            </div>


            <div v-if="menuVisible" class="sidebar-overlay" @click="closeSidebar"></div>
            <div v-if="searchBarVisible" class="sidebar-overlay" @click="closeSearchBar"></div>
        </nav>
    </main>
</template>

<script>
export default {
    head: {
        link: [
            {
                rel: 'preconnect',
                href: 'https://fonts.gstatic.com'
            },
            {
                rel: 'stylesheet',
                href: 'https://fonts.googleapis.com/css2?family=Alata&display=swap'
            },
            {
                rel: 'stylesheet',
                href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css'
            },
        ]
    },

    data() {
        return {
            cartVisible: false,
            cartLength: 0,
            cart: null,
            lastScrollPosition: 0,
            scrollDirection: 'down', // Assuming initially the scroll direction is down
            navbarVisible: true, // Assuming initially the navbar is visible
            searchQuery: '',
            searchResults: []
        };
    },

    watch: {
        searchQuery(newVal) {
            this.performSearch();
        }
    },

    methods: {
        toggleSidebar() {
            this.$store.commit('toggleSidebar');
        },
        closeSidebar() {
            this.$store.commit('closeSidebar');
        },
        toggleSearchBar() {
            this.$store.commit('toggleSearchBar');
        },
        closeSearchBar() {
            this.$store.commit('closeSearchBar');
        },

        handleScroll() {
            const currentScrollPosition = window.scrollY;

            if (currentScrollPosition > this.lastScrollPosition) {
                this.scrollDirection = 'down';
                this.navbarVisible = false; 
            } else {
                this.scrollDirection = 'up';
                this.navbarVisible = true;
            }

            this.lastScrollPosition = currentScrollPosition;
        },

        async performSearch() {
            try {
                const response = await this.$axios.post('/api/search', { title: this.searchQuery });
                this.searchResults = response.data;
            } catch(err) {
                console.error('Error fetching search results:', error);
            }
        }
    },

    computed: {
        menuVisible() {
            return this.$store.state.sidebarVisible;
        },

        searchBarVisible() {
            return this.$store.state.searchBarVisible;
        }
    },

    mounted() {
        // Listen for scroll events
        window.addEventListener('scroll', this.handleScroll);
    },

    beforeDestroy() {
        // Remove scroll event listener before component is destroyed
        window.removeEventListener('scroll', this.handleScroll);
    }
}
</script>

