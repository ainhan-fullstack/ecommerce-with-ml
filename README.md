# 🛒 Full-Stack E-Commerce Platform with Machine Learning

This project is a modern full-stack e-commerce web application that integrates machine learning for customer segmentation, personalised recommendations, and inventory management. It is designed for scalability and real-world deployment, leveraging AWS cloud services.

---

## 📌 Project Scope & Features

### 1️⃣ E-Commerce Platform
- User authentication & authorisation (JWT)
- Product catalogue management (CRUD)
- Shopping cart functionality
- Order management & checkout
- User profile management

### 2️⃣ Machine Learning Integration
- Customer segmentation using K-Means clustering
- Personalised product recommendations (collaborative filtering)
- Inventory forecasting using time series models

### 3️⃣ Deployment & DevOps
- Docker containerization
- AWS deployment (EC2, RDS, S3)
- CI/CD pipeline integration (GitHub Actions)

---

## 🛠️ Tech Stack

| Layer       | Technologies Used                               |
|-------------|-------------------------------------------------|
| **Frontend**  | React.js, Tailwind CSS, Axios                  |
| **Backend**   | Node.js, Express.js, REST API                  |
| **Database**  | PostgreSQL                                     |
| **ML Service**| Python (FastAPI, scikit-learn, Prophet)        |
| **Cloud**     | AWS (EC2, RDS, S3)                             |
| **Container** | Docker, Docker Compose                         |
| **CI/CD**     | GitHub Actions                                 |

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
| Column       | Type             | Description                    |
|--------------|------------------|--------------------------------|
| id           | SERIAL PRIMARY KEY | Unique order ID              |
| user_id      | INTEGER          | References Users(id)           |
| total_amount | DECIMAL(10, 2)   | Total order amount             |
| status       | VARCHAR(20)      | e.g. pending, shipped, delivered |
| created_at   | TIMESTAMP        | Order date                     |

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

## 🧠 ML Service (Planned)

- Separate Python FastAPI microservice.
- Exposes endpoints for:
  - `/segment` — returns user segment based on RFM.
  - `/recommend` — returns recommended products.
  - `/forecast` — returns inventory forecasts.

---

## 🔗 Planned Architecture Diagram (Text Placeholder)

          +------------------------+
          |  React.js Frontend     |
          +------------------------+
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
                    v
        +----------------------+
        |  PostgreSQL Database |
        +----------------------+
                    |
                    v
    +--------------------------------+
    | Python FastAPI ML Microservice |
    +--------------------------------+
                    |
                    v
        +----------------------+
        |  AWS Cloud Deploy    |
        +----------------------+
