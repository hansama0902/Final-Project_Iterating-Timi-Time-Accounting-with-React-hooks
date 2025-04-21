import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Modal, Button, Form, ListGroup, Alert, Badge, Row, Col } from "react-bootstrap";
import { fetchUsers, createUser, deleteUser } from "../utils/api";
import "../stylesheets/UserManagement.css";

const UserManagement = ({ show, onClose, onUserChange, currentUser }) => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadUsers = async () => {
      if (!show) return;
      
      try {
        setLoading(true);
        const usersData = await fetchUsers();
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
    // Validate input
    if (newUser.trim() === "") return;
    if (users.some(u => u.userName === newUser.trim())) {
      setSuccessMessage(`Username "${newUser}" already exists.`);
      return;
    }
    
    try {
      setLoading(true);
      await createUser(newUser, isAdmin);

      const updatedUsersData = await fetchUsers();
      setUsers(updatedUsersData);

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

  const handleDeleteUser = async (user) => {
    if (users.length <= 1) {
      setSuccessMessage("Cannot delete the last user.");
      return;
    }
    
    try {
      setLoading(true);
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
      setSuccessMessage("Failed to delete user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered className="user-management-modal">
      <Modal.Header closeButton>
        <Modal.Title className="modal-title">User Management</Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        {successMessage && (
          <Alert 
            variant={successMessage.includes("Failed") || successMessage.includes("Cannot") || successMessage.includes("already exists") ? "danger" : "success"} 
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
                <Form.Group className="mb-3">
                  <Form.Label className="form-label">Username</Form.Label>
                  <Form.Control
                    type="text"
                    value={newUser}
                    onChange={(e) => setNewUser(e.target.value)}
                    placeholder="Enter username"
                    className="username-input"
                    disabled={loading}
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                id="admin-checkbox"
                label="Create as Administrator"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
                className="admin-checkbox"
                disabled={loading}
              />
            </Form.Group>
            
            <div className="button-container">
              <Button 
                onClick={handleAddUser} 
                variant="primary" 
                className="add-button"
                disabled={loading || !newUser.trim()}
              >
                Add User
              </Button>
            </div>
          </Form>
        </section>
        
        <section className="existing-users-section">
          <h3 className="section-title">
            Existing Users
            <Badge bg="primary" className="user-count-badge">
              {users.length}
            </Badge>
          </h3>
          
          <div className="users-list-container">
            {loading ? (
              <div className="loading-indicator">
                <div className="spinner"></div>
                <span>Loading users...</span>
              </div>
            ) : users.length > 0 ? (
              <ListGroup className="users-list">
                {users.map((user) => (
                  <ListGroup.Item
                    key={user.userName}
                    className={`user-item ${user.userName === currentUser ? 'current-user' : ''}`}
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
                      variant="outline-danger"
                      size="sm"
                      className="delete-button"
                      onClick={() => handleDeleteUser(user)}
                      disabled={loading}
                    >
                      Delete
                    </Button>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            ) : (
              <div className="no-users-message">
                <p>No users available. Please create a new user.</p>
              </div>
            )}
          </div>
        </section>
      </Modal.Body>
      
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
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
