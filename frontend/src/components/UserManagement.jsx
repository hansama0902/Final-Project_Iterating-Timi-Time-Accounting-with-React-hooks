// UserManagement.jsx 修改
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Modal, Button, Form, ListGroup, Alert, Badge } from "react-bootstrap"; // 添加Badge导入
import { fetchUsers, createUser, deleteUser } from "../utils/api";

const UserManagement = ({ show, onClose, onUserChange, currentUser }) => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const usersData = await fetchUsers();
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    if (show) loadUsers();
  }, [show]);

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 2000);
  };
  
  const handleAddUser = async () => {
    if (newUser.trim() === "" || users.some(u => u.userName === newUser)) return;
    try {
      await createUser(newUser, isAdmin);

      const updatedUsersData = await fetchUsers();
      setUsers(updatedUsersData);

      onUserChange(newUser);

      showSuccessMessage(`User "${newUser}" added successfully!`);
      setNewUser("");
      setIsAdmin(false);
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const handleDeleteUser = async (user) => {
    try {
      await deleteUser(user.userName);

      const updatedUsersData = await fetchUsers();
      setUsers(updatedUsersData);

      showSuccessMessage(`User "${user.userName}" deleted successfully!`);

      if (user.userName === currentUser) {
        const firstUser = updatedUsersData.length > 0 ? updatedUsersData[0].userName : "";
        onUserChange(firstUser);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Manage Users</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {successMessage && <Alert variant="success">{successMessage}</Alert>}
        <Form.Group>
          <Form.Label>Add New User</Form.Label>
          <Form.Control
            type="text"
            value={newUser}
            onChange={(e) => setNewUser(e.target.value)}
            placeholder="Enter username"
          />
          <Form.Check
            type="checkbox"
            label="Administrator"
            checked={isAdmin}
            onChange={(e) => setIsAdmin(e.target.checked)}
            className="mt-2"
          />
          <Button className="mt-2" onClick={handleAddUser} variant="success">
            Add User
          </Button>
        </Form.Group>

        <h5 className="mt-3">Existing Users</h5>
        <ListGroup>
          {users.length > 0 ? (
            users.map((user) => (
              <ListGroup.Item
                key={user.userName}
                className="d-flex justify-content-between align-items-center"
              >
                <div>
                  <span>{user.userName}</span>
                  {user.isAdmin && <Badge bg="info" className="ms-2">Admin</Badge>}
                </div>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeleteUser(user)}
                >
                  Delete
                </Button>
              </ListGroup.Item>
            ))
          ) : (
            <p className="text-muted text-center mt-2">
              Please create a new user.
            </p>
          )}
        </ListGroup>
      </Modal.Body>
    </Modal>
  );
};

UserManagement.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onUserChange: PropTypes.func.isRequired,
  currentUser: PropTypes.string.isRequired,
};

export default UserManagement;
