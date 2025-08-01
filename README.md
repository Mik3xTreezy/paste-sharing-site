# PasteShare - Code & Text Sharing Platform

A modern, fast, and secure platform for sharing code snippets, text, and pastes with beautiful syntax highlighting and user authentication.

## ✨ Features

- **🔐 User Authentication** - Sign up, sign in, and manage your account
- **📝 Create Pastes** - Share code with syntax highlighting and custom titles
- **🔗 Short URLs** - 5-character unique IDs for easy sharing
- **👤 My Pastes** - View and manage all your created pastes
- **🌐 Public Browse** - Discover and explore public pastes
- **🎨 Modern UI** - Beautiful, responsive design with dark/light themes
- **⚡ Fast & Secure** - Built with Next.js 15 and TypeScript

## 🚀 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Database**: SQLite (development), PostgreSQL (production)
- **Authentication**: NextAuth.js
- **ORM**: Prisma
- **Deployment**: Vercel

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/paste-sharing-site.git
   cd paste-sharing-site
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Add your environment variables:
   ```env
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here
   DATABASE_URL=file:./dev.db
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🌐 Deployment

### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your repository
   - Add environment variables in Vercel dashboard

3. **Environment Variables for Production**
   ```
   NEXTAUTH_URL=https://your-domain.vercel.app
   NEXTAUTH_SECRET=your-production-secret
   DATABASE_URL=your-production-database-url
   ```

## 📁 Project Structure

```
paste-sharing-site/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── browse/            # Browse pastes page
│   ├── my-pastes/         # User's pastes page
│   ├── paste/             # Individual paste pages
│   └── globals.css        # Global styles
├── components/            # Reusable components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions
├── prisma/                # Database schema
└── public/                # Static assets
```

## 🔧 API Endpoints

- `POST /api/pastes` - Create a new paste
- `GET /api/pastes` - Get all public pastes
- `GET /api/pastes/[id]` - Get a specific paste
- `PUT /api/pastes/[id]` - Update a paste
- `DELETE /api/pastes/[id]` - Delete a paste
- `POST /api/auth/signup` - User registration
- `POST /api/auth/[...nextauth]` - NextAuth.js endpoints

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [shadcn/ui](https://ui.shadcn.com/) for beautiful components
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Prisma](https://prisma.io/) for database management
- [NextAuth.js](https://next-auth.js.org/) for authentication # Trigger new deployment
