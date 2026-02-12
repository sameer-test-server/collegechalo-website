# College Chalo Website - Project Instructions

## Project Overview
A full-stack Next.js application for college discovery, comparison, and student admissions management.

## Tech Stack
- **Framework**: Next.js 14+ (React)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Frontend**: React components with TypeScript
- **Backend**: Next.js API routes
- **Database**: MongoDB (to be configured)
- **Authentication**: NextAuth.js (to be configured)

## Key Features
- College listings & search
- Student profiles & applications
- College comparison tools
- User authentication
- Admin dashboard
- Reviews & ratings

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   npm start
   ```

## Project Structure
```
src/
├── app/
│   ├── api/              # API routes
│   ├── auth/             # Authentication pages
│   ├── colleges/         # College pages
│   ├── dashboard/        # Admin dashboard
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/           # Reusable components
├── lib/                  # Utilities and helpers
├── types/                # TypeScript types
└── styles/               # Global styles
```

## Next Steps
1. Install npm dependencies after Node.js setup
2. Configure MongoDB connection
3. Set up authentication (NextAuth.js)
4. Implement core features
