import { useState, useEffect } from "react";
import { fetchUser, updateUserGoal } from "../utils/api";

const useGoal = (userName) => {
  const [goalAmount, setGoalAmount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserGoal = async () => {
      if (!userName) {
        console.warn("No user selected, skipping goal fetch.");
        setGoalAmount(0);
        setLoading(false);
        return;
      }

      try {
        const userData = await fetchUser(userName);
        if (userData && userData.goalAmount !== undefined) {
          setGoalAmount(userData.goalAmount);
        } else {
          console.warn(` No goal found for user: ${userName}`);
        }
      } catch (error) {
        console.error("Error fetching goal:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserGoal();
  }, [userName]);

  const handleUpdateGoal = async (newGoalAmount) => {
    if (!userName) return;

    if (newGoalAmount < 0) {
      alert("Goal amount cannot be negative.");
      return;
    }

    try {
      await updateUserGoal(userName, newGoalAmount);
      setGoalAmount(newGoalAmount);
    } catch (error) {
      console.error("Error updating goal:", error);
    }
  };

  return { goalAmount, handleUpdateGoal, loading };
};

export default useGoal;
