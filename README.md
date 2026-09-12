# Course Selling Backend (In Progress)

A Node.js + Express + MongoDB backend for an online course-selling platform. 
Core schema design and route structure are in place; business logic is 
being implemented next.

## Implemented So Far
- MongoDB connected via Mongoose, with schemas for User, Admin, Course, 
  and Purchase
- Modular route structure: `/user`, `/course`, `/admin`
- Route scaffolding for signup/signin (user & admin), course creation/update, 
  bulk course fetch (admin), and course preview/purchase (user-facing)

## Planned Next
- JWT-based authentication logic (`jsonwebtoken` already included)
- Connect route handlers to real MongoDB queries (currently placeholder responses)
- Password hashing with bcrypt

## Tech Stack
Node.js, Express.js, MongoDB, Mongoose

## Run Locally
\`\`\`bash
git clone https://github.com/Uday-6145/Course-selling-backend.git
cd Course-selling-backend
npm install
node index.js

