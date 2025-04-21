# Final Project Timi Time Accounting(Iteration) with React hooks

## Author

**Shuhan Dong**

## Class Link

CS5610 Web_Development [Course Page](https://johnguerra.co/classes/webDevelopment_spring_2025/)

Instructor: John Alexis Guerra Gómez [Profile](https://johnguerra.co/)

---

## Project Objective

**Timi Time Accounting** is a full-stack web application designed for personal and family financial management, built using Node.js, Express 5, and MongoDB for the backend, and React with hooks for the frontend. The system is client-side rendered, using AJAX to asynchronously interact with the backend API, ensuring a responsive and seamless user experience.

---

## Project Screenshot

![Screenshot1](https://raw.githubusercontent.com/hansama0902/Project3-Full-stack-application-with-React-hooks-_Timi-Time-Accounting/1978fc45719c795f8517db4f77c778ff96d647ad/screenshot/screen1.png)

![Screenshot2](https://raw.githubusercontent.com/hansama0902/Project3-Full-stack-application-with-React-hooks-_Timi-Time-Accounting/1978fc45719c795f8517db4f77c778ff96d647ad/screenshot/screen2.png)

![Screenshot3](https://raw.githubusercontent.com/hansama0902/Project3-Full-stack-application-with-React-hooks-_Timi-Time-Accounting/1978fc45719c795f8517db4f77c778ff96d647ad/screenshot/screen3.png)

![Screenshot4](https://raw.githubusercontent.com/hansama0902/Project3-Full-stack-application-with-React-hooks-_Timi-Time-Accounting/1978fc45719c795f8517db4f77c778ff96d647ad/screenshot/screen4.png)

---

## Description

Timi Time Accounting provides users with an intuitive interface to:

- Switch between multiple user accounts.
- Add, edit, and delete financial transactions.
- View a dashboard summarizing total income, expenses, and balance.
- Set and monitor savings goals.
- Visualize financial data through chart Reports.

---

## Features

- **Account Management:** Easily switch between different user accounts.
- **Transaction Tracking:** Add, edit, and delete income and expense entries.
- **Dashboard Overview:** View summaries of financial data, including total income, expenses, and current balance.
- **Savings Goals:** Set and track progress toward savings objectives.
- **Data Visualization:** Interactive charts to analyze financial trends.

---

## Prerequisites

Before running this project locally, ensure you have the following installed:

- Node.js (v14 or higher)
- React
- mongodb Atlas
- npm
- Git
- Vercel

---

## Installation

Follow these steps to set up the project locally:

1. **Clone the Repository**

   ```bash
   git clone https://github.com/hansama0902/Project3-Full-stack-application-with-React-hooks-_Timi-Time-Accounting.git
   ```

2. **Navigate to the Project Directory**

   ```bash
   cd Project3-Full-stack-application-with-React-hooks-_Timi-Time-Accounting
   ```

3. **Install Backend Dependencies**

   ```bash
   npm install
   ```

4. **Set Up Environment Variables**

   Create a `.env` file in the root directory with the following content:

   ```env
   MONGO_URI=your_mongodb_connection_string
   ```

   Replace `your_mongodb_connection_string` with your actual MongoDB Atlas URI.

5. **Install Frontend Dependencies**

   Navigate to the `frontend` directory and install its dependencies:

   ```bash
   cd frontend
   npm install
   ```

6. **Build the Frontend**

   While in the `frontend` directory, build the React application:

   ```bash
   npm run build
   ```

   This will create a `build` directory containing the production-ready frontend files.

7. **Start the Backend Server**

   Return to the root directory and start the backend server:

   ```bash
   cd ..
   npm start
   ```

   The server will serve both the backend API and the frontend application.

---

## Usage

Once the server is running:

- Open your web browser and navigate to `http://localhost:3000` to access the application.
- Use the interface to manage accounts, add transactions, set savings goals, and visualize financial data.

---

## Database Schema

The application uses MongoDB with two main collections:

### Collection: `users`

Stores user profiles and their savings goals.

```json
{
  _id: ObjectId,
  userName: String,
  goalAmount: Number
}
```

### Collection: `transactions`

Stores individual financial transactions.

```json
{
  _id: ObjectId,
  amount: Number,
  category: String,
  description: String,
  type: "income" | "expense",
  userName: String,
  date: String (ISO format)
}
```

### 1k synthetic records

![Screenshot5](https://raw.githubusercontent.com/hansama0902/Project3-Full-stack-application-with-React-hooks-_Timi-Time-Accounting/main/screenshot/screen5.png)

---

### CRUD Operations Overview

The application implements full CRUD (Create, Read, Update, Delete) functionality for both `users` and `transactions` collections:

#### Users Collection

- **Create:** Users are created via the user management modal using the `createUser` API.
- **Read:** All users are fetched using the `fetchUsers` API for the account switcher.
- **Update:** Users can update their savings goal using the `updateUserGoal` API.
- **Delete:** Users can be deleted from the user management modal via the `deleteUser` API.

#### Transactions Collection

- **Create:** New income or expense records are added through the `AddForm` using the `createTransaction` API.
- **Read:** All transactions for the selected user are retrieved using the `fetchTransactions` API.
- **Update:** Existing transactions can be edited via the `handleUpdateTransaction` function using the `updateTransaction` API.
- **Delete:** Transactions are deleted using the `deleteTransaction` API when a user clicks the delete button in the transaction list.

---

## Technologies Used

- **React (Hooks)**
- **React Bootstrap 5**
- **Recharts**
- **PropTypes**
- **CSS Modules**
- **JavaScript**
- **Node.js**
- **Express**
- **MongoDB**
- **MongoDB Atlas**
- **Bootstrap 5**
- **ESLint6 & Prettier for Code Quality**
- **Vercel**

---

## Usage of GenAI

**Used ChatGPT 4o for the following use cases and prompts:**

**Use case: Real-time state synchronization after transactions**  
Prompt:
Dashboard and progress bar don’t update immediately after adding/editing a transaction. I’m using useDashboard() with memoized data—how can I force components to re-render and recalculate values correctly?

**Use case: Delayed rendering after switching users**  
Prompt:
After switching accounts via AccountSwitcher, components like GoalProgress and Dashboard sometimes show outdated data. How do I ensure all hooks reset state properly and remove stale data when the user changes?

**Use case: Designing a RESTful API without Mongoose**  
Prompt:
I’m building a RESTful API using the native MongoDB driver instead of Mongoose. What are best practices for validating ObjectId, managing schema consistency, and avoiding redundancy in CRUD operations?

**Use case: Setting up PropTypes in React**  
Prompt:
How to define PropTypes for my React components to validate incoming props and prevent runtime errors?

**Use case: Running React frontend with Express backend**  
Prompt:
How can I serve a React frontend app through an Express backend in a full-stack project? What are the key steps for setting up static file serving in production?

**Use case: Understanding React Hooks**  
Prompt:
What are React Hooks, and how do they replace class-based lifecycle methods? Specifically, how are useState, useEffect, and custom hooks used in real-world applications?

**Use case: Generating fake transaction data for testing**  
Prompt:
How can I programmatically generate 1000 fake transaction records (with random amount, category, date, type) for testing my accounting app using JavaScript or a script?

---

## View the project

Visit the project at: [project3-full-stack-application-with-reac-hansama0902s-projects.vercel.app/
](https://project3-full-stack-application-with-reac-hansama0902s-projects.vercel.app/)

---

## Resourse

1.[Video](https://youtu.be/17Cz_8BwXJw)  
2.[Design Doc](https://github.com/hansama0902/Project3-Full-stack-application-with-React-hooks-_Timi-Time-Accounting/blob/main/Design%20Document/Design%20Document_TimiTimeAccounting%20.pdf)  
3.[Slides](https://docs.google.com/presentation/d/1hs0jHp_RIUyCkfcKPJZbuiJy0dwSl38H9EwXYTE8oII/edit?usp=sharing)

---

## License

This project is licensed under the **MIT License**.
