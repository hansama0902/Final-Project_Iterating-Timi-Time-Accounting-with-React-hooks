import { useState, useEffect } from "react";
import {
  fetchTransactions,
  deleteTransaction,
  createTransaction,
  updateTransaction,
} from "../utils/api";

const useTransactions = (userName) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!userName) {
      console.warn("No user selected, skipping transaction fetch.");
      setTransactions([]);
      setLoading(false);
      return;
    }

    console.log("Fetching transactions for:", userName);
    const loadTransactions = async () => {
      setLoading(true); // ensure loading is true before fetch
      try {
        const userTransactions = await fetchTransactions(userName);
        console.log("Fetched Transactions:", userTransactions);
        setTransactions(userTransactions);
      } catch (error) {
        console.error("Error loading transactions:", error);
        setTransactions([]); // fallback to empty if error
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, [userName]);

  const handleDeleteTransaction = async (transactionId) => {
    try {
      await deleteTransaction(transactionId);
      setTransactions((prev) => prev.filter((t) => t._id !== transactionId));
      setSuccessMessage("Transaction deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 2000);
    } catch (error) {
      console.error(" Error deleting transaction:", error);
    }
  };

  const handleAddTransaction = async (newTransaction) => {
    try {
      const addedTransaction = await createTransaction(newTransaction);
      if (addedTransaction) {
        setTransactions((prev) => [...prev, addedTransaction]);
        setSuccessMessage("Transaction added successfully!");
        setTimeout(() => setSuccessMessage(""), 2000);
      } else {
        console.warn("No transaction was added.");
      }
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };
  const handleUpdateTransaction = async (transactionId, updatedTransaction) => {
    try {
      const updated = await updateTransaction(
        transactionId,
        updatedTransaction,
      );
      if (updated) {
        setTransactions((prev) =>
          prev.map((t) =>
            t._id.toString() === transactionId.toString() ? updated : t,
          ),
        );
        setSuccessMessage("Transaction updated successfully!");
        setTimeout(() => setSuccessMessage(""), 2000);
      } else {
        console.warn("Update returned no result.");
      }
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };

  return {
    transactions,
    setTransactions,
    handleDeleteTransaction,
    handleAddTransaction,
    handleUpdateTransaction,
    loading,
    successMessage,
  };
};

export default useTransactions;
