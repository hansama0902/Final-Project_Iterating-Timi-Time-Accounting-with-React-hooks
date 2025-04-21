// GoalProgress.jsx
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Card, Button, Form, ProgressBar, Row, Col } from "react-bootstrap";
import useGoal from "../hooks/useGoal";
import "../stylesheets/GoalProgress.css";

const GoalProgress = ({ userId, balance }) => {
  const { goalAmount, handleUpdateGoal, loading } = useGoal(userId);
  const [newGoal, setNewGoal] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setNewGoal(goalAmount || "");
  }, [goalAmount]);

  if (loading) {
    return (
      <div className="goal-loading">
        <div className="spinner"></div>
        <p>Loading savings goal...</p>
      </div>
    );
  }
  
  if (!userId) {
    return (
      <div className="goal-no-user">
        <p>Please select a user to view saving goals.</p>
      </div>
    );
  }

  const progress =
    goalAmount > 0 && balance > 0
      ? Math.min((balance / Number(goalAmount)) * 100, 100)
      : 0;
  
  const handleSubmit = (e) => {
    e.preventDefault();
    handleUpdateGoal(Number(newGoal));
    setIsEditing(false);
  };

  return (
    <Card className="goal-card">
      <Card.Body>
        <div className="goal-header">
          <h2 className="goal-title">Savings Goal</h2>
          {progress >= 100 && (
            <span className="goal-achieved-badge">Goal Achieved!</span>
          )}
        </div>
        
        <Row className="goal-info-row">
          <Col md={6} className="goal-amount-col">
            <div className="goal-amount-container">
              <h3 className="goal-amount-label">Target</h3>
              <div className="goal-amount-value">${goalAmount || 0}</div>
              <div className="goal-balance-value">
                Current Balance: <span className="balance-highlight">${balance.toFixed(2)}</span>
              </div>
            </div>
          </Col>
          
          <Col md={6} className="goal-progress-col">
            <div className="goal-progress-container">
              <div className="progress-header">
                <h3 className="progress-label">Progress</h3>
                <span className="progress-percentage">{Math.round(progress)}%</span>
              </div>
              <ProgressBar
                now={progress}
                className="goal-progress-bar"
                variant={progress >= 100 ? "success" : "primary"}
              />
              <div className="progress-info">
                {progress < 100 ? (
                  <span>
                    Need <strong>${Math.max(0, (goalAmount - balance).toFixed(2))}</strong> more to reach goal
                  </span>
                ) : (
                  <span className="goal-achieved-text">Goal achieved! Well done!</span>
                )}
              </div>
            </div>
          </Col>
        </Row>
        
        <div className="goal-update-section">
          {isEditing ? (
            <Form onSubmit={handleSubmit}>
              <Form.Group className="goal-form-group">
                <Form.Label className="goal-form-label">Update Goal Amount</Form.Label>
                <div className="goal-input-group">
                  <Form.Control
                    type="number"
                    min="0"
                    step="100"
                    placeholder="Enter new goal amount"
                    value={newGoal}
                    onChange={(e) => setNewGoal(e.target.value)}
                    className="goal-input"
                  />
                  <div className="goal-form-buttons">
                    <Button 
                      type="button" 
                      variant="outline-secondary" 
                      className="goal-cancel-button"
                      onClick={() => {
                        setNewGoal(goalAmount || "");
                        setIsEditing(false);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      variant="primary" 
                      className="goal-save-button"
                      disabled={!newGoal || newGoal === goalAmount}
                    >
                      Save
                    </Button>
                  </div>
                </div>
              </Form.Group>
            </Form>
          ) : (
            <Button
              onClick={() => setIsEditing(true)}
              className="goal-edit-button"
              variant="outline-primary"
            >
              Update Goal
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

GoalProgress.propTypes = {
  userId: PropTypes.string.isRequired,
  balance: PropTypes.number.isRequired,
};

export default GoalProgress;
