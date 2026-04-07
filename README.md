# 📊 Financial Records Management API

A **production-ready backend system** designed to manage financial records with a strong focus on **scalability, security, and clean architecture**.

This project demonstrates real-world backend engineering practices including **authentication, role-based access control (RBAC), data validation, aggregation pipelines, and structured error handling**.

---

# 🚀 Overview

The Financial Records Management API enables organizations or individuals to efficiently:

- Manage users and roles
- Track income and expenses
- Generate analytical summaries
- Enforce secure access control policies

The system is built with **modularity, maintainability, and extensibility** in mind.

---

# ✨ Core Features

## 🔐 Authentication & Authorization

- JWT-based authentication
- Secure HTTP-only cookie storage
- Protected routes using middleware
- Role-Based Access Control (RBAC)

### 👥 Supported Roles

| Role     | Description |
|----------|------------|
| Viewer   | Read-only access to dashboard data |
| Analyst  | Access to records and analytical insights |
| Admin    | Full system control including user & record management |

---

## 👤 User & Role Management

- Create and manage users
- Assign and update roles dynamically
- Enable/disable user accounts
- Enforce access policies at route level

---

## 💰 Financial Records Management

Each financial record contains:

- Amount
- Type (Income / Expense)
- Category
- Date
- Status
- Notes / Description

### Supported Operations

- Create records
- Retrieve records (with pagination)
- Update records
- Delete records
- Filter by:
  - Category
  - Type
- Search records

---

## 📊 Dashboard & Analytics APIs

Advanced aggregation endpoints for insights:

- Total Income
- Total Expenses
- Net Balance
- Category-wise breakdown
- Weekly trends

> Built using optimized MongoDB aggregation pipelines for performance.

---

## 🛡️ Validation & Error Handling

- Centralized validation middleware
- Schema-level validation using Mongoose
- Standardized API error responses
- Proper HTTP status codes
- Protection against invalid or unauthorized operations

---

## ⚡ Performance & Scalability

- Pagination for large datasets
- Query optimization with indexes
- Aggregation pipelines for analytics
- Clean and reusable middleware architecture

---

# 🛠️ Tech Stack

## Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

## Security
- JSON Web Tokens (JWT)
- HTTP-only cookies
- Role-based authorization middleware

## Design Principles
- RESTful API design
- Separation of concerns
- Middleware-driven architecture

---

# 📂 Project Structure

```bash
📂 backend
 ├── 📂 config          # Environment & Database connection logic
 ├── 📂 controllers     # Request handling & Business logic orchestration
 ├── 📂 middleware      # Auth verification, RBAC, & Global Error Handling
 ├── 📂 models          # Mongoose Schemas with strict type-validation
 ├── 📂 routes          # RESTful endpoint definitions (Express Router)
 ├── 📂 utils           # Helpers for Aggregation & Formatting
 └── server.js          # Entry point & Middleware mounting
```

---

# 🔑 API Design Highlights

## Authentication Routes

| Method | Endpoint | Description |
|--------|---------|------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login user |
| POST | /api/auth/logout | Logout user |

---

## Financial Records

| Method | Endpoint | Description |
|--------|---------|------------|
| POST | /api/record/add | Create record |
| GET | /api/record | Get records (pagination + filters) |
| PATCH | /api/record/update/:id | Update record |
| DELETE | /api/record/delete/:id | delete record |

---

## Dashboard

| Method | Endpoint | Description |
|--------|---------|------------|
| GET | /api/summary | Overall financial summary |

---

# 🔐 Access Control Strategy

Access is enforced using **middleware-based RBAC**:

```js
authorizeRoles("admin", "analyst")
```

### Example Rules:

- Viewer → Only GET endpoints
- Analyst → GET + dashboard access
- Admin → Full CRUD + user management

---

# 📦 Data Modeling

## User Schema

- name
- email
- password (hashed)
- role
- isActive

## Record Schema

- amount
- type (income / expense)
- category
- date
- notes
- createdBy

---

# 🧪 Validation Strategy

- Request body validation middleware
- MongoDB schema validation
- Edge case handling:
  - Invalid ObjectIds
  - Missing fields
  - Unauthorized access
  - Duplicate entries

---

# ⚙️ Setup Instructions

## 1️⃣ Clone Repository

```bash
git clone https://github.com/smitbharvadiya/Finance-Dashboard.git
cd backend
```

## 2️⃣ Install Dependencies

```bash
npm install
```

## 3️⃣ Configure Environment

Create a `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
```

## 4️⃣ Run Server

```bash
npm run dev
```

---

# 📈 Future Enhancements

- Refresh token mechanism
- Rate limiting (API protection)
- Export reports (PDF/CSV)
- Unit & integration testing (Jest)

---

# 📚 Design Decisions & Tradeoffs

- **MongoDB** chosen for flexibility in schema evolution
- **JWT over sessions** for scalability in distributed systems
- **Middleware-driven RBAC** for centralized access control

---

# 🧾 Conclusion

This project goes beyond basic CRUD operations and demonstrates:

- Strong backend architecture
- Secure authentication & authorization
- Scalable API design
- Real-world data handling practices

It reflects how production-grade backend systems are structured and implemented.

---

# 👨‍💻 Author

**Smit Bharvadiya**

---
