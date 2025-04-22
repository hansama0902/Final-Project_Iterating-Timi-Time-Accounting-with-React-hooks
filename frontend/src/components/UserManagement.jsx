import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Modal,
  Button,
  Form,
  ListGroup,
  Alert,
  Badge,
  Row,
  Col,
} from "react-bootstrap";
import { fetchUsers, createUser, deleteUser } from "../utils/api";
import "../stylesheets/UserManagement.css";

const UserManagement = ({ show, onClose, onUserChange, currentUser }) => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmDeleteUser, setConfirmDeleteUser] = useState(null);

  useEffect(() => {
    const loadUsers = async () => {
      if (!show) return;
      try {
        setLoading(true);
        const usersData = await fetchUsers();
        usersData.sort((a, b) => a.userName.localeCompare(b.userName));
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, [show]);

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleAddUser = async () => {
    if (newUser.trim() === "") return;
    if (users.some((u) => u.userName === newUser.trim())) {
      setSuccessMessage(`Username "${newUser}" already exists.`);
      return;
    }

    try {
      setLoading(true);
      await createUser(newUser, isAdmin);
      const updatedUsers = await fetchUsers();
      updatedUsers.sort((a, b) => a.userName.localeCompare(b.userName));
      setUsers(updatedUsers);
      onUserChange(newUser);
      showSuccessMessage(`User "${newUser}" added successfully!`);
      setNewUser("");
      setIsAdmin(false);
    } catch (error) {
      console.error("Error adding user:", error);
      setSuccessMessage("Failed to add user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!confirmDeleteUser || users.length <= 1) return;
    try {
      setLoading(true);
      await deleteUser(confirmDeleteUser.userName);
      const updatedUsers = await fetchUsers();
      updatedUsers.sort((a, b) => a.userName.localeCompare(b.userName));
      setUsers(updatedUsers);
      showSuccessMessage(
        `User "${confirmDeleteUser.userName}" deleted successfully!`,
      );
      if (confirmDeleteUser.userName === currentUser) {
        onUserChange(updatedUsers.length > 0 ? updatedUsers[0].userName : "");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      setSuccessMessage("Failed to delete user. Please try again.");
    } finally {
      setConfirmDeleteUser(null);
      setLoading(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      className="user-management-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title className="modal-title">User Management</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {successMessage && (
          <Alert
            variant={
              successMessage.includes("Failed") ||
              successMessage.includes("Cannot") ||
              successMessage.includes("exists")
                ? "danger"
                : "success"
            }
            className="message-alert"
          >
            {successMessage}
          </Alert>
        )}

        <section className="add-user-section">
          <h3 className="section-title">Add New User</h3>
          <Form>
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="new-username-input">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    value={newUser}
                    onChange={(e) => setNewUser(e.target.value)}
                    placeholder="Enter username"
                    disabled={loading}
                    aria-required="true"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3" controlId="admin-checkbox">
              <Form.Check
                type="checkbox"
                id="admin-checkbox"
                label="Create as Administrator"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
                disabled={loading}
              />
            </Form.Group>

            <Button
              onClick={handleAddUser}
              variant="primary"
              disabled={loading || !newUser.trim()}
              aria-label="Add new user"
            >
              Add User
            </Button>
          </Form>
        </section>

        <section className="existing-users-section mt-4">
          <h3 className="section-title d-flex justify-content-between align-items-center">
            Existing Users
            <Badge bg="primary" aria-label={`Total users: ${users.length}`}>
              {users.length}
            </Badge>
          </h3>

          {loading ? (
            <div className="text-center py-4" role="status" aria-live="polite">
              <div className="spinner-border text-primary" />
              <div>Loading users...</div>
            </div>
          ) : users.length > 0 ? (
            <ListGroup>
              {users.map((user) => (
                <ListGroup.Item
                  key={user.userName}
                  className={`user-item ${user.userName === currentUser ? "current-user" : ""}`}
                >
                  <div className="user-info">
                    <span className="user-name">{user.userName}</span>
                    {user.isAdmin && (
                      <Badge bg="info" className="admin-badge">
                        Admin
                      </Badge>
                    )}
                    {user.userName === currentUser && (
                      <Badge bg="success" className="current-badge">
                        Current
                      </Badge>
                    )}
                  </div>
                  <Button
                    size="sm"
                    className="delete-button"
                    onClick={() => setConfirmDeleteUser(user)}
                    disabled={loading}
                    aria-label={`Delete user ${user.userName}`}
                  >
                    Delete
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <p className="text-muted text-center mt-3">No users found.</p>
          )}
        </section>
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={onClose}
          aria-label="Close user management modal"
        >
          Close
        </Button>
      </Modal.Footer>

      {/* Confirm Deletion Modal */}
      <Modal
        show={!!confirmDeleteUser}
        onHide={() => setConfirmDeleteUser(null)}
        centered
        aria-labelledby="confirm-delete-title"
      >
        <Modal.Header closeButton>
          <Modal.Title id="confirm-delete-title">Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete user{" "}
          <strong>{confirmDeleteUser?.userName}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setConfirmDeleteUser(null)}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            Yes, Delete
          </Button>
        </Modal.Footer>
      </Modal>
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
