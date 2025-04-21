import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Card, Button, Form, ProgressBar } from "react-bootstrap";
import useGoal from "../hooks/useGoal";
import "../stylesheets/GoalProgress.css";

const GoalProgress = ({ userId, balance }) => {
  const { goalAmount, handleUpdateGoal, loading } = useGoal(userId);
  const [newGoal, setNewGoal] = useState("");

  useEffect(() => {
    setNewGoal(goalAmount || "");
  }, [goalAmount]);

  if (loading) return <p>Loading...</p>;
  if (!userId) return <p className="text-muted">Please select a user.</p>;

  const progress =
    goalAmount > 0 && balance > 0
      ? Math.min((balance / Number(goalAmount)) * 100, 100)
      : 0;

  return (
    <Card className="goal-card">
      <h4 className="goal-title">Saving Goal</h4>
      <p className="goal-amount">
        <strong>Goal Amount:</strong> ${goalAmount || 0}
      </p>

      <ProgressBar
        now={progress}
        label={`${Math.round(progress)}%`}
        className="goal-progress"
        variant={progress >= 100 ? "success" : "info"}
      />

      <Form.Control
        type="number"
        placeholder="Set Goal Amount"
        value={newGoal}
        onChange={(e) => setNewGoal(e.target.value)}
        className="goal-input"
      />

      <Button
        onClick={() => handleUpdateGoal(Number(newGoal))}
        className="goal-button"
        variant="primary"
      >
        Set Goal
      </Button>
    </Card>
  );
};

GoalProgress.propTypes = {
  userId: PropTypes.string.isRequired,
  balance: PropTypes.number.isRequired,
};

export default GoalProgress;
