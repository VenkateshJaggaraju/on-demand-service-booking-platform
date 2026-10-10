# On-Demand Service Booking Platform

A full-stack **On-Demand Service Booking Platform** that connects customers with service providers. Customers can browse and book services, service providers can manage their services and bookings, and administrators can manage the overall platform.

## 🚀 Tech Stack

### Backend

* Java
* Spring Boot
* Spring Data JPA
* Spring Security
* JWT Authentication
* REST APIs
* PostgreSQL
* Hibernate ORM
* Maven

### Frontend

* React.js
* TypeScript
* Tailwind CSS
* Axios
* React Router

---

## 📌 Features

### 👤 Customer

* Customer registration and login
* JWT-based authentication
* Browse available services
* Select service provider
* Book services within the available time slots
* Cancel bookings
* View booking history
* Give ratings and reviews
* Save services to cart
* Make payments
* View booking and payment details

### 🧑‍🔧 Service Provider

* Service provider registration and login
* JWT-based authentication
* Create services
* Update services
* Manage service availability
* View incoming bookings
* Accept or reject bookings
* Update booking status
* View customer booking details
* Handle customer problems
* View payments and earnings
* Manage provided services

### 👨‍💼 Admin

* Admin login
* JWT-based authentication
* Manage customers
* Manage service providers
* Approve/reject service provider access
* Manage services
* Manage bookings
* Block/unblock users
* View dashboard statistics
* Monitor platform activity

---

## 🔐 Authentication & Authorization

The application uses **Spring Security with JWT (JSON Web Token)** for authentication and role-based authorization.

### User Roles

```text
ADMIN
CUSTOMER
SERVICEPROVIDER
```

Each role has access to different protected resources.

---

## 🗃️ Database Relationships

### Customer ↔ Booking ↔ Service

The core relationship of the application is between `Customer`, `Booking`, and `Service`.

```text
Customer                         Booking                         Service
   │                               │                               │
   │ 1                           N │ N                           1 │
   └───────────────────────────────┘───────────────────────────────┘
```

More precisely:

```text
Customer  1 ─────────── N  Booking  N ─────────── 1  Service
```

---

## 🛡️ Security

The backend uses:

* Spring Security
* JWT Authentication
* BCrypt password hashing
* Role-based authorization
* Stateless authentication
* Protected REST endpoints
* CORS configuration
* Authentication filters

Example:

```text
/admin/**              → ADMIN
/customer/**           → CUSTOMER
/service-provider/**   → SERVICEPROVIDER
```

Public endpoints such as registration, login, and public service browsing can be configured separately.

---

---


## 🔄 Overall Application Flow

```text
                         ┌──────────────┐
                         │    Admin     │
                         └──────┬───────┘
                                │
                    Manage Platform
                                │
                                ▼
┌──────────────┐        ┌───────────────┐        ┌──────────────────┐
│   Customer   │───────►│    Booking    │◄───────│ Service Provider │
└──────┬───────┘        └───────┬───────┘        └────────┬─────────┘
       │                         │                         │
       │                         ▼                         │
       │                     Payment                       │
       │                                                   │
       ▼                                                   ▼
    Review                                           Service Management
```

---
## 🚀 Future Enhancements

* Email notifications
* SMS notifications
* Real-time booking updates using WebSockets
* Advanced service-provider search
* Location-based service discovery
* Google Maps integration
* Service-provider verification
* Automated invoice generation
* Advanced analytics
* Redis caching
* Microservices architecture
* Docker and containerization
* CI/CD deployment

---

/*
 * ============================================================
 * Postman-Specific APIs
 * ============================================================
 *
 * Note:
 * The following APIs are primarily intended for testing
 * through Postman.
 *
 * All other APIs can be accessed through both the browser
 * and Postman, depending on authentication and authorization.
 *
 * Postman endpoints:
 *
 * Admin:
 *      POST /admin/register
 *
 * Customer:
 *      GET  /customer/booking
 *      POST /customer/booking
 *      GET  /customer/booking/{id}
 *
 * Service Provider:
 *      GET /service-provider/booking
 *      GET /service-provider/booking/service/{id}/pending
 *
 * ============================================================
 */
 
/*
 * ============================================================
 * Key Takeaways
 * ============================================================
 *
 * 1. Only one user can effectively access the application at
 *    a time when the application is running on localhost and
 *    authentication state is maintained using localStorage.
 *
 * 2. If a ServiceProvider wants to view/manage customer-related
 *    information, the Customer and ServiceProvider need to be
 *    logged in separately.
 *
 *    Example:
 *      - Customer     -> logged in through one browser tab
 *      - ServiceProvider -> logged in through another tab
 *
 *    Both sessions must have their respective authentication
 *    tokens available.
 *
 * 3. Cause of OptimisticLockException:
 *
 *    OptimisticLockException can occur when two transactions
 *    try to update the same database entity at nearly the same
 *    time, and the entity's version has already changed because
 *    of another transaction.
 *
 *    Example:
 *
 *      Transaction A                  Transaction B
 *           |                              |
 *           | Read Booking (version 1)     |
 *           |                              |
 *           |                              | Read Booking (version 1)
 *           |                              |
 *           | Update Booking               |
 *           | version 1 -> version 2       |
 *           |                              |
 *           |                              | Try to update
 *           |                              | version 1
 *           |                              |
 *           |                              X
 *           |                         OptimisticLockException
 *
 *    This is why @Version is used with optimistic locking.
 *    Hibernate checks whether the entity version is still the
 *    same before updating the record.
 *
 * ============================================================
 */


## 🚀 Live Deployment

| 🧩 Component | ☁️ Platform | 🔗 Live URL |
|---|---|---|
| 🎨 **Frontend** | ![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white) | [🌐 Open Frontend](https://on-demand-service-booking-platform-iota.vercel.app/) |
| ⚙️ **Backend** | ![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=black) | [🚀 Open Backend](https://on-demand-service-booking-platform-umkq.onrender.com) |
| 🗄️ **Database** | ![Neon](https://img.shields.io/badge/Neon-00E5FF?style=for-the-badge&logo=postgresql&logoColor=white) | **PostgreSQL on Neon** |

### 🌐 Application Architecture

```text
┌──────────────────────────────────────────────────────────────┐
│                  ON-DEMAND SERVICE PLATFORM                  │
└──────────────────────────────────────────────────────────────┘

             👤 Customer / Service Provider
                         │
                         ▼
        ┌─────────────────────────────────┐
        │       🎨 React + TypeScript     │
        │             Vercel              │
        └─────────────────────────────────┘
                         │
                         │ HTTPS / REST API
                         ▼
        ┌─────────────────────────────────┐
        │       ⚙️ Spring Boot API        │
        │             Render              │
        └─────────────────────────────────┘
                         │
                         │ JDBC / PostgreSQL
                         ▼
        ┌─────────────────────────────────┐
        │        🗄️ PostgreSQL            │
        │             Neon                │
        └─────────────────────────────────┘



## 👨‍💻 Author

**Venkatesh**

Full Stack Developer | Java | Spring Boot | React.js | TypeScript

---

