const API_URL = "/api"; // vite

export const fetchTransactions = async (userName) => {
  if (!userName) {
    console.warn("fetchTransactions called with empty userName");
    return [];
  }

  try {
    const response = await fetch(`${API_URL}/transaction/user/${userName}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch transactions: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }
};

export const createTransaction = async (transaction) => {
  if (!transaction.userName) {
    console.warn("createTransaction called with empty userName");
    return null;
  }

  try {
    const userResponse = await fetch(`${API_URL}/user/${transaction.userName}`);
    if (!userResponse.ok) {
      throw new Error("User does not exist, cannot create transaction");
    }

    const response = await fetch(`${API_URL}/transaction`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(transaction),
    });

    if (!response.ok) throw new Error("Failed to create transaction");
    return await response.json();
  } catch (error) {
    console.error("Error adding transaction:", error);
    return null;
  }
};

export const updateTransaction = async (transactionId, updatedData) => {
  if (!transactionId) {
    console.warn("updateTransaction called with empty transactionId");
    return null;
  }

  try {
    const response = await fetch(`${API_URL}/transaction/${transactionId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      throw new Error("Failed to update transaction");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating transaction:", error);
    return null;
  }
};

export const deleteTransaction = async (id) => {
  if (!id) {
    console.warn("deleteTransaction called with empty ID");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/transaction/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete transaction");
  } catch (error) {
    console.error("Error deleting transaction:", error);
  }
};

export const fetchUsers = async () => {
  try {
    const response = await fetch(`${API_URL}/user`);
    if (!response.ok) throw new Error("Failed to fetch users");
    return await response.json();
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

export const fetchUser = async (userId) => {
  if (!userId) {
    console.warn("fetchUser called with empty userId");
    return null;
  }

  try {
    const response = await fetch(`${API_URL}/user/${userId}`);
    if (!response.ok) throw new Error("Failed to fetch user data");
    return await response.json();
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};

export const updateUserGoal = async (userId, goalAmount) => {
  try {
    const response = await fetch(`${API_URL}/user/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ goalAmount }),
    });
    if (!response.ok) throw new Error("Failed to update user goal");
    return await response.json();
  } catch (error) {
    console.error("Error updating user goal:", error);
    return null;
  }
};

export const createUser = async (userName) => {
  if (!userName) {
    console.warn("createUser called with empty userName");
    return null;
  }

  try {
    const response = await fetch(`${API_URL}/user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        userName, 
        goalAmount: 5000
      }),
    });

    if (!response.ok) throw new Error("Failed to create user");
    return await response.json();
  } catch (error) {
    console.error("Error creating user:", error);
    return null;
  }
};

export const deleteUser = async (userId) => {
  if (!userId) {
    console.warn("deleteUser called with empty userId");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/user/${userId}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete user");
  } catch (error) {
    console.error("Error deleting user:", error);
  }
};
