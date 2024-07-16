# Assemblage-Bracelet Ecommerce

Welcome to **Assemblage**, an ecommerce website dedicated to selling bracelets.

## Overview

Assemblage is built using the MERN stack (MongoDB, Express.js, Node.js, and Vue.js with Nuxt.js) to provide a robust platform for online bracelet sales. It integrates Algolia API for powerful search capabilities and Razorpay for secure payment processing.

## Features

- **MongoDB:** Database management for storing product catalog, user profiles, and order history.
- **Express.js:** Backend framework for handling API requests and server-side logic.
- **Node.js:** Runtime environment for server operations and backend scripting.
- **Vue.js with Nuxt.js:** Frontend framework for building responsive and dynamic user interfaces.
- **Algolia API:** Facilitates fast and efficient product search functionality.
- **Razorpay:** Integrates seamless payment processing for customer transactions.

## Installation

To run Assemblage locally, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/Assemblage.git
   cd Assemblage

2. **Install dependencies:**
 
   ```bash
   # Install server dependencies
   cd server
   npm install
    
   # Install client dependencies
   cd client
   npm install

   # Install admin dependencies
   cd admin
   npm install

3. **Set up enviroment variables:**Create .env files in the server directory with configurations for MongoDB connection strings, Algolia API keys, Razorpay credentials, and any other necessary environment variables.

4. **Run the application:**
   ```bash
   # Start the server (from the server directory)
   npm start
  
   # Start the client (from the client directory)
   PORT=9000 npm run dev

   # Start the admin (from the admin directory)
   PORT=8000 npm run dev

## Usage

- Explore a variety of bracelets through intuitive browsing and search functionalities powered by Algolia.
- Add items to the cart and proceed to checkout securely with Razorpay.
- Manage user accounts, view order history, and enjoy a seamless shopping experience.

## Contributing

Contributions are welcome! Here's how you can contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Make your changes.
4. Commit your changes (`git commit -am 'Add some feature'`).
5. Push to the branch (`git push origin feature/your-feature`).
6. Create a new Pull Request.

Please make sure to update tests as appropriate and adhere to the coding conventions used.



 
