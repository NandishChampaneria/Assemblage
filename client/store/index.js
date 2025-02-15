export const state = () => ({
    // State
    cart: [],
    cartLength: 0,
    shippingPrice: 0,
    shippingEstimatedDelivery: "",
    sidebarVisible: false,
    searchBarVisible: false
  });
  
  export const actions = {
  };
  
  export const mutations = {
    toggleSidebar(state) {
      state.sidebarVisible = !state.sidebarVisible;
    },

    closeSidebar(state) {
      state.sidebarVisible = false;
    },

    toggleSearchBar(state) {
      state.searchBarVisible = !state.searchBarVisible;
    },

    closeSearchBar(state) {
      state.searchBarVisible = false;
    },

    SET_CART_LENGTH(state, cartLength) {
      state.cartLength = cartLength;
    },
  
    incrementCartLength(state, totalQuantity) {
      state.cartLength+= totalQuantity;
    },

    decrementCartLength(state, deletedProductQuantity) {
      state.cartLength-= deletedProductQuantity;
    },

    resetCartLength(state) {
      state.cartLength = 0;
    },
    /*
    1. Find the product in the cart
    2. Change the quantity of the product
    3. Update the length of the cart
    4. replace the old product with the updated product
  
    */
    changeQty(state, { product, qty }) {
      let cartProduct = state.cart.find(prod => prod._id === product._id);
      cartProduct.quantity = qty;
  
      state.cartLength = 0;
      if (state.cart.length > 0) {
        state.cart.map(product => {
          state.cartLength += product.quantity;
        });
      }
  
      let indexOfProduct = state.cart.indexOf(cartProduct);
      state.cart.splice(indexOfProduct, 1, cartProduct);
    },
    /*
    1. remove the product quantity from the cartLength
    2. get the index of the product that we want to delete
    3. remove that product by using splice
  
    */
    removeProduct(state, product) {
      state.cartLength -= product.quantity;
      let indexOfProduct = state.cart.indexOf(product);
      state.cart.splice(indexOfProduct, 1);
    },
  
    setShipping(state, { price, estimatedDelivery }) {
      state.shippingPrice = price;
      state.shippingEstimatedDelivery = estimatedDelivery;
    },
  
    clearCart(state) {
      state.cart = [];
      state.cartLength = 0;
      state.shippingPrice = 0;
      state.shippingEstimatedDelivery = "";
    }
  };
  
  export const getters = {
    getCartLength: state => state.cartLength,

    getMenuStatus: state => state.sidebarVisible,

    getSearchBarStatus: state => state.searchBarVisible,

    getCart(state) {
      return state.cart;
    },
    getCartTotalPrice(state) {
      let total = 0;
      state.cart.map(product => {
        total += product.price * product.quantity;
      });
  
      return total;
    },
    getCartTotalPriceWithShipping(state) {
      let total = 0;
      state.cart.map(product => {
        total += product.price * product.quantity;
      });
  
      return total + state.shippingPrice;
    },
    getEstimatedDelivery(state) {
      return state.shippingEstimatedDelivery;
    }
  };