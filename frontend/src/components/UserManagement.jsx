import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Modal, Button, Form, ListGroup, Alert } from "react-bootstrap";
import { fetchUsers, createUser, deleteUser } from "../utils/api";

const UserManagement = ({ show, onClose, onUserChange, currentUser }) => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const usersData = await fetchUsers();
        setUsers(usersData.map((user) => user.userName));
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
    if (newUser.trim() === "" || users.includes(newUser)) return;
    try {
      await createUser(newUser);

      const updatedUsersData = await fetchUsers();
      const updatedUsers = updatedUsersData.map((u) => u.userName);
      setUsers(updatedUsers);

      onUserChange(newUser);

      showSuccessMessage(`User "${newUser}" added successfully!`);
      setNewUser("");
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const handleDeleteUser = async (user) => {
    try {
      await deleteUser(user);

      const updatedUsersData = await fetchUsers();
      const updatedUsers = updatedUsersData.map((u) => u.userName);
      setUsers(updatedUsers);

      showSuccessMessage(`User "${user}" deleted successfully!`);

      if (user === currentUser) {
        onUserChange(updatedUsers.length > 0 ? updatedUsers[0] : "");
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
          <Button className="mt-2" onClick={handleAddUser} variant="success">
            Add User
          </Button>
        </Form.Group>

        <h5 className="mt-3">Existing Users</h5>
        <ListGroup>
          {users.length > 0 ? (
            users.map((user) => (
              <ListGroup.Item
                key={user}
                className="d-flex justify-content-between align-items-center"
              >
                <span>{user}</span>
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
