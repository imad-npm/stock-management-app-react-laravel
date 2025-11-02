# Stock Management System

This is a full-stack stock management application built with a React frontend and a Laravel backend. It provides a comprehensive solution for managing inventory, tracking product movements, and gaining insights into your stock data.

## About the Project

The Stock Management System is designed to help businesses of all sizes effectively manage their inventory. It provides a user-friendly interface for tracking products, categories, and transactions. The system also includes a dashboard for visualizing key stock metrics.

## Use Cases

This application can be used for a variety of purposes, including:

*   **Inventory Control:** Keep track of product quantities, locations, and other details.
*   **Order Management:** Manage incoming and outgoing stock transactions.
*   **Reporting and Analytics:** Gain insights into your stock data with the help of a dashboard and reports.
*   **User Management:** Control access to the system with different user roles and permissions.

## User Roles

The application has two main user roles:

*   **Admin:** The admin user has full access to the system. They can perform any action on any resource, including:
    *   Managing users (creating, updating, deleting)
    *   Managing all products, categories, and transactions.

*   **User:** The user role has limited access to the system. They can:
    *   Create new products, categories, and transactions.
    *   Only view, update, and delete their own products, categories, and transactions.

## Technologies Used

### Backend

*   **Framework:** [Laravel](https://laravel.com/) (version 12)
*   **Language:** [PHP](https://www.php.net/) (version 8.2)
*   **API:** RESTful API
*   **Authentication:** [Laravel Sanctum](https://laravel.com/docs/11.x/sanctum) (token-based)
*   **Database:** MySQL (or any other Laravel-supported database)

### Frontend

*   **Framework:** [React](https://react.dev/) (version 18.2.0)
*   **State Management:** [Redux Toolkit](https://redux-toolkit.js.org/)
*   **Routing:** [React Router](https://reactrouter.com/) (version 6)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Build Tool:** [Webpack](https://webpack.js.org/)

## Getting Started

To get the project up and running, follow these steps:

### Prerequisites

*   Node.js and npm (or yarn)
*   PHP and Composer
*   MySQL (or another database)

### Backend Setup

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    composer install
    ```
3.  Set up your environment file:
    ```bash
    cp .env.example .env
    ```

4.  Configure your database in the `.env` file.
5.  Run database migrations and seeders:
    ```bash
    php artisan migrate --seed
    ```
6.  Start the backend server:
    ```bash
    php artisan serve
    ```

### Frontend Setup

1.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the frontend development server:
    ```bash
    npm start
    ```

The frontend will be available at `http://localhost:3000` and the backend at `http://localhost:8000`.
