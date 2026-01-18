# 🏠 HopperStay

A modern, full-stack accommodation booking platform inspired by Airbnb. Built with Node.js, Express, MongoDB, and Mapbox integration.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white)

## ✨ Features

- 🔐 **User Authentication** - Secure signup/login with Passport.js
- 🏡 **Listing Management** - Create, read, update, and delete property listings
- 🗺️ **Interactive Maps** - Mapbox integration showing exact property locations
- ⭐ **Reviews & Ratings** - Users can leave reviews and rate properties
- 🖼️ **Image Upload** - Cloudinary integration for image storage and optimization
- 📱 **Responsive Design** - Modern, mobile-friendly UI
- 🔍 **Search & Filter** - Browse listings with category filters
- 💰 **Price Display** - With tax toggle functionality
- 🔒 **Authorization** - Owner-only edit/delete permissions

## 🚀 Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling

### Frontend
- **EJS** - Templating engine
- **Bootstrap 5** - CSS framework
- **Font Awesome** - Icons

### External Services
- **Mapbox** - Maps and geocoding
- **Cloudinary** - Image hosting and optimization
- **MongoDB Atlas** - Cloud database hosting

### Key Packages
- `passport` & `passport-local` - Authentication
- `express-session` - Session management
- `connect-flash` - Flash messages
- `joi` - Data validation
- `multer` - File upload handling
- `method-override` - HTTP verb support

## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js (v14 or higher)
- MongoDB Atlas account
- Mapbox account (for map functionality)
- Cloudinary account (for image uploads)

## ⚙️ Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd MAJOR PROJECT
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create a `.env` file in the root directory**
   ```env
   ATLASDB_URL=your_mongodb_connection_string
   MAP_TOKEN=your_mapbox_access_token
   CLOUD_NAME=your_cloudinary_cloud_name
   CLOUD_API_KEY=your_cloudinary_api_key
   CLOUD_API_SECRET=your_cloudinary_api_secret
   SECRET=your_session_secret
   ```

4. **Seed the database (optional)**
   ```bash
   node init/index.js
   ```

## 🏃‍♂️ Running the Application

**Development mode:**
```bash
npm start
```

The application will be available at `http://localhost:8080`

## 📁 Project Structure

```
├── controllers/         # Route controllers
│   ├── listings.js
│   ├── reviews.js
│   └── users.js
├── models/             # Database models
│   ├── listing.js
│   ├── review.js
│   └── user.js
├── routes/             # Express routes
│   ├── listing.js
│   ├── review.js
│   └── user.js
├── views/              # EJS templates
│   ├── includes/       # Partials (navbar, footer)
│   ├── layouts/        # Layout templates
│   ├── listings/       # Listing views
│   └── users/          # User views
├── public/             # Static files
│   ├── css/
│   └── js/
├── utils/              # Utility functions
├── middleware.js       # Custom middleware
├── schema.js          # Joi validation schemas
├── app.js             # Main application file
└── .env               # Environment variables
```

## 🔑 Default Login Credentials

After seeding the database, you can login with:
- **Username:** Sanjilka Saxena
- **Password:** defaultPassword123

⚠️ **Important:** Change this password after first login!

## 🌟 Key Features Explained

### User Authentication
- Secure password hashing with Passport-Local-Mongoose
- Session-based authentication
- Protected routes for authenticated users only

### Listing Management
- Full CRUD operations for property listings
- Automatic geocoding of addresses using Mapbox
- Image upload and optimization via Cloudinary
- Owner-only edit/delete permissions

### Interactive Maps
- Real-time location display using Mapbox GL JS
- Automatic coordinate generation from addresses
- Custom markers and popups

### Reviews System
- Star ratings (1-5 stars)
- Text reviews
- Author attribution
- Delete functionality for review authors

## 🐛 Known Issues & Solutions

### Map not showing location
- Ensure your Mapbox token is valid
- Check that coordinates are properly geocoded
- For more specific locations, use detailed addresses (e.g., "Seminyak, Bali, Indonesia" instead of just "Bali, Indonesia")

### Image upload issues
- Verify Cloudinary credentials in `.env`
- Check file size limits (default: 5MB)

## 🛠️ Utility Scripts

The project includes several utility scripts:

- `fixListings.js` - Fix ownership and geocoding for all listings
- `checkCoordinates.js` - Verify coordinates for listings
- `verifyAllCoordinates.js` - Detailed coordinate verification

Run any script with: `node scriptname.js`

## 📝 API Endpoints

### Listings
- `GET /listings` - View all listings
- `GET /listings/new` - Create listing form
- `POST /listings` - Create new listing
- `GET /listings/:id` - View single listing
- `GET /listings/:id/edit` - Edit listing form
- `PUT /listings/:id` - Update listing
- `DELETE /listings/:id` - Delete listing

### Reviews
- `POST /listings/:id/reviews` - Add review
- `DELETE /listings/:id/reviews/:reviewId` - Delete review

### Users
- `GET /signup` - Signup form
- `POST /signup` - Create account
- `GET /login` - Login form
- `POST /login` - Authenticate user
- `GET /logout` - Logout user

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the ISC License.

## 👤 Author

**Sanjilka Saxena**

## 🙏 Acknowledgments

- Design inspiration from Airbnb
- Mapbox for mapping services
- Cloudinary for image management
- The open-source community

---

**Made with ❤️ by Sanjilka Saxena**
