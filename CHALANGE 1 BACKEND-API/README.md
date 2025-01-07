# Product Inventory System

A Node.js-based project with authentication, authorization, role-based permissions, and optimized image handling. The project is built with Sequelize, JWT, and Refresh Tokens, and it includes robust validation using the Joi package.

## Features

- **Authentication:** User login and registration using JWT and refresh tokens.
- **Authorization:** Role-based permissions system implemented using Roles and Permissions models.
- **Image Optimization:** Resizes and optimizes images for efficient storage and retrieval.
- **Input Validation:** Validates user input with the Joi package.
- **Database Models:** Predefined models for Users, Roles, Permissions, Products, Categories, and related entities.

## Installation

1. Clone the repository.

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up the environment variables:
   Create a `.env` file in the project root and configure the following variables:

   ```env
   NODE_ENV=development
   DB_USERNAME=postgres
   DB_PASSWORD=
   DB_HOST=localhost
   DB_DIALECT=postgres
   PORT=3000
   DB_NAME=backend_test_db
   JWT_SECRET_KEY=ecomerce-app-that-developed-by-me
   JWT_EXPIRES=30d
   JWT_ISSUER=
   JWT_AUDIENCE=
   ```

4. Run database migrations and seeders:

   ```bash
   npx sequelize db:migrate
   ```

5. Start the development server:
   ```bash
   npm start
   ```

## Usage

### Authentication

- Register a new user: `POST /auth/signup`
- Login to get access and refresh tokens: `POST /auth/login`
- Refresh an expired access token: `POST /auth/refreshToken`
- Refresh an expired access token: `POST /auth/revokeToken`

### Authorization

- Roles and permissions are managed through the `Role` and `Permission` models.
- Assign permissions to roles and assign roles to users.

### Image Handling

- Images are uploaded to the `public` directory.
- Images are automatically resized and optimized during upload.

### Validation

- All inputs are validated using the Joi package to ensure data integrity.

## Project Structure

```
project-folder/
├── config/
├── controllers/
├── middlewares/
├── migrations/
├── models/
├── public/
├── routes/
├── seeders/
├── utils/
├── validations/
├── .env
├── app.js
├── server.js
├── package.json
└── README.md
```

## API Endpoints

### Authentication

- **POST** `/auth/register`: Register a new user.
- **POST** `/auth/login`: Login and receive access and refresh tokens.
- **POST** `/auth/refresh`: Get a new access token using a refresh token.

### Categories

- **GET** `/categories`: Fetch all categories.
- **POST** `/categories`: Create a new category.
- **PUT** `/categories/:id`: Update an existing category.
- **DELETE** `/categories/:id`: Delete a category.

### Products

- **GET** `/products`: Fetch all products.
- **POST** `/products`: Create a new product.
- **PUT** `/products/:id`: Update an existing product.
- **DELETE** `/products/:id`: Delete a product.
