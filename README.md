# E-Commerce Backend API

This README provides an overview of the API routes available in the e-commerce backend, describing their functionalities and required permissions.

## User Routes (`/user`)

### POST `/register`

-   **Description**: Registers a new user.
-   **Request Body**:
    -   `email`: string
    -   `password`: string
    -   `name`: string
-   **Response**:
    -   Success: JWT Authentication token, User details (without password),

### POST `/login`

-   **Description**: Authenticates a user and provides a token.
-   **Request Body**:
    -   `email`: string
    -   `password`: string
-   **Response**:
    -   Success: JWT Authentication token

### PUT `/grant-admin-access`

-   **Description**: Grants admin access to a user.
-   **Middleware**: Requires `adminAuthMiddleware`.
-   **Request Body**:
    -   `userId`: string
-   **Response**:
    -   Success: Updated user details

## Product Routes (`/products`)

### GET `/`

-   **Description**: Fetches a list of all products.
-   **Middleware**: Requires `authMiddleware`.
-   **Response**:
    -   Success: Array of product objects

### POST `/`

-   **Description**: Adds a new product.
-   **Middleware**: Requires `adminAuthMiddleware`.
-   **Request Body**:
    -   `name`: string
    -   `price`: number
    -   `description`: string
    -   `category`: string
-   **Response**:
    -   Success: Created product object

### GET `/:id`

-   **Description**: Fetches details of a single product by its ID.
-   **Middleware**: Requires `authMiddleware`.
-   **Response**:
    -   Success: Product object

### PUT `/:id`

-   **Description**: Updates a product by its ID.
-   **Middleware**: Requires `adminAuthMiddleware`.
-   **Request Body**:
    -   Any fields to update (e.g., `name`, `price`)
-   **Response**:
    -   Success: Updated product object

### DELETE `/:id`

-   **Description**: Deletes a product by its ID.
-   **Middleware**: Requires `adminAuthMiddleware`.
-   **Response**:
    -   Success: Deletion confirmation

## Cart Routes (`/cart`)

### GET `/`

-   **Description**: Fetches the user's cart.
-   **Middleware**: Requires `authMiddleware`.
-   **Response**:
    -   Success: Array of cart items

### POST `/`

-   **Description**: Adds an item to the user's cart.
-   **Middleware**: Requires `authMiddleware`.
-   **Request Body**:
    -   `productId`: string
    -   `quantity`: number
-   **Response**:
    -   Success: Updated cart

### DELETE `/:id`

-   **Description**: Removes an item from the user's cart by its ID.
-   **Middleware**: Requires `authMiddleware`.
-   **Response**:
    -   Success: Updated cart

## Middleware Overview

### `authMiddleware`

-   Ensures the user is authenticated by verifying the provided token.

### `adminAuthMiddleware`

-   Verifies that the user has admin privileges.
