import PropTypes from "prop-types";
import { Table, Button } from "react-bootstrap";
import "../stylesheets/TransactionList.css";

const TransactionList = ({ transactions, onDelete, onEdit, loading }) => {
  if (loading) return <p className="text-center">Loading transactions...</p>;

  return (
    <div className="transaction-container mt-4">
      <h3 className="transaction-title">Transaction History</h3>

      {transactions.length === 0 ? (
        <p className="text-danger text-center">No Transactions Found</p>
      ) : (
        <Table striped bordered hover responsive className="transaction-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Category</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction._id}>
                <td
                  className={
                    transaction.type === "income"
                      ? "text-success"
                      : "text-danger"
                  }
                >
                  {transaction.type === "income" ? "[Income]" : "[Expense]"}
                </td>
                <td>{transaction.category}</td>
                <td>{transaction.description}</td>
                <td
                  className={`transaction-amount ${
                    transaction.type === "income"
                      ? "text-success"
                      : "text-danger"
                  }`}
                >
                  {transaction.type === "income"
                    ? `+ $${transaction.amount}`
                    : `- $${transaction.amount}`}
                </td>
                <td>
                  {transaction.date
                    ? transaction.date.slice(0, 10).replace(/-/g, "/")
                    : "N/A"}
                </td>

                <td>
                  <div className="transaction-actions">
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={() => onEdit(transaction)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => onDelete(transaction._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
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
