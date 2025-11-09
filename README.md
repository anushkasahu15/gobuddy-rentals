# GoBuddy Project

Project Summary:

Developed a full-stack web application named "GoBuddy," a feature-rich platform designed to facilitate the browsing and booking of vacation accommodations, including houses, villas, and farmhouses. This platform allows users to add their own properties to the listing, providing a diverse range of options for potential renters. Key features include a seamless booking system that simplifies the reservation process, integrated chatbot support for instant user assistance, and fast login options through Google OAuth and GitHub OAuth. The application also boasts a dynamic server for responsive performance and an intuitive, aesthetically pleasing user interface, ensuring an engaging and efficient user experience.

Front-end:
1. Developed a responsive web application using modern HTML, CSS, and JavaScript.
2. Implemented a user-friendly interface for searching and listing properties.
3. Utilized frameworks such as React.js for building dynamic and interactive user experiences.
4. Integrated AI Chat Assistent where you ask any question and you will get answer in the top of Navbar.
5. Working contact form that actually connect the clients to the house owner.

Back-end:
1. Built a RESTful API using Node.js and Express.js to handle user interactions.
2. Implemented user authentication and authorization using technologies like JWT (JSON Web Tokens).
3. For making ease for user i have also used Google & Github authetication for fasting registration
4. Created endpoints for property listing, login/sign up and user management.
5. AI Chat Assistent where you ask any question and you will get answer.

Database:
1. Utilized a relational database management system MongoDB for storing property and user data.
2. Designed a well-structured database schema for efficient data management.
3. Employed database queries to retrieve and store property and user information.

Additional Features:
1. Implemented a search and filter system for property listings.
2. Included features for user reviews, ratings, and messaging between users.
3. Ensured security and data privacy through encryption and data validation.
4. Deployed the web application on a cloud platform on Cloudinary to make it accessible online.
5. Google Authentication for fast login or sign-up for a user.
6. Github Authentication for fast login or sign-up for a user.

This GoBuddy project showcases my proficiency in full-stack web development, from creating an engaging front-end to managing the back-end and database components. It allows users to search for properties and experience the key functionalities of the Airbnb platform in a seamless and secure manner.

## 🚀 Getting Started

### Prerequisites

- Node.js (v20.12.1 or higher) - [Download Node.js](https://nodejs.org/)
- MongoDB Atlas account (or local MongoDB instance)
- Cloudinary account (for image storage)
- Google OAuth credentials (optional, for Google login)
- GitHub OAuth credentials (optional, for GitHub login)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd WanderLust-Holidays-Rental-Homes
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create a `.env` file** in the root directory with the following environment variables:
   ```env
   # MongoDB Connection
   DATABASE_URI=your_mongodb_connection_string

   # Session Secret (generate a random string)
   SECRET=your_secret_key_here

   # Cloudinary Configuration
   CLOUD_NAME=your_cloudinary_cloud_name
   CLOUD_API_KEY=your_cloudinary_api_key
   CLOUD_API_SECRET=your_cloudinary_api_secret

   # Google OAuth (Optional)
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_CALLBACK_URL=http://localhost:8080/auth/google/callback

   # GitHub OAuth (Optional)
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   GITHUB_CALLBACK_URL=http://localhost:8080/auth/github/callback
   ```

4. **Run the application**
   
   Using Node.js directly:
   ```bash
   node app.js
   ```
   
   Or using nodemon (auto-restart on file changes):
   ```bash
   npx nodemon app.js
   ```

5. **Open your browser**
   - Navigate to `http://localhost:8080`
   - The application should be running!




