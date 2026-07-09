# ShopePrinters - Next.js Full Stack Application

Welcome to ShopePrinters - a modern, production-ready Next.js application for printer supplies and setup support.

## 🚀 Features

- **Complete E-commerce Platform** - Browse, search, and purchase printer supplies
- **Admin Dashboard** - Manage products, categories, orders, customers, and analytics
- **User Authentication** - Secure registration, login, and profile management with JWT
- **Order Management** - Create, track, and manage orders
- **Real-time Chat** - Support chat system for customer assistance
- **Return Management** - Handle product returns and refunds
- **Printer Setup Guides** - Interactive setup guides for various printer models
- **Email Notifications** - Automated email for registrations, orders, and support
- **Image Management** - Cloudinary integration for product images
- **Responsive Design** - Mobile-first design with Tailwind CSS
- **SEO Optimized** - Next.js server-side rendering for better SEO

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB Atlas account
- Cloudinary account
- Brevo (SendinBlue) account for emails

## 🔧 Installation

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/shopesprinters-next.git
cd shopesprinters-next
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/shopesprinters
JWT_SECRET=your-secret-key-here
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
EMAIL_HOST=smtp-relay.brevo.com
EMAIL_PORT=587
EMAIL_USER=your-email@brevo.com
EMAIL_PASS=your-brevo-key
EMAIL_FROM=noreply@shopesprinters.com
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_CLOVER_PUBLIC_KEY=your-clover-key
```

### 4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Build & Deploy

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run start
```

### Deploy to Vercel
```bash
# Push to GitHub and import in Vercel dashboard
# Environment variables will be set in Vercel dashboard
vercel deploy --prod
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (public)/          # Public routes
│   ├── admin/             # Admin dashboard
│   ├── setup/             # Setup guides
│   ├── api/               # API routes
│   └── layout.tsx         # Root layout
├── components/            # Reusable React components
├── models/               # MongoDB/Mongoose schemas
├── lib/                  # Utility libraries
│   ├── db.ts             # Database connection
│   ├── jwt.ts            # JWT utilities
│   ├── api.ts            # API helpers
│   ├── email.ts          # Email service
│   ├── cloudinary.ts     # Image upload
│   └── response.ts       # Response utilities
├── hooks/                # Custom React hooks
├── middleware/           # Request middleware
├── services/             # Business logic
├── utils/                # Helper functions
├── contexts/             # React contexts
└── styles/              # Global CSS
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth` - Register, Login, Send OTP, Verify OTP
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/cart` - Save cart
- `GET /api/auth/users` - Get all users (Admin)
- `DELETE /api/auth/users/:id` - Delete user (Admin)

### Products
- `GET /api/products` - List products
- `POST /api/products` - Create product (Admin)
- `GET /api/products/:id` - Get product details
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Categories
- `GET /api/categories` - List categories
- `POST /api/categories` - Create category (Admin)
- `GET /api/categories/:id` - Get category
- `PUT /api/categories/:id` - Update category (Admin)
- `DELETE /api/categories/:id` - Delete category (Admin)

### Orders
- `GET /api/orders` - List user orders
- `POST /api/orders` - Create order
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id` - Update order (Admin)

### Additional Endpoints
- `POST /api/contact` - Submit contact form
- `GET /api/chats` - Get chat messages
- `POST /api/chats` - Send message
- `GET /api/returns` - Get return requests
- `POST /api/returns` - Create return request
- `GET /api/dashboard/analytics` - Get analytics (Admin)
- `POST /api/shipping/rates` - Get shipping rates

## 🎨 Styling

This project uses **Tailwind CSS** for styling. Custom colors:

- **Primary:** `#024AD8` (Blue)
- **Accent:** `#ff2d46` (Red)
- **Dark:** `#1a1a1a` (Black)

## 🔒 Security Features

- ✅ JWT Authentication with httpOnly cookies
- ✅ Password hashing with bcryptjs
- ✅ CSRF protection
- ✅ Input validation and sanitization
- ✅ Admin role-based access control
- ✅ Secure headers
- ✅ Environment variable protection

## 📊 Database

Using MongoDB with Mongoose. Models included:

- **User** - User accounts and authentication
- **Product** - Product catalog
- **Category** - Product categories
- **Order** - Customer orders
- **Chat** - Support messages
- **ContactInquiry** - Contact form submissions
- **ReturnRequest** - Product returns
- **OTP** - One-time passwords
- **Registration** - Setup registrations
- **SetupSetting** - Configuration

## 📧 Email Integration

Configured with Brevo (SendinBlue) for:

- Registration confirmations
- Order confirmations
- Password reset links
- Contact form replies
- Support notifications

## 🖼️ Image Management

Integrated with Cloudinary for:

- Product image uploads
- Automatic image optimization
- CDN delivery
- Image resizing and transformation

## 🧪 Testing

Run tests:
```bash
npm test
```

## 📝 Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret for JWT signing | `your-secret-key` |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `my-cloud` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `your-api-key` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `your-secret` |
| `EMAIL_HOST` | SMTP server | `smtp-relay.brevo.com` |
| `EMAIL_PORT` | SMTP port | `587` |
| `EMAIL_USER` | SMTP username | `your-email` |
| `EMAIL_PASS` | SMTP password | `your-password` |
| `EMAIL_FROM` | From email address | `noreply@example.com` |
| `NEXT_PUBLIC_SITE_URL` | Site URL | `https://example.com` |
| `NEXT_PUBLIC_CLOVER_PUBLIC_KEY` | Clover payment key | `your-key` |

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 📞 Support

For support, contact:
- Email: support@shopesprinters.com
- Chat: Available on the website

## 🎉 Acknowledgments

Built with:
- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [MongoDB](https://www.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Cloudinary](https://cloudinary.com/)
- [Vercel](https://vercel.com/)

---

**Version:** 1.0.0
**Last Updated:** 2024
**Status:** Production Ready ✅
