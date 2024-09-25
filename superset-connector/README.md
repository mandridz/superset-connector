# Superset Connector

![NestJS](https://img.shields.io/badge/NestJS-1ED760?logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)

## Overview

**Superset Connector** is a NestJS-based microservice that interfaces with the Superset API to fetch and process data.

## Prerequisites

- **Node.js**: v14.x or higher
- **npm**: v6.x or higher
- **Docker**: v20.x or higher (optional)
- **Git**

## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/mandridz/superset-connector.git
   cd superset-connector
   ```
2. **Install Dependencies**
   ```bash
   npm i
   ```
   
## Configuration
The application requires certain environment variables to function correctly. Create a .env file in the root directory and add the following variables:

```env
ACCESS_TOKEN=your-generated-access-token
SUPERSET_URL=https://superset-endpoint/api/v1/intract/data
SUPERSET_ACCESS_TOKEN=your-superset-access-token
PORT=3000
```

- ACCESS_TOKEN: Token used for authenticating requests to the Superset Connector API.
- SUPERSET_URL: The endpoint URL of the Superset API.
- SUPERSET_ACCESS_TOKEN: Token used for authenticating requests to the Superset API.
- PORT: (Optional) Port on which the application will run. Defaults to 3000.

> Ensure that the .env file is added to .gitignore to prevent sensitive information from being committed to version control.

## Running the Application

### Locally

1. **Build the Project**
   
   ```bash
   npm run build --workspace=superset-connector
   ```
   
2. **Start the Application**

   ```bash
   npm run start:prod --workspace=superset-connector
   ```

The application should now be running at `http://localhost:3000`.

## Using Docker

1. **Build the Docker Image**

   ```bash
   docker build \
   --build-arg path=superset-connector \
   -t superset-connector .
   ```
   
2. **Run the Docker Container**

   ```bash
   docker run -d -p 3000:3000 \
   --name superset-connector-container \
   --env-file superset-connector/.env \
   superset-connector
   ```

The application will be accessible at `http://localhost:3000`.

## Using Docker Compose

Alternatively, you can use Docker Compose for easier management.

**Run Docker Compose**

   ```bash
   PROJECT_NAME=superset-connector docker-compose up
   ```

The application will be accessible at `http://localhost:3000`.

## API Documentation

Access the Swagger UI for interactive API documentation at:

   ```bash
   http://localhost:3000/api
   ```

## Endpoints

### Intract Endpoints

Microservice provides multiple endpoints to support the functionalities required by `https://app.intract.io` and other integrating services.

#### 1. `POST /api/v1/intract/data`

- **Description:** Fetch data based on a single identifier such as address, Twitter ID, Discord ID, Telegram ID, or email.
- **Headers:**
   - `Content-Type: application/json`
   - `Authorization: Bearer <ACCESS_TOKEN>`
- **Request Body:**
  ```json
  {
    "address": "your-address"
  }

> Only one of the following fields should be provided:
> address, twitter, discord, telegram, email.

### Responses:

- **200 OK**:

   ```json
   {
      "error": {
         "code": 0,
         "message": ""
      },
      "data": {
         "result": true
      }
   }
   ```

- **400 Bad Request:**

- ```json
   {
     "error": {
       "code": 400,
       "message": "Only one of address, twitter, discord, telegram, or email must be provided"
     },
     "data": {
       "result": false
     }
   }
   ```

- **401 Unauthorized:**
   ```josn
   {
     "error": {
       "code": 401,
       "message": "Invalid access token"
     },
     "data": {
       "result": false
     }
   }
   ```

- **404 Not Found:**
   
  ```josn
  {
    "error": {
      "code": 404,
      "message": "Data not found"
    },
    "data": {
      "result": false
    }
  }
   ```


