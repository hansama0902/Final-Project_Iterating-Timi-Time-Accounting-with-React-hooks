import PropTypes from "prop-types";
import { Card, Container, Row, Col } from "react-bootstrap";
import "../stylesheets/Dashboard.css";

const Dashboard = ({ totalIncome, totalExpenses }) => {
  const balance = totalIncome - totalExpenses;

  return (
    <Container className="mt-4">
      <Row>
        <Col md={4} className="mb-3">
          <Card className="dashboard-card">
            <Card.Title className="dashboard-title">Total Income</Card.Title>
            <Card.Text className="dashboard-amount text-success">
              ${totalIncome.toFixed(2)}
            </Card.Text>
          </Card>
        </Col>

        <Col md={4} className="mb-3">
          <Card className="dashboard-card">
            <Card.Title className="dashboard-title">Total Expenses</Card.Title>
            <Card.Text className="dashboard-amount text-danger">
              ${totalExpenses.toFixed(2)}
            </Card.Text>
          </Card>
        </Col>

        <Col md={4} className="mb-3">
          <Card className="dashboard-card">
            <Card.Title className="dashboard-title">Balance</Card.Title>
            <Card.Text
              className={`dashboard-amount ${
                balance >= 0 ? "text-primary" : "text-danger"
              }`}
            >
              ${balance.toFixed(2)}
            </Card.Text>
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
