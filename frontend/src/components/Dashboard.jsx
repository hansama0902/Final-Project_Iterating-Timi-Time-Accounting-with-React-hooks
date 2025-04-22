import PropTypes from "prop-types";
import { Card, Container, Row, Col } from "react-bootstrap";
import "../stylesheets/Dashboard.css";

const Dashboard = ({ totalIncome, totalExpenses }) => {
  const balance = totalIncome - totalExpenses;

  return (
    <Container className="dashboard-container mt-4">
      <h2 className="dashboard-heading">Financial Summary</h2>
      <Row>
        <Col md={4} className="mb-3">
          <Card className="dashboard-card income-card">
            <Card.Body>
              <Card.Title className="dashboard-title">Total Income</Card.Title>
              <Card.Text className="dashboard-amount income-amount">
                ${totalIncome.toFixed(2)}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-3">
          <Card className="dashboard-card expense-card">
            <Card.Body>
              <Card.Title className="dashboard-title">
                Total Expenses
              </Card.Title>
              <Card.Text className="dashboard-amount expense-amount">
                ${totalExpenses.toFixed(2)}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-3">
          <Card className="dashboard-card balance-card">
            <Card.Body>
              <Card.Title className="dashboard-title">Balance</Card.Title>
              <Card.Text
                className={`dashboard-amount ${
                  balance >= 0 ? "balance-positive" : "balance-negative"
                }`}
              >
                {balance < 0
                  ? `−$${Math.abs(balance).toFixed(2)}`
                  : `$${balance.toFixed(2)}`}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

Dashboard.propTypes = {
  totalIncome: PropTypes.number.isRequired,
  totalExpenses: PropTypes.number.isRequired,
};

export default Dashboard;
