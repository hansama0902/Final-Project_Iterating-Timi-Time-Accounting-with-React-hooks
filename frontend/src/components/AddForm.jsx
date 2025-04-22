import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Button, Form, Row, Col } from "react-bootstrap";
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
  
  // Refs for keyboard navigation
  const amountInputRef = useRef(null);
  const incomeButtonRef = useRef(null);
  const expenseButtonRef = useRef(null);
  const submitButtonRef = useRef(null);
  const cancelButtonRef = useRef(null);

  useEffect(() => {
    if (editingTransaction) {
      setAmount(editingTransaction.amount);
      setCategory(editingTransaction.category);
      setDescription(editingTransaction.description);
      setDate(editingTransaction.date?.slice(0, 10));
      setIsIncome(editingTransaction.type === "income");
      
      // Focus amount input when editing
      setTimeout(() => {
        amountInputRef.current?.focus();
      }, 100);
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
  
  // Handle keyboard navigation in toggle buttons
  const handleIncomeKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      expenseButtonRef.current?.focus();
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsIncome(true);
    }
  };
  
  const handleExpenseKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      incomeButtonRef.current?.focus();
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsIncome(false);
    }
  };
  
  // Handle cancel button with keyboard
  const handleCancel = () => {
    setAmount("");
    setCategory("");
    setDescription("");
    setDate("");
    setIsIncome(true);
    // If you have a cancel editing function, call it here
  };

  return (
    <div className="add-form-wrapper">
      <h2 className="add-form-title">
        {editingTransaction ? "Edit Transaction" : "Add New Transaction"}
      </h2>
      
      <Form onSubmit={handleSubmit} className="add-form-container">
        <div className="toggle-group-wrapper">
          <div className="toggle-group" role="group">
            <button 
              ref={incomeButtonRef}
              type="button"
              className={`btn ${isIncome ? 'btn-success' : 'btn-outline-success'}`}
              onClick={() => setIsIncome(true)}
              onKeyDown={handleIncomeKeyDown}
              tabIndex={0}
            >
              Income
            </button>
            <button 
              ref={expenseButtonRef}
              type="button"
              className={`btn ${!isIncome ? 'btn-danger' : 'btn-outline-danger'}`}
              onClick={() => setIsIncome(false)}
              onKeyDown={handleExpenseKeyDown}
              tabIndex={0}
            >
              Expense
            </button>
          </div>
        </div>

        <Row>
          <Col md={6}>
            <Form.Group className="add-form-group">
              <Form.Label htmlFor="amount-input">Amount</Form.Label>
              <Form.Control
                id="amount-input"
                ref={amountInputRef}
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
              <Form.Label htmlFor="date-input">Date</Form.Label>
              <Form.Control
                id="date-input"
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
          <Form.Label htmlFor="category-input">Category</Form.Label>
          <Form.Control
            id="category-input"
            type="text"
            className="add-form-control"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g., Rent, Salary, Groceries"
            required
          />
        </Form.Group>

        <Form.Group className="add-form-group">
          <Form.Label htmlFor="description-input">Description</Form.Label>
          <Form.Control
            id="description-input"
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
              ref={cancelButtonRef}
              type="button"
              variant="outline-secondary"
              className="add-form-cancel-button"
              onClick={handleCancel}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCancel();
                }
              }}
              tabIndex={0}
            >
              Cancel
            </Button>
          )}
          
          <Button
            ref={submitButtonRef}
            type="submit"
            variant={isIncome ? "success" : "danger"}
            className="add-form-submit-button"
            tabIndex={0}
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
