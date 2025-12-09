# FURSAT Nexus - Project Structure

## 📁 Directory Structure

```
fursat-nexus/
├── public/                    # Static assets
│   ├── favicon.ico
│   ├── placeholder.svg
│   └── robots.txt
│
├── src/                       # Source code
│   ├── components/           # React components
│   │   ├── layout/           # Layout components
│   │   │   ├── Layout.tsx    # Main layout wrapper
│   │   │   ├── Navbar.tsx    # Top navigation bar
│   │   │   └── MobileNav.tsx # Mobile bottom navigation
│   │   ├── ui/               # shadcn/ui components (50+ files)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── ... (all shadcn components)
│   │   └── NavLink.tsx       # Navigation link component
│   │
│   ├── pages/                # Page components (routes)
│   │   ├── Landing.tsx       # Landing/login page
│   │   ├── Feed.tsx          # Main feed page
│   │   ├── Circles.tsx       # Communities/circles page
│   │   ├── Opportunities.tsx # Job/internship opportunities
│   │   ├── Profile.tsx       # User profile page
│   │   ├── Messages.tsx      # Messaging/chat page
│   │   ├── Create.tsx        # Create post/content page
│   │   ├── Auth.tsx          # Authentication page
│   │   ├── NotFound.tsx      # 404 error page
│   │   └── Index.tsx         # Index/redirect page
│   │
│   ├── hooks/                # Custom React hooks
│   │   ├── use-mobile.tsx    # Mobile detection hook
│   │   └── use-toast.ts      # Toast notification hook
│   │
│   ├── lib/                  # Utility libraries
│   │   └── utils.ts          # Utility functions (cn helper)
│   │
│   ├── App.tsx               # Main app component (routing)
│   ├── main.tsx              # Entry point
│   ├── index.css             # Global styles & design tokens
│   └── vite-env.d.ts         # Vite type definitions
│
├── .gitignore
├── components.json           # shadcn/ui configuration
├── eslint.config.js         # ESLint configuration
├── index.html               # HTML template
├── package.json             # Dependencies & scripts
├── postcss.config.js        # PostCSS configuration
├── README.md                # Project documentation
├── tailwind.config.ts       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
├── tsconfig.app.json        # App-specific TS config
├── tsconfig.node.json       # Node-specific TS config
└── vite.config.ts           # Vite build configuration
```

---

## 🏗️ Architecture Overview

### **Tech Stack**
- **Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 7.2.6
- **Routing**: React Router DOM 6.30.1
- **Styling**: Tailwind CSS 3.4.17
- **UI Components**: shadcn/ui (Radix UI primitives)
- **State Management**: TanStack Query (React Query) 5.83.0
- **Forms**: React Hook Form 7.61.1 + Zod 3.25.76
- **Backend**: Supabase 2.86.0 (configured but not fully integrated)
- **Icons**: Lucide React 0.462.0

### **Design System**
- **Theme**: Brutalist design with sharp edges, bold borders
- **Colors**: HSL-based color system with CSS variables
- **Typography**: Space Grotesk (sans), Space Mono (mono)
- **Shadows**: Hard-edged shadows (no blur)
- **Border Radius**: 0rem (sharp corners)

---

## 📄 Key Files Explained

### **Entry Point**
- **`src/main.tsx`**: React app initialization, renders `<App />` to DOM
- **`index.html`**: HTML template with root div

### **App Configuration**
- **`src/App.tsx`**: 
  - Sets up React Router with all routes
  - Configures QueryClient for data fetching
  - Wraps app with TooltipProvider, Toaster components
  - Defines route structure:
    ```
    / → Landing (login-first page)
    /feed → Feed (main social feed)
    /circles → Circles (communities)
    /opportunities → Opportunities (jobs/internships)
    /profile → Profile (user profile)
    /messages → Messages (chat)
    /create → Create (post creation)
    /auth → Auth (authentication)
    * → NotFound (404)
    ```

### **Pages** (`src/pages/`)

#### **Landing.tsx**
- Login-first landing page
- Split-screen layout: content + login form
- Features: Live bulletin, feature showcase, stats
- Brutalist design with hard borders

#### **Feed.tsx**
- Main social feed page
- Three-column layout (desktop):
  - Left: Campus pulse, trending tags, broadcast
  - Center: Stories, create post, daily brief, feed posts
  - Right: Upcoming events, opportunities, XP leaderboard
- Filter system: "For you", "Club drops", "Opportunities", etc.
- Post interactions: Like, comment, share, save

#### **Circles.tsx**
- Community/circle browsing and management
- Topic-based communities

#### **Opportunities.tsx**
- Job/internship listings
- Verified opportunities board

#### **Profile.tsx**
- User profile page
- XP, badges, activity

#### **Messages.tsx**
- Direct messaging interface

#### **Create.tsx**
- Content creation (posts, stories, etc.)

#### **Auth.tsx**
- Authentication (login/signup)

### **Components** (`src/components/`)

#### **Layout Components** (`layout/`)
- **Layout.tsx**: Wrapper component that includes Navbar and MobileNav
- **Navbar.tsx**: Top navigation bar with logo, nav items, notifications
- **MobileNav.tsx**: Bottom navigation for mobile devices

