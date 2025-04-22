import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { Table, Button, Badge, Form, InputGroup } from "react-bootstrap";
import "../stylesheets/TransactionList.css";

const TransactionList = ({ transactions, onDelete, onEdit, loading }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const searchInputRef = useRef(null);
  
  useEffect(() => {
    function handleKeyDown(e) {
      // Press / to focus search
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    }
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  if (loading) return (
    <div className="transactions-loading">
      <div className="spinner"></div>
      <p>Loading transactions...</p>
    </div>
  );

  // Filter transactions based on search and filter
  const filteredTransactions = transactions.filter(transaction => {
    // Type filter
    if (filterType !== "all" && transaction.type !== filterType) return false;
    
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        transaction.description.toLowerCase().includes(searchLower) ||
        transaction.category.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });

  return (
    <div className="transaction-container">
      <div className="transaction-header">
        <h2 className="transaction-title">Transaction History</h2>
        <div className="transaction-filters">
          <InputGroup className="search-group">
            <InputGroup.Text className="search-icon">
              <i className="fa fa-search"></i>
            </InputGroup.Text>
            <Form.Control
              ref={searchInputRef}
              type="text"
              placeholder="Search by description or category (press / to focus)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </InputGroup>
          
          <div className="filter-buttons">
            <Button
              variant={filterType === "all" ? "primary" : "outline-primary"}
              className="filter-btn"
              onClick={() => setFilterType("all")}
              tabIndex={0}
            >
              All
            </Button>
            <Button
              variant={filterType === "income" ? "success" : "outline-success"}
              className="filter-btn"
              onClick={() => setFilterType("income")}
              tabIndex={0}
            >
              Income
            </Button>
            <Button
              variant={filterType === "expense" ? "danger" : "outline-danger"}
              className="filter-btn"
              onClick={() => setFilterType("expense")}
              tabIndex={0}
            >
              Expenses
            </Button>
          </div>
        </div>
      </div>

      {filteredTransactions.length === 0 ? (
        <div className="no-transactions">
          <p>No transactions found</p>
          <small>
            {searchTerm || filterType !== "all" 
              ? "Try adjusting your search or filters" 
              : "Add a transaction to get started"}
          </small>
        </div>
      ) : (
        <>
          <div className="transaction-summary">
            <Badge bg="primary" className="transaction-badge">
              {filteredTransactions.length} Transaction{filteredTransactions.length !== 1 ? 's' : ''}
            </Badge>
          </div>
          
          <div className="table-responsive">
            <Table className="transaction-table">
              <thead>
                <tr>
                  <th className="type-column">Type</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th className="amount-column">Amount</th>
                  <th>Date</th>
                  <th className="actions-column">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction._id} className={transaction.type === "income" ? "income-row" : "expense-row"}>
                    <td>
                      <Badge 
                        bg={transaction.type === "income" ? "success" : "danger"}
                        className="transaction-type-badge"
                      >
                        {transaction.type === "income" ? "INCOME" : "EXPENSE"}
                      </Badge>
                    </td>
                    <td className="category-cell">
                      <span className="category-text">{transaction.category}</span>
                    </td>
                    <td className="description-cell">{transaction.description}</td>
                    <td className={`amount-cell ${
                      transaction.type === "income" ? "income-amount" : "expense-amount"
                    }`}>
                      <span className="amount-prefix">
                        {transaction.type === "income" ? "+" : "-"}
                      </span>
                      <span className="amount-value">
                        ${Number(transaction.amount).toFixed(2)}
                      </span>
                    </td>
                    <td className="date-cell">
                      {transaction.date
                        ? new Date(transaction.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric"
                          })
                        : "N/A"}
                    </td>
                    <td>
                      <div className="transaction-actions">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="edit-btn"
                          onClick={() => onEdit(transaction)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              onEdit(transaction);
                            }
                          }}
                          tabIndex={0}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          className="delete-btn"
                          onClick={() => onDelete(transaction._id)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              onDelete(transaction._id);
                            }
                          }}
                          tabIndex={0}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </>
      )}
    </div>
  );
};

TransactionList.propTypes = {
  transactions: PropTypes.array.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default TransactionList;