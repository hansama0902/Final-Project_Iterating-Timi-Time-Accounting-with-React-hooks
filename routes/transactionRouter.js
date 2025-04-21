import { Router } from "express";
import { ObjectId } from "mongodb";
import { getCollection } from "../db/database.js";

const router = Router();

// GET
router.get("/", async (req, res) => {
  try {
    const transactionCollection = await getCollection("transaction");
    const transactions = await transactionCollection.find().toArray();
    res.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// GET transactions for a user
router.get("/user/:userName", async (req, res) => {
  try {
    const transactionCollection = await getCollection("transaction");
    const transactions = await transactionCollection
      .find({ userName: req.params.userName })
      .toArray();
    res.json(transactions);
  } catch (error) {
    console.error("Error fetching user transactions:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// POST
router.post("/", async (req, res) => {
  try {
    const { amount, category, description, type, userName, date } = req.body;

    if (!amount || !category || !description || !type || !userName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newTransaction = {
      amount: Number(amount),
      category,
      description,
      type,
      userName,
      date: String(date).slice(0, 10),
    };

    const transactionCollection = await getCollection("transaction");
    const result = await transactionCollection.insertOne(newTransaction);
    res.status(201).json({ ...newTransaction, _id: result.insertedId });
  } catch (error) {
    console.error("Error inserting transaction:", error);
    res.status(500).json({ message: "Failed to insert transaction" });
  }
});

// PUT
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const collection = await getCollection("transaction");

    console.log("Received PUT request for ID:", id);

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const _id = new ObjectId(id);

    const existing = await collection.findOne({ _id });
    if (!existing) {
      console.warn("ID not found in DB:", _id);
      return res.status(404).json({ message: "Transaction not found" });
    } else {
      console.log("Found transaction before update:", existing);
    }

    const { amount, category, description, type, userName, date } = req.body;

    const updatedData = {
      amount: Number(amount),
      category,
      description,
      type,
      userName,
      date: String(date).slice(0, 10),
    };

    const result = await collection.findOneAndUpdate(
      { _id },
      { $set: updatedData },
      { returnDocument: "after" },
    );
    res.status(200).json(result.value || { ...updatedData, _id });
  } catch (err) {
    console.error("Error in PUT /transaction/:id:", err);
    res.status(500).json({ message: "Failed to update transaction" });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    const transactionCollection = await getCollection("transaction");

    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid transaction ID" });
    }

    const result = await transactionCollection.deleteOne({
      _id: new ObjectId(req.params.id),
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error(" Error deleting transaction:", error);
    res.status(500).json({ message: "Failed to delete transaction" });
  }
});

export default router;
