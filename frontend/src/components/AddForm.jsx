// AddForm.jsx
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Button, Form, ToggleButtonGroup, ToggleButton, Row, Col } from "react-bootstrap";
import "../stylesheets/AddForm.css";

const AddForm = ({
  onTransactionAdded,
  onTransactionUpdated,
  userName,
  editingTransaction,
}) => {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [isIncome, setIsIncome] = useState(true);

  useEffect(() => {
    if (editingTransaction) {
      setAmount(editingTransaction.amount);
      setCategory(editingTransaction.category);
      setDescription(editingTransaction.description);
      setDate(editingTransaction.date?.slice(0, 10));
      setIsIncome(editingTransaction.type === "income");
    } else {
      setAmount("");
      setCategory("");
      setDescription("");
      setDate("");
      setIsIncome(true);
    }
  }, [editingTransaction]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!amount || !category || !description || !date) {
      alert("Please fill in all fields.");
      return;
    }

    const transactionData = {
      amount: Number(amount),
      category,
      description,
      type: isIncome ? "income" : "expense",
      userName,
      date,
    };

    try {
      if (editingTransaction) {
        await onTransactionUpdated(editingTransaction._id, transactionData);
      } else {
        await onTransactionAdded(transactionData);
      }

      setAmount("");
      setCategory("");
      setDescription("");
      setDate("");
      setIsIncome(true);
    } catch (error) {
      console.error("Error submitting transaction:", error);
    }
  };

  return (
    <div className="add-form-wrapper">
      <h2 className="add-form-title">
        {editingTransaction ? "Edit Transaction" : "Add New Transaction"}
      </h2>
      
      <Form onSubmit={handleSubmit} className="add-form-container">
        <div className="toggle-group-wrapper">
          <ToggleButtonGroup
            type="radio"
            name="transactionType"
            value={isIncome}
            onChange={(val) => setIsIncome(val)}
            className="toggle-group"
          >
            <ToggleButton 
              id="tbg-radio-income" 
              variant="outline-success" 
              value={true}
              className={isIncome ? "active" : ""}
            >
              Income
            </ToggleButton>
            <ToggleButton 
              id="tbg-radio-expense" 
              variant="outline-danger" 
              value={false}
              className={!isIncome ? "active" : ""}
            >
              Expense
            </ToggleButton>
          </ToggleButtonGroup>
        </div>

        <Row>
          <Col md={6}>
            <Form.Group className="add-form-group">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                className="add-form-control"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                min="0"
                step="0.01"
                required
              />
            </Form.Group>
          </Col>
          
          <Col md={6}>
            <Form.Group className="add-form-group">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                className="add-form-control"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="add-form-group">
          <Form.Label>Category</Form.Label>
          <Form.Control
            type="text"
            className="add-form-control"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g., Rent, Salary, Groceries"
            required
          />
        </Form.Group>

        <Form.Group className="add-form-group">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={2}
            className="add-form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add details"
            required
          />
        </Form.Group>

        <div className="add-form-actions">
          {editingTransaction && (
            <Button
              type="button"
              variant="outline-secondary"
              className="add-form-cancel-button"
              onClick={() => {
                setAmount("");
                setCategory("");
                setDescription("");
                setDate("");
                setIsIncome(true);
                // Assuming you have a function to cancel editing
                // onCancelEdit();
              }}
            >
              Cancel
            </Button>
          )}
          
          <Button
            type="submit"
            variant={isIncome ? "success" : "danger"}
            className="add-form-submit-button"
          >
            {editingTransaction
              ? "Update Transaction"
              : isIncome
                ? "Add Income"
                : "Add Expense"}
          </Button>
        </div>
      </Form>
    </div>
  );
};

AddForm.propTypes = {
  onTransactionAdded: PropTypes.func.isRequired,
  onTransactionUpdated: PropTypes.func.isRequired,
  userName: PropTypes.string.isRequired,
  editingTransaction: PropTypes.object,
};

export default AddForm;
