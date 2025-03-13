# Voyage99 - Backend

This is the backend of **Voyage99**, a private travel journaling app. It is built using **Node.js, Express.js, and MongoDB** to handle user authentication, data storage, and security.

## Key Features:
- **User Authentication**: Secure login and registration with password hashing.
- **Travel Story Management**: Users can **store, update, filter, and delete** their personal travel experiences.
- **Demo Accounts**: Two demo accounts (`test1@demo.com` and `test2@demo.com`, password: `12345678`) allow new users to explore the app without signing up.  
- **Automated Demo Reset**: A **cron job** runs every **24 hours** to reset demo accounts, ensuring any modifications are temporary.
- **Strict Security Measures**:
  - When a user deletes their account, all associated data is removed immediately to **prevent lingering access**.
  - During the demo account reset, security measures ensure that active demo users cannot affect the server or tamper with the database.
  - API endpoints are protected to ensure **only authenticated users can access or modify their own data**.

The backend is designed to run **smoothly and securely**, preventing any unauthorized access or data inconsistencies.
