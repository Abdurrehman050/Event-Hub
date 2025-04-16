# EventHub – Airbnb for Events
EventHub is a full-stack web application designed to help users discover, post, and manage event venues—think of it as the Airbnb for events. Built with the MERN stack, it allows hosts to list their spaces and customers to explore and book venues for birthdays, weddings, corporate events, and more.

# 🚀 Features
🏠 Post & Discover Event Venues

🗓 Venue Listings
Users can browse or list event venues, complete with images, details, pricing, and availability.

💬 In-App Chat + Offers
Real-time messaging between venue owners and users. You can negotiate terms, send offers, and accept with just one click — offers are tied directly to Stripe for instant payments.

💳 Stripe Payments
Fully integrated Stripe payments system. Pay directly in the chat once terms are agreed. Safe, fast, and hassle-free.

🍽 Restaurant & Menu System
Venue owners can also register restaurants, set up multiple menus, and link them to their venue. Perfect for full-service events with catering.

🔔 Order Management & Notification Board
Admins and owners can view real-time order status updates like:
Pending, Waiting for Payment, Paid, etc. Helps keep operations running smoothly.

⭐ Review System
After each booking, users can leave a rating and review to help others make better choices.

👤 User Profiles for both customers and venue hosts

📱 Responsive UI built with React and Tailwind CSS

🛠️ Admin Dashboard to manage users and venue listings

🔐 Secure Authentication with session-based login

📞 SMS Verification via Twilio

📷 Image Upload Support for venue photos

🗓️ Booking Interface with availability and pricing

# 📸 Screenshots
![Image](https://github.com/user-attachments/assets/cd328335-6bbe-4fe8-9c97-4879af58277b)
![Image](https://github.com/user-attachments/assets/39af3658-18fe-401a-8629-6859a9a9a2cc)


# 🧰 Tech Stack
MongoDB

Express.js

React.js

Node.js

Tailwind CSS

Mongoose

Twilio API for SMS verification

Multer for image uploads

# 🧠 How It Works
Hosts can create an account and list their venues with descriptions, prices, and photos.

Customers can browse venues, view detailed information, and make bookings.

An admin panel provides full control over listings and user activities.

SMS verification ensures account authenticity and secure booking communication.
# Steps to run the project:

Download or git clone the whole project.
Open the project in VSCode (ensure you already have the latest Node.js and npm installed on your computer).
cd/move to the backend folder and type "npm install".
After that, go to the backend folder and use this command to run the backend: "node --watch app.js".
The above step will show a message in the command line "server is running on 8000" and "DB connected".

============================== Your server is now ready to accept requests =======================================
