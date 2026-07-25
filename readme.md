## SK Superstore: Full-Stack MERN Ecommerce Platform

### Live Website: [https://sksuperstore.com](https://sksuperstore.com)

**SK Superstore** is a full-stack ecommerce application built with the MERN stack (MongoDB, Express.js, React, Node.js), Redux Toolkit for state management, and Material UI for modern UI components.

---

# **Features**

### **User:**
- **Product Reviews:** Write, edit, and delete product reviews with instant rating updates.
- **Wishlist:** Save products with custom annotations.
- **Order Management:** View order history, dynamic tracking, and details.
- **Profile Management:** Manage account details and shipping addresses.
- **Shopping Cart:** Add items, modify quantities, and compute subtotals.

### **Admin:**
- **Product Management:** Full CRUD operations for products, including image uploads, brand selection, and soft deletes.
- **Order Management:** View customer orders and update real-time status (Pending, Dispatched, Delivered, Cancelled).

---

# **Deployment & Hosting**

| Component | Platform | URL |
| :--- | :--- | :--- |
| **Frontend** | Vercel | `https://sksuperstore.com` |
| **Backend API** | Render | `(https://sk-superstore.onrender.com/)` |
| **Database** | MongoDB Atlas | Cloud Cluster |

### **Custom Domain Configuration (Vercel)**
To connect `sksuperstore.com` to Vercel, configure the following DNS records with your domain registrar:

| Type | Name | Value |
| :--- | :--- | :--- |
| **A** | `@` | `76.76.21.21` |
| **CNAME** | `www` | `cname.vercel-dns.com` |

---

# **Local Project Setup**

### Clone & Install
```bash
git clone [https://github.com/your-username/sk-superstore.git](https://github.com/your-username/sk-superstore.git)
cd sk-superstore

# Install Frontend
cd frontend
npm install

# Install Backend
cd ../backend
npm install
