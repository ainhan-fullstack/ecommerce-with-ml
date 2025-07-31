# 🛒 Full-Stack E-Commerce Platform.

Demo video: https://youtu.be/iVvbWsQniio

This project is a modern full-stack e-commerce web application. It is designed for scalability and real-world deployment.

---

## 📌 Project Scope & Features

### 1️⃣ E-Commerce Platform
- User authentication & authorisation (JWT)
- Product catalogue management (CRUD)
- Shopping cart functionality
- Order management & checkout
- User profile management

---

## 🛠️ Tech Stack

| Layer       | Technologies Used                               |
|-------------|-------------------------------------------------|
| **Frontend**  | React.js, Tailwind CSS, Axios                  |
| **Backend**   | Node.js, Express.js, REST API                  |
| **Database**  | PostgreSQL                                     |

---

## 🗄️ Initial Database Schema

Below is a **simplified schema** for the PostgreSQL database:

### Users Table
| Column       | Type             | Description                    |
|--------------|------------------|--------------------------------|
| id           | SERIAL PRIMARY KEY | Unique user ID               |
| username     | VARCHAR(50)      | Unique username                |
| email        | VARCHAR(100)     | User email address             |
| password_hash| VARCHAR(255)     | Hashed password                |
| created_at   | TIMESTAMP        | Account creation timestamp     |
| updated_at   | TIMESTAMP        | Last updated timestamp         |

---

### Products Table
| Column       | Type             | Description                    |
|--------------|------------------|--------------------------------|
| id           | SERIAL PRIMARY KEY | Unique product ID            |
| name         | VARCHAR(100)     | Product name                   |
| description  | TEXT             | Product description            |
| price        | DECIMAL(10, 2)   | Product price                  |
| stock_quantity | INTEGER        | Quantity in stock              |
| category     | VARCHAR(50)      | Product category               |
| created_at   | TIMESTAMP        | Added date                     |
| updated_at   | TIMESTAMP        | Last updated timestamp         |

---

### Orders Table
| Column                | Type                      | Description                      |
|-----------------------|---------------------------|----------------------------------|
| id                    | SERIAL PRIMARY KEY        | Unique order ID                  |
| user_id               | INTEGER                   | References Users(id)             |
| total_amount          | DECIMAL(10, 2)            | Total order amount               |
| status                | VARCHAR(20)               | e.g. pending, shipped, delivered |
| stripe_payment_intent | VARCHAR(100)              | Stripe PaymentIntent ID          |
| payment_status        | VARCHAR(20)               | e.g. succeeded, pending, failed  |
| created_at            | TIMESTAMP                 | Order date                       |

---

### Order_Items Table
| Column       | Type             | Description                    |
|--------------|------------------|--------------------------------|
| id           | SERIAL PRIMARY KEY | Unique order item ID         |
| order_id     | INTEGER          | References Orders(id)          |
| product_id   | INTEGER          | References Products(id)        |
| quantity     | INTEGER          | Quantity ordered               |
| price        | DECIMAL(10, 2)   | Price at order time            |

---

## 🔗 Planned Architecture Diagram (Text Placeholder)

          +------------------------+
          |  React.js Frontend     |
          +------------------------+
                    |
            Stripe.js Elements
                    |
                    v
               +---------+
               |  Axios  |
               +---------+
                    |
                    v
    +-----------------------------------+
    |  Node.js + Express REST API       |
    +-----------------------------------+
                    |
              Stripe Node SDK
                    |
                    v
        +----------------------+
        |  Stripe Payment API  |
        +----------------------+
                    |
                    v
        +----------------------+
        |  PostgreSQL Database |
        +----------------------+
