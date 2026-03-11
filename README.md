# Menotra_client

🎓 SkillBridge"Connect with Expert Tutors, Learn Anything"SkillBridge is a comprehensive full-stack tutoring marketplace that bridges the gap between learners and educators. It provides a seamless interface for students to discover expertise, while giving tutors the tools to manage their professional teaching business.🚀 Project OverviewSkillBridge is built to handle the complexities of scheduling, user role management, and discovery. From a dynamic landing page featuring top-rated tutors to a robust admin panel for platform moderation, this application provides a complete end-to-end solution for online education.🛠️ Tech StackFrontend: React.js / Next.js (Tailwind CSS for styling)Backend: Node.js / Express.jsDatabase: PostgreSQL / MongoDB (Structured for relational integrity)Authentication: JWT (JSON Web Tokens) with Role-Based Access Control (RBAC)👥 Roles & PermissionsRoleDescriptionKey PermissionsStudentLearners seeking sessionsBrowse tutors, book sessions, leave reviewsTutorSubject matter expertsCreate profile, set availability, manage bookingsAdminPlatform moderatorsManage users, view analytics, manage categories✨ Key Features🔍 Public FeaturesSmart Search: Filter tutors by subject, rating, and price.Detailed Profiles: View tutor bios, categories, and student feedback.Category Navigation: Browse tutors grouped by specific learning fields.🎓 Student FeaturesSecure Booking: Instant session scheduling.Dashboard: Manage upcoming and past learning sessions.Feedback Loop: Rate and review tutors after completed sessions.👨‍🏫 Tutor FeaturesProfile Management: Update bio, subjects, and pricing.Availability Tool: Set custom time slots for student bookings.Session Tracking: Monitor teaching schedule and student lists.⚖️ Admin FeaturesUser Management: Control platform access (Ban/Unban users).Global Analytics: View all bookings and platform activity.Content Moderation: Create and edit tutoring categories.🗄️ Database SchemaThe database is designed to ensure seamless relationships between users and their specific roles.Users: Stores core authentication and role data.TutorProfiles: Detailed professional info (linked to User ID).Bookings: Tracks the relationship between Students, Tutors, and Time.Reviews: Stores qualitative data and star ratings for tutors.🛣️ API Reference (Examples)AuthenticationPOST /api/auth/register | POST /api/auth/login | GET /api/auth/meTutors & BookingsGET /api/tutors | POST /api/bookings | PUT /api/tutor/availabilityAdminGET /api/admin/users | PATCH /api/admin/users/:id⚙️ InstallationClone the RepoBashgit clone https://github.com/yourusername/skillbridge.git
Install DependenciesBashnpm install
Environment SetupCreate a .env file and add your DATABASE_URL and JWT_SECRET.LaunchBashnpm run deva# 🎓 SkillBridge

**Connect with Expert Tutors, Learn Anything**

---

## 🚀 Project Overview

**SkillBridge** is a full-stack tutoring marketplace that connects learners with expert tutors.
Students can discover tutors, book sessions, and leave reviews, while tutors can manage their availability and track teaching sessions. Admins manage the platform, users, and categories.

This project demonstrates a **role-based SaaS architecture** with real-world features like authentication, booking systems, and dashboards.

---

## 👥 User Roles & Permissions

### 🧑‍🎓 Student

Learners who book tutoring sessions.

**Permissions:**

- Browse tutors
- Book sessions
- View booking history
- Leave reviews
- Manage profile

---

### 👨‍🏫 Tutor

Experts who offer tutoring services.

**Permissions:**

- Create and update tutor profile
- Set availability slots
- Manage subjects
- View bookings
- See ratings and reviews

---

### 🛡️ Admin

Platform moderators.

**Permissions:**

- Manage users (ban/unban)
- View all bookings
- Manage categories
- Platform analytics

> ⚠️ Admin accounts are seeded in the database.

---

## 🛠️ Tech Stack

> See `README.md` or project docs for full specifications.

**Frontend**

- React / Next.js
- TypeScript
- Tailwind CSS / UI Library

**Backend**

- Node.js / Express
- REST API Architecture

**Database**

- MongoDB / PostgreSQL (based on implementation)

**Authentication**

- JWT / Session-based Auth

---

## ✨ Features

### 🌐 Public Features

- Browse tutors by subject, rating, and price
- Advanced filtering system
- Tutor profile with reviews
- Landing page with featured tutors