#### **UI Components** (`ui/`)
50+ shadcn/ui components built on Radix UI:
- **Form components**: Button, Input, Textarea, Select, Checkbox, Radio, Switch
- **Layout**: Card, Separator, Scroll Area, Resizable Panels
- **Overlays**: Dialog, Popover, Tooltip, Hover Card, Sheet, Drawer
- **Navigation**: Navigation Menu, Menubar, Breadcrumb, Tabs
- **Data Display**: Table, Badge, Avatar, Skeleton, Progress
- **Feedback**: Toast, Sonner, Alert, Alert Dialog
- **Other**: Accordion, Calendar, Carousel, Chart, Command, etc.

### **Styling** (`src/index.css`)
- CSS variables for design tokens (colors, shadows, spacing)
- Tailwind directives
- Google Fonts imports (Space Grotesk, Space Mono)
- Dark mode support via CSS variables

### **Configuration Files**

#### **`vite.config.ts`**
- Vite build configuration
- React SWC plugin for fast compilation
- Path alias: `@` → `./src`
- Dev server: port 8080, host `::`

#### **`tailwind.config.ts`**
- Tailwind CSS configuration
- Custom color system (HSL variables)
- Custom shadows (hard-edged)
- Font families (Space Grotesk, Space Mono)
- Border radius: 0 (brutalist)

#### **`package.json`**
- **Scripts**:
  - `dev`: Start dev server
  - `build`: Production build
  - `build:dev`: Development build
  - `lint`: Run ESLint
  - `preview`: Preview production build

- **Key Dependencies**:
  - React ecosystem (react, react-dom, react-router-dom)
  - UI (Radix UI, shadcn/ui components)
  - Forms (react-hook-form, zod, @hookform/resolvers)
  - Data fetching (@tanstack/react-query)
  - Backend (@supabase/supabase-js)
  - Styling (tailwindcss, tailwindcss-animate)
  - Utilities (clsx, tailwind-merge, date-fns)

---

## 🎨 Design System

### **Color Palette** (HSL)
- **Background**: `60 100% 97%` (light cream)
- **Foreground**: `0 0% 0%` (black)
- **Primary**: `0 0% 0%` (black)
- **Secondary**: `45 100% 60%` (yellow)
- **Accent**: `330 100% 71%` (pink/magenta)
- **Muted**: `45 30% 90%` (light yellow)
- **Success**: `142 76% 45%` (green)
- **Warning**: `38 92% 50%` (orange)
- **Info**: `199 89% 48%` (blue)
- **Destructive**: `0 84% 60%` (red)

### **Typography**
- **Sans**: Space Grotesk (headings, body)
- **Mono**: Space Mono (labels, code, badges)

### **Shadows**
Hard-edged shadows (no blur):
- `shadow-xs`: `2px 2px 0px`
- `shadow-sm`: `3px 3px 0px`
- `shadow-md`: `6px 6px 0px`
- `shadow-lg`: `8px 8px 0px`
- `shadow-xl`: `12px 12px 0px`

### **Borders**
- Default: `2px solid` (thick borders)
- Dashed: `2px dashed` (for secondary elements)
- Border radius: `0rem` (sharp corners)

---

## 🔄 Data Flow

1. **Routing**: React Router handles navigation
2. **State**: 
   - Local state: `useState` hooks
   - Server state: TanStack Query (when backend integrated)
   - Form state: React Hook Form
3. **Styling**: Tailwind CSS classes + CSS variables
4. **Components**: Composition pattern with shadcn/ui primitives

---

## 🚀 Development Workflow

1. **Start dev server**: `npm run dev` (port 8080)
2. **Build**: `npm run build`
3. **Lint**: `npm run lint`
4. **Preview**: `npm run preview`

---

## 📝 Component Patterns

### **Page Components**
- Use `<Layout>` wrapper for authenticated pages
- Standalone components for Landing/Auth pages
- Consistent brutalist styling with borders and shadows

### **UI Components**
- Built on Radix UI primitives
- Accessible by default
- Styled with Tailwind CSS
- Use `cn()` utility for conditional classes

### **Layout Pattern**
```tsx
<Layout>
  <div className="max-w-[1400px] mx-auto px-4 py-6">
    {/* Page content */}
  </div>
</Layout>
```

---

## 🔌 Integration Points

- **Supabase**: Configured but not fully integrated (auth, database)
- **React Query**: Ready for API integration
- **React Hook Form + Zod**: Form validation ready

---

## 📦 Build Output

- **Output directory**: `dist/` (Vite default)
- **Assets**: Optimized and hashed
- **Code splitting**: Automatic via Vite

---

## 🎯 Key Features

1. **Brutalist Design**: Sharp edges, bold borders, hard shadows
2. **Responsive**: Mobile-first with breakpoints
3. **Accessible**: Radix UI components
4. **Type-Safe**: Full TypeScript coverage
5. **Modern Stack**: React 18, Vite, Tailwind CSS
6. **Component Library**: shadcn/ui for consistent UI

---

## 🔮 Future Enhancements

- Backend integration (Supabase)
- Authentication flow
- Real-time data fetching
- Image uploads
- Notifications system
- Search functionality
- Dark mode toggle (CSS variables ready)

