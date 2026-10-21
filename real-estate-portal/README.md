# Real Estate Property Listing Portal

A simple full-stack project (Smart Online Property Marketplace).

| Part      | Technology                                   |
|-----------|----------------------------------------------|
| Front end | React.js (Vite), React Router, plain CSS     |
| Back end  | Node.js, Express.js                          |
| Database  | MongoDB (Mongoose)                           |
| Security  | JWT login, bcrypt password hashing, role based access |
| Maps      | Google Maps embed (no API key needed)        |

## Features
- Search properties by city, buy/rent, type, price and bedrooms; sort and page the results
- Property details page with photo, amenities, map and "Contact Owner" form
- Register / login for buyers, sellers (owners/agents) and the admin
- Sellers post, list and delete properties and reply to inquiries
- Buyers save favourites and track their inquiries
- Admin panel to approve or reject new listings
- Responsive layout (mobile, tablet, desktop)

## Folder structure
```
real-estate-portal/
├── client/                     React front end
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js          dev server + proxy to the API
│   └── src/
│       ├── main.jsx            entry point
│       ├── App.jsx             routes
│       ├── api/api.js          fetch helper + price format
│       ├── context/AuthContext.jsx   login state + favourites
│       ├── components/         Navbar, SearchBar, PropertyCard, ProtectedRoute
│       ├── pages/              Home, PropertyDetails, Login, Register,
│       │                       PostProperty, MyListings, Favourites, AdminPanel
│       └── styles/main.css
└── server/                     Express back end
    ├── package.json
    ├── .env.example
    ├── server.js               app entry point
    ├── seed.js                 demo data
    ├── config/db.js            MongoDB connection
    ├── models/                 User, Property, Inquiry
    ├── middleware/             auth (JWT + roles), asyncHandler
    └── routes/                 auth, properties, favourites, inquiries, admin
```

## How to run in VS Code

### 1. Install the tools (one time)
- Node.js 18 or newer: https://nodejs.org
- MongoDB Community Server (running on the default port 27017): https://www.mongodb.com/try/download/community  
  (or create a free MongoDB Atlas database and paste its connection string into `MONGO_URI`)

### 2. Start the back end
Open a terminal in VS Code (`Ctrl + ~`):
```bash
cd server
npm install
copy .env.example .env        # Windows   (on Mac/Linux:  cp .env.example .env)
npm run seed                  # creates demo users and properties
npm run dev                   # starts http://localhost:5000
```

### 3. Start the front end
Open a second terminal:
```bash
cd client
npm install
npm run dev                   # starts http://localhost:5173
```
Open **http://localhost:5173** in the browser.

### Demo logins (created by `npm run seed`)
| Role   | Email                    | Password    |
|--------|--------------------------|-------------|
| Admin  | admin@realestate.com     | admin123    |
| Seller | seller@realestate.com    | password123 |
| Buyer  | buyer@realestate.com     | password123 |

The seed also adds one *pending* listing so that you can try the admin approval.

## API summary
| Method | URL | Who | Purpose |
|--------|-----|-----|---------|
| POST | /api/auth/register, /api/auth/login | everyone | sign up / sign in |
| GET | /api/properties | everyone | search approved listings (query: city, listingType, propertyType, maxPrice, beds, sort, page) |
| GET | /api/properties/:id | everyone | property details |
| GET | /api/properties/mine | seller, admin | my listings |
| POST / PUT / DELETE | /api/properties | seller, admin | post, edit, delete a listing |
| GET / POST | /api/favourites | logged in | saved properties (POST /:id toggles) |
| POST | /api/inquiries | logged in | send an inquiry |
| GET | /api/inquiries/sent, /received | logged in / seller | track inquiries |
| PUT | /api/inquiries/:id/reply | seller | reply to an inquiry |
| GET / PUT | /api/admin/stats, /pending, /properties/:id/status | admin | approve or reject listings |

## Notes
- Property photos are added with an **Image URL** to keep the project simple. Image upload with cloud storage can be added later.
- Change `JWT_SECRET` in `server/.env` before using the project anywhere other than your own computer.