---

### 🎓 Student Features

- Register & login as student
- Book tutoring sessions
- View upcoming and past bookings
- Leave reviews after sessions
- Manage personal profile

---

### 👨‍🏫 Tutor Features

- Register & login as tutor
- Create and update tutor profile
- Set availability slots
- Manage teaching sessions
- View ratings and reviews

---

### 🛡️ Admin Features

- Manage all users
- Ban / unban accounts
- View all bookings
- Manage categories

---

## 📄 Pages & Routes

### 🌍 Public Routes

| Route         | Description                              |
| ------------- | ---------------------------------------- |
| `/`           | Landing page with hero & featured tutors |
| `/tutors`     | Browse tutors with filters               |
| `/tutors/:id` | Tutor profile & reviews                  |
| `/login`      | Login page                               |
| `/register`   | Registration page                        |

---

### 🎓 Student Routes (Private)

| Route                 | Description       |
| --------------------- | ----------------- |
| `/dashboard`          | Student dashboard |
| `/dashboard/bookings` | Booking history   |
| `/dashboard/profile`  | Manage profile    |

---

### 👨‍🏫 Tutor Routes (Private)

| Route                 | Description          |
| --------------------- | -------------------- |
| `/tutor/dashboard`    | Tutor dashboard      |
| `/tutor/availability` | Set availability     |
| `/tutor/profile`      | Manage tutor profile |

---

### 🛡️ Admin Routes (Private)

| Route               | Description       |
| ------------------- | ----------------- |
| `/admin`            | Admin dashboard   |
| `/admin/users`      | Manage users      |
| `/admin/bookings`   | View all bookings |
| `/admin/categories` | Manage categories |

---

## 🗄️ Database Schema

### Core Tables

- **Users** — Authentication and role-based access
- **TutorProfiles** — Tutor-specific info (linked to Users)
- **Categories** — Subject categories
- **Bookings** — Student-tutor sessions
- **Reviews** — Student feedback for tutors

---

## 🔌 API Endpoints

### 🔐 Authentication

| Method | Endpoint             | Description       |
| ------ | -------------------- | ----------------- |
| POST   | `/api/auth/register` | Register new user |
| POST   | `/api/auth/login`    | Login user        |
| GET    | `/api/auth/me`       | Get current user  |

---

### 👨‍🏫 Tutors (Public)

| Method | Endpoint          | Description             |
| ------ | ----------------- | ----------------------- |
| GET    | `/api/tutors`     | Get tutors with filters |
| GET    | `/api/tutors/:id` | Tutor details           |
| GET    | `/api/categories` | Get all categories      |

---

### 📅 Bookings

| Method | Endpoint            | Description     |
| ------ | ------------------- | --------------- |
| POST   | `/api/bookings`     | Create booking  |
| GET    | `/api/bookings`     | User bookings   |
| GET    | `/api/bookings/:id` | Booking details |

---

### 🧑‍🏫 Tutor Management

| Method | Endpoint                  | Description          |
| ------ | ------------------------- | -------------------- |
| PUT    | `/api/tutor/profile`      | Update tutor profile |
| PUT    | `/api/tutor/availability` | Update availability  |

---

### ⭐ Reviews

| Method | Endpoint       | Description   |
| ------ | -------------- | ------------- |
| POST   | `/api/reviews` | Create review |

---

### 🛡️ Admin

| Method | Endpoint               | Description        |
| ------ | ---------------------- | ------------------ |
| GET    | `/api/admin/users`     | Get all users      |
| PATCH  | `/api/admin/users/:id` | Update user status |

---

## ⚙️ Installation

```bash
# Clone the repo
git clone https://github.com/asifalam515/skillBridge_client

# Install dependencies
cd skillbridge
npm install

# Run development server
npm run dev
```

---

## 🔐 Environment Variables

Create a `.env` file:

```env
DATABASE_URL=
JWT_SECRET=
NEXT_PUBLIC_API_URL=
```

---

## 📸 Screenshots

_Add screenshots here if needed_

---

## 🌟 Future Improvements

- Video session integration (WebRTC / Zoom API)
- Real-time chat
- Payment gateway integration
- Notifications system
- Tutor verification system

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss your ideas.

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙌 Author

**Built with ❤️ by Asif**

If you like this project, consider giving it a ⭐ on GitHub!
