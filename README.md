Soukarya Commerce: 
A Full-Stack E-Commerce Experience
Welcome to Soukarya Commerce, a high-performance MERN stack application featuring a dynamic storefront, a custom-engineered cart management system, and secure JWT-based user authentication.

Key Features:
1) Smart Storefront: Real-time product fetching from the FakeStore API.
2) Precision Cart Controls: Unique + 0 - quantity management directly on product cards.
3) Smooth UX: Motion-enhanced UI transitions using Framer Motion.
4) Secure Auth: Industry-standard password hashing with Bcrypt and session security via JWT.
5) Responsive Design: Fully optimized for mobile, tablet, and desktop using Tailwind CSS 4.0.

Technical Breakdown:

Backend (The "Engine") : 
The server is built with Node.js and Express, following the MVC (Model-View-Controller) pattern for clean separation of concerns.
1) User.js (Model): Structures user data with encrypted password fields.
2) authController.js (Controller): Handles the logic for registering new users and validating credentials during login.
3) authRoutes.js (Router): Directs incoming traffic to the appropriate logic blocks.
4) index.js (Entry Point): Orchestrates database connection, security headers, and CORS handling.

Frontend (The "Interface"):
The client is a React 19 application powered by Vite for lightning-fast development.

1) soukaryaCartManager: A centralized state logic that manages complex cart interactions (adding, incrementing, and removing) without page refreshes.
2) React Router: Handles seamless transitions between the StoreFront and the specialized CartPage.
3) Lucide Icons: Provides a clean, modern aesthetic for navigation and actions.
