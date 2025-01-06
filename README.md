# Snapgram

Snapgram is a social media platform built with **React**, **TypeScript**, and **Appwrite**. It allows users to create, share, and explore posts while providing a seamless and responsive user experience. This project showcases modern frontend development practices and integration with a robust backend service.

---

## Features

### **Authentication**
- Secure **Sign-up, Sign-in, and Sign-out** functionality using Appwrite's authentication services.
- Persistent user sessions with seamless token-based authentication.

### **Profile Management**
- Users can update:
  - Profile information (Name, Bio).
  - Profile picture.
- User data is securely stored in the backend.

### **Post Creation**
- Users can:
  - Create posts with captions, images, and optional location tags.
  - Add hashtags to categorize posts.

### **Post Interaction**
- Users can:
  - **Like posts** to show appreciation.
  - **Save posts** for later viewing in their profile's "Saved Posts" section.

### **Explore Page**
- Users can:
  - Discover posts from other users.
  - Search posts by hashtags or keywords.

### **Infinite Scroll**
- Posts load dynamically as users scroll down, enhancing the browsing experience.

### **Responsive Design**
- Optimized for both desktop and mobile devices, ensuring a smooth user experience regardless of the device used.

### **Top Creators**
- A dedicated section to display users with the most posts, fostering community engagement.

---

## Scope for Improvement

While Snapgram is a functional project showcasing essential social media features, there are areas that can be enhanced:

1. **Follow/Following System**:  
   - Allow users to follow others and see posts from people they follow in a personalized feed.

2. **Post Comments**:  
   - Enable users to comment on posts to encourage interaction.

3. **Explore Page Filters**:  
   - Add advanced filters for the Explore Page, such as filtering by location, popularity, or tags.

4. **Accessibility Enhancements**:  
   - Improve ARIA roles, keyboard navigation, and screen reader support.

---

## Tech Stack

### **Frontend**
- **React**: Component-based UI framework.
- **TypeScript**: Type-safe JavaScript for better developer experience.
- **Tailwind CSS**: Utility-first CSS framework for rapid styling.

### **Backend**
- **Appwrite**: Self-hosted backend-as-a-service (BaaS) for authentication and database management.

### **State Management**
- **React Query**: For efficient and performant server state management and API interactions.
- **Context API**: For managing global client-side state such as authentication and user data.

### **Form Handling and Validation**
- **React Hook Form**: Lightweight library for form management.
- **Zod**: Schema validation for form inputs and API responses.

### **Routing**
- **React Router**: Declarative routing for single-page applications.

---


## Project Structure

The project is organized into a clean and modular folder structure for maintainability:


- **_auth/**: Contains components and pages related to user authentication (login, sign-up, etc.).
- **_root/**: Houses the main application pages and layout components.
- **components/**: Collection of reusable UI elements to maintain consistency across the app:
  - **forms/**: Components used for handling forms (e.g., input fields, submission handlers).
  - **shared/**: Shared components like headers, footers, or common layout elements.
  - **ui/**: Basic UI elements like buttons, inputs, modals, etc.
- **context/**: Contains React context files for managing global application state, such as authentication.
- **hooks/**: Custom React hooks for reusable logic throughout the application.
- **lib/**: Contains libraries and configurations:
  - **appwrite/**: Appwrite API services and backend configurations.
  - **react-query/**: React Query hooks and configurations for efficient state management.
- **types/**: TypeScript type definitions for improved code safety and readability.
- **globals.css**: Global CSS styles for the application.
- **main.tsx**: Entry point of the application where the app is bootstrapped.
- **App.tsx**: The main App component that defines the application structure and routes.

---

This structured breakdown ensures clarity for contributors, maintainers, and potential employers reviewing the codebase.


This structure ensures the application remains scalable and easy to navigate, with clear separation of concerns.

---


## Demonstration

A demonstration of Snapgram is available:  
**[Snapgram Demo Video](https://github.com/Pulkito4/Snapgram_JSM/blob/main/Snapgram_JSM%20demo%20video.mp4)**  

---

## Acknowledgements

This project was inspired by the tutorials from **JavaScript Mastery** youtube channel, which provided valuable guidance for building full-stack web applications.  

---

*Snapgram is a project for learning and demonstration purposes. Features like Follow/Following, Post Comments, and Explore Page Filters are not yet implemented.*
