# SmartFlowPM Frontend

A modern, responsive frontend application built with Next.js, TypeScript, and Tailwind CSS for the SmartFlowPM project management system.

## 🚀 Features

- **Modern Tech Stack**: Next.js 14 with App Router, React 18, TypeScript
- **Beautiful UI**: Custom design system with Tailwind CSS and Framer Motion animations
- **Authentication**: JWT-based authentication with automatic token refresh
- **Responsive Design**: Mobile-first approach with custom responsive layouts
- **Type Safety**: Full TypeScript implementation with API type definitions
- **Performance**: Optimized with Next.js features like image optimization and code splitting

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5.5
- **Styling**: Tailwind CSS 3.4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation
- **HTTP Client**: Axios
- **Charts**: Recharts
- **Date Handling**: date-fns

## 📦 Installation

1. **Clone the repository** (if not already done):
   ```bash
   git clone <repository-url>
   cd GenAI.SmartFlowPM/src/Web/GenAI.SmartFlowPM.UI
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment setup**:
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and configure your API URL:
   ```env
   NEXT_PUBLIC_API_URL=https://localhost:7001/api
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Dashboard page
│   ├── login/            # Login page
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/            # Reusable UI components
│   ├── auth/             # Authentication components
│   └── dashboard/        # Dashboard components
├── hooks/                # Custom React hooks
│   ├── useAuth.tsx       # Authentication hook
│   └── useApiWithToast.ts # API operations with toast notifications
├── lib/                  # Utility libraries
│   ├── base-api.service.ts # 🆕 Foundation API service with JWT management
│   ├── cookieManager.ts   # Enhanced token management
│   └── utils.ts          # Utility functions
├── services/             # 🆕 Modular API Services (NEW - Aug 13, 2025)
│   ├── auth.service.ts   # Authentication operations
│   ├── user.service.ts   # User management
│   ├── project.service.ts # Project lifecycle
│   ├── task.service.ts   # Task management
│   ├── dashboard.service.ts # Dashboard data
│   └── index.ts          # Service exports
├── styles/              # Global styles
│   └── globals.css      # Global CSS with Tailwind
└── types/               # TypeScript type definitions
    └── api.types.ts     # API response types
```

## 🎨 Design System

### Colors
- **Primary**: Sky blue (#0ea5e9) - Main brand color
- **Secondary**: Slate gray (#64748b) - Text and borders
- **Accent**: Green (#10b981) - Success states
- **Error**: Red (#ef4444) - Error states

### Typography
- **Font Family**: Inter (Google Fonts)
- **Font Sizes**: Tailwind CSS scale (text-sm, text-base, text-lg, etc.)

### Components
- Custom button styles with hover and focus states
- Form inputs with consistent styling
- Cards and panels with subtle shadows
- Responsive navigation and layout components

## 🔗 API Integration

> **🆕 Architecture Update (August 13, 2025)**: The frontend API layer has been completely refactored from a monolithic `api.ts` file to a modular service-based architecture. See the main project documentation for details.

The frontend integrates with the .NET backend API using:

- **Base URL**: Configured via `NEXT_PUBLIC_API_URL` environment variable
- **🆕 Modular Services**: Domain-specific services (auth, user, project, task, dashboard) extending BaseApiService
- **🆕 Automatic JWT Management**: All API calls automatically include Bearer tokens via BaseApiService
- **Authentication**: JWT tokens with dual storage (localStorage/cookies) based on environment
- **Token Refresh**: Automatic token refresh with proper error handling (handled by BaseApiService interceptors)
- **401 Error Handling**: Graceful session expiration with toast notifications
- **Multi-tenancy**: Tenant ID sent in headers for all requests (automatic)
- **Type Safety**: Complete TypeScript interfaces matching backend DTOs

### API Service Usage
```typescript
// Import services as needed
import { authService, userService, dashboardService } from '../services';

// All services automatically include JWT tokens
const dashboard = await dashboardService.getHomeDashboard();
const users = await userService.getUsers();
await authService.logout();
```

### API Endpoints Used
- `POST /auth/login` - User authentication
- `POST /auth/refresh` - Token refresh (returns new access token only)
- `GET /auth/me` - Get current user
- `GET /dashboard/stats` - Dashboard statistics
- `GET /users` - User management
- `GET /projects` - Project data
- `GET /tasks` - Task management

## 🔐 Authentication Flow

1. User enters credentials on login page with optional "Remember Me"
2. Frontend sends login request to backend API
3. Backend returns JWT access token, refresh token, and user data
4. Tokens stored using enhanced token manager (cookies for production, localStorage for development)
5. Access token included in all subsequent API requests
6. Automatic token refresh 5 minutes before expiration
7. Toast notifications for authentication errors (session expired, network issues)
8. Graceful logout with proper token cleanup on refresh failure

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

Key responsive features:
- Collapsible sidebar navigation
- Adaptive card layouts
- Mobile-optimized forms
- Touch-friendly interactive elements

## 🚀 Development

### Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Linting
npm run lint

# Type checking
npm run type-check
```

### Code Style

- **ESLint**: Configured with Next.js rules
- **TypeScript**: Strict mode enabled
- **Prettier**: Code formatting (configure as needed)
- **File naming**: kebab-case for files, PascalCase for components

### Adding New Features

1. **Components**: Create in `src/components/` with TypeScript
2. **Pages**: Add to `src/app/` following App Router conventions
3. **API Integration**: Add endpoints to `src/lib/api.ts`
4. **Types**: Define in `src/types/api.types.ts`
5. **Styles**: Use Tailwind classes, add custom CSS to `globals.css` if needed

## 🔧 Configuration

### Tailwind CSS
Custom configuration in `tailwind.config.js`:
- Custom color palette
- Extended spacing and sizing
- Custom animations
- Component-specific utilities

### Next.js
Configuration in `next.config.js`:
- TypeScript optimization
- Build optimizations
- Environment variable handling

### TypeScript
Configuration in `tsconfig.json`:
- Strict type checking
- Path aliases for clean imports
- Next.js optimizations

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Variables
Ensure these are set in production:
```env
NEXT_PUBLIC_API_URL=https://your-production-api.com/api
NODE_ENV=production
```

### Docker (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Follow the existing code style and patterns
2. Add TypeScript types for all new features
3. Test responsive design on multiple screen sizes
4. Ensure accessibility standards are met
5. Add documentation for new components

## 📝 Notes

- The application uses JWT tokens for authentication
- All API calls include automatic error handling
- The design system is consistent with the backend architecture
- Multi-tenant support is built into the API client
- The application is optimized for performance and SEO

For backend API documentation, see the main project README.
