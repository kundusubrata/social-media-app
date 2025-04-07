
# Social Media Application

This is a full-stack social media platform built using React, Node.js, Express, TypeScript, Prisma, and PostgreSQL. Users can create posts with optional media, interact with others through likes, dislikes, and comments, and manage their own profiles. The app also includes features like following/unfollowing users and viewing their profiles and posts.

API requests are handled using Axios and SWR. React Router is used for navigation, and the UI is styled with Tailwind CSS and Radix UI Primitives.

## Table of Contents
- [Social Media Application](#social-media-application)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Demonstration](#demonstration)
  - [Technologies](#technologies)
  - [Setup](#setup)
  - [Contacts](#contacts)
  - [Contributing](#contributing)

## Features

-   **Authentication** 
    -   Users can register, log in, and log out.
    -   JWT is used for authentication, with tokens stored in localStorage.
-   **Post Management**
    -   Create and delete your own posts.
    -   View posts from people you follow or discover others in the feed.
-   **Media Uploads**
    -   Users can upload images to posts using Cloudinary.
-   **Explore Feed**
    -   Discover posts from all users, not just the ones you follow.
-   **User Profiles**
    -   View any user's profile with their info and posts.
    -   Follow or unfollow other users.
-   **Engagement**
    -   Like or dislike posts.
    -   Add comments to posts.
-   **Profile Settings**
    -   Update your profile details.
    -   Delete your account if needed.
-   **Responsive Design**
    -   Fully responsive and works well on all screen sizes.

## Demonstration
![Social Media Homepage](/client/public/social-media-home.png)
![Social Media userprofile](/client/public/social-media-user-profile.png)
![Social Media myprofile](/client/public/social-media-myprofile.png)

## Technologies
-   Frontend: React, Vite, TailwindCSS, Radix UI Primitives, React Router
-   Backend: Node.js, Express, Prisma, PostgreSQL
-   API Management: Axios, SWR
-   Authentication: JWT

## Setup

1. Clone the Repository

	```bash
	git clone https://github.com/kundusubrata/social-media-app.git
	cd social-media-app
	```
2. Install Dependencies
	```bash
	# Install client dependencies
	cd client && pnpm install
	# (optional) Build client side code for update
	pnpm run build 
	# Install server dependencies
	cd server && pnpm install
	```
3.  Configure Environment Variables Rename `.env.example` to `.env` inside the `server` directory and provide appropriate values:
	```bash
	PORT=4000
	DATABASE_URL="postgresql://postgres:mysecretpassword@localhost:5432/socialmediaapp?schema=public"
	JWT_SECRET=""
	CLOUDINARY_CLOUD_NAME=""
	CLOUDINARY_API_KEY=""
	CLOUDINARY_API_SECRET=""
	```
	Ensure all environment variables are correctly configured before running the application.
	
4.  Set Up Prisma
	Run the following commands to generate the Prisma client and apply database migrations:
	```
	npx prisma migrate deploy # or use npx prisma db push
	npx prisma db pull
	npx prisma generate
	npx prisma studio
	```
5. Run the Development Server Start both the frontend and backend servers in separate terminals:
	```bash
	# Start client-side development server
	pnpm run dev
	# Start server-side development server
	pnpm run dev
	```
    -   The backend server will run at [http://localhost:4000](http://localhost:4000).
    -   The frontend server will run at [http://localhost:5173](http://localhost:5173).
    
    Development Mode:
    
    -   If you're running the frontend separately, changes will be reflected instantly in [http://localhost:5173](http://localhost:5173).
    -   If you're accessing the app through the backend ([http://localhost:4000](http://localhost:4000)), you must build the frontend before seeing changes because it's being served from the dist folder.
-   Before Pushing the Code, build the frontend so that the latest version is included in the backend server:
    
    cd client && pnpm run build

## Contacts
-   LinkedIn: [Subrata Kundu](https://www.linkedin.com/in/kundu-subrata/)
-   Mail: [kundu.subrata2020@gmail.com](mailto:kundu.subrata2020@gmail.com)
-   GitHub: [kundusubrata](https://github.com/kundusubrata)

## Contributing

Feel free to fork this repository, create a branch, and submit pull requests for any improvements or fixes.


