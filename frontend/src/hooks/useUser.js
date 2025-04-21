import { useState, useEffect } from "react";
import { fetchUsers } from "../utils/api";

const useUser = () => {
  const [userList, setUserList] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const users = await fetchUsers();
        const userNames = users.map((user) => user.userName);
        setUserList(userNames);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    loadUsers();
  }, []);

  return { userList, currentUser, setCurrentUser };
};

export default useUser;
