# Frontend Architecture Document

## 1. Purpose
This document defines the architectural criteria for choosing between Vite + React and Next.js for frontend development, along with the recommended folder structure, state management approach, and service layer organization.

## 2. Architectural Decision
The selection between Vite and Next.js should be based on the application requirements:
- Use Vite + React for client-rendered applications, rapid prototyping, and interactive dashboards.
- Use Next.js when the project requires server rendering, SEO, routing flexibility, or full-stack capabilities.

## 3. Vite + React
### 3.1 When to use it
Vite is recommended for:
- Single-page applications (SPAs)
- Internal tools and dashboards
- Rapid development cycles
- Projects where SEO is not a primary requirement
- Applications relying heavily on client-side interactions

### 3.2 Recommended characteristics
- Client-side rendering (CSR)
- Fast build and development experience
- Lightweight configuration
- Suitable for highly interactive user interfaces

### 3.3 Suggested folder structure
```txt
src/
  components/
  features/
  hooks/
  services/
  store/
  types/
  utils/
  App.tsx
  main.tsx
```

## 4. Next.js
### 4.1 When to use it
Next.js is recommended for:
- Marketing sites and public web applications
- Applications that require SEO and discoverability
- Server-side rendering (SSR) or static generation (SSG)
- Full-stack applications with API routes
- Projects that need strong production architecture and scalability

### 4.2 Recommended characteristics
- Server components and app-router architecture
- Better support for SEO and performance
- Flexible routing and data fetching strategies
- Strong fit for production-grade applications

### 4.3 Suggested folder structure
```txt
app/
  components/
  features/
  lib/
  services/
  types/
  globals.css
  layout.tsx
  page.tsx
```

## 5. State Management Strategy
### 5.1 Vite + React
Recommended approach:
- Local UI state with useState and useReducer
- Global state with Zustand or Redux Toolkit
- Remote state with TanStack Query / React Query

### 5.2 Next.js
Recommended approach:
- Use server components for server-side data fetching
- Keep local UI state in client components
- Use global state only for authentication, theme, or user preferences
- Prefer server state over client state when possible

## 6. API Service Layer
All network communication should be centralized in dedicated service modules.

### 6.1 Recommended pattern
```ts
// services/api.ts
export const api = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
};
```

```ts
// services/user.service.ts
export async function getUsers() {
  const response = await fetch(`${api.baseURL}/users`);
  if (!response.ok) throw new Error('Failed to fetch users');
  return response.json();
}
```

### 6.2 Principles
- Keep API calls isolated from UI components
- Use typed responses and error handling
- Centralize environment variables and base URLs
- Separate business logic from presentation logic

## 7. Practical Rules
- Choose Vite for interactive, fast, front-end-heavy applications.
- Choose Next.js for SEO-sensitive, content-driven, or production-scale applications.
- If the project may grow into a platform with both public and private areas, Next.js is usually the better long-term choice.

## 8. Final Recommendation
For learning, dashboards, and rapid client-side development, Vite + React is an excellent choice. For scalable products, content-driven sites, and applications where performance and SEO matter, Next.js is the stronger architectural option.
