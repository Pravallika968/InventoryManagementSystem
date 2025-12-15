# Inventory Management System
## Overview
The **Inventory Management System (IMS)** is a modern web-based application designed to efficiently manage products, transactions, and users in an organization. It provides role-based access for Admin, Staff, and Customers, allowing secure operations and real-time inventory tracking.  

## Features
- Role-Based Access Control: Separate modules for Admin, Staff, and Customer with specific permissions.
- Secure User Authentication: Login and registration system for all roles.
- Inventory Management: Add, update, delete, and view products with images, SKU, and descriptions.
- Stock Tracking: Real-time stock quantity updates.
- Order & Transaction Management: Track customer orders and transactions in detail.
- CSV Export: Download product and transaction reports in CSV format.
- Search & Filter: Easily search for products and transactions.
- Responsive UI: Modern, user-friendly React frontend interface.
- Backend Management: Robust Java Spring Boot backend handling APIs and database operations.
- Database Integration: MySQL database to store all product, user, and transaction information

---

## Tech Stack
- **Frontend:** React.js, HTML, CSS, JavaScript  
- **Backend:** Java Spring Boot  
- **Database:** MySQL  
- **Version Control:** Git & GitHub  

---

## Project Structure
InventoryManagementSystem/
├── frontend/ # React frontend
├── backend/ # Java Spring Boot backend
├── customer/ # Customer-related files
├── Agile_Template_v0.1.xlsx
├── Defect_Tracker Template_v0.1.xlsx
├── Inventory management SysteM.pptx
├── Unit_Test_Plan_v0.1.xlsx
├── LICENSE
└── README.md

---

## How to Run

### Backend
cd backend
mvn clean install
mvn spring-boot:run

### Frontend
cd frontend
npm install
npm start

### Database
Create a MySQL database
Update application.properties in backend with your DB credentials

---

### Contact
Developer: Pravallika
GitHub: https://github.com/Pravallika968
Email:pravallikapikkili7@gmail.com
