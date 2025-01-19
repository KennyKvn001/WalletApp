# MyWallet Application

<img width="1512" alt="Screenshot 2025-01-19 at 17 51 45" src="https://github.com/user-attachments/assets/1d4f52b1-5196-4b14-9ff0-aa06982ae28e" />


## Overview

MyWallet is a personal finance management application that allows users to track their income, expenses, budgets, and accounts. The application is built using React for the frontend and Django REST Framework for the backend. This README provides guidance on how to navigate through the project, set it up, and understand its functionality.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Frontend Setup](#frontend-setup)
  - [Backend Setup](#backend-setup)
- [Navigating the Application](#navigating-the-application)
  - [Frontend Navigation](#frontend-navigation)
  - [Backend API Endpoints](#backend-api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Features

- User authentication (login, registration)
- Account management (create, update, delete accounts)
- Category management (create, update, delete categories)
- Transaction management (record income and expenses)
- Budget management (set budgets and track progress)
- Visual representation of income and expenses through charts
- Responsive design for mobile and desktop

## Technologies Used

- **Frontend:** React, React Router, Axios, Chart.js
- **Backend:** Django, Django REST Framework, PostgreSQL
- **Deployment:** Render (for frontend), Heroku (for backend)

## Getting Started

### Frontend Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/mywallet.git
   cd mywallet/frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Run the development server:**

   ```bash
   npm start
   ```

   The frontend will be available at `mywalletapptaskforce.netlify.app`.

### Backend Setup

1. **Navigate to the backend directory:**

   ```bash
   cd mywallet/wallet_backend
   ```

2. **Create a virtual environment (optional but recommended):**

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. **Install dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

4. **Set up the database:**

   - If using SQLite, no additional setup is needed.
   - For PostgreSQL, create a database and update the `DATABASE_URL` in `settings.py`.

5. **Run migrations:**

   ```bash
   python manage.py migrate
   ```

6. **Create a superuser (optional for admin access):**

   ```bash
   python manage.py createsuperuser
   ```

7. **Run the development server:**

   ```bash
   python manage.py runserver
   ```

   The backend will be available at `https://walletapp-89se.onrender.com/`.

## Navigating the Application

### Frontend Navigation

- **Login:** Access the login page at `/login` to authenticate.
- **Register:** New users can register at `/register`.
- **Dashboard:** The main dashboard is accessible at `/`, displaying an overview of accounts, budgets, and recent transactions.
- **Accounts:** Manage accounts at `/accounts`.
- **Budgets:** Set and track budgets at `/budgets`.
- **Transactions:** Record and view transactions at `/transactions`.
- **Categories:** Manage expense and income categories at `/categories`.

### Backend API Documentation

`https://walletapp-89se.onrender.com/swagger/`

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
