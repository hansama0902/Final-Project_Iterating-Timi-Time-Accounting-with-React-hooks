// Login.jsx
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Modal, Form, Button, Alert, FormControl } from "react-bootstrap";
import { fetchUsers, createUser } from "../utils/api";
import "../stylesheets/Login.css";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newIsAdmin, setNewIsAdmin] = useState(false);
  const [userList, setUserList] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Load user list on component mount
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const users = await fetchUsers();
        setUserList(users);
      } catch (error) {
        console.error("Error loading users:", error);
      }
    };
    
    loadUsers();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!username) {
      setErrorMessage("Please enter or select a username");
      return;
    }

    try {
      // Only check if user exists
      const users = await fetchUsers();
      const userExists = users.some(user => user.userName === username);
      
      if (userExists) {
        // User exists, login with selected role
        onLogin(username, isAdmin);
      } else {
        setErrorMessage("User not found");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("An error occurred during login");
    }
  };

  const handleCreateUser = async () => {
    if (!newUsername) {
      return;
    }

    try {
      await createUser(newUsername);
      setShowCreateModal(false);
      setNewUsername("");
      setNewIsAdmin(false);
      
      // Update user list
      const users = await fetchUsers();
      setUserList(users);
      
      // Login with new user
      onLogin(newUsername, newIsAdmin);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  // Filter users based on input
  const filteredUsers = userList.filter(user => 
    user.userName.toLowerCase().includes(username.toLowerCase())
  );

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="text-center mb-4">Timi Time Accounting</h2>
        
        {errorMessage && (
          <Alert variant="danger" onClose={() => setErrorMessage("")} dismissible>
            {errorMessage}
          </Alert>
        )}
        
        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <div className="custom-dropdown-container">
              <FormControl
                autoFocus
                placeholder="Type to search users..."
                onChange={(e) => {
                  setUsername(e.target.value);
                  setShowDropdown(true);
                }}
                value={username}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                className="custom-dropdown-input"
              />
              {showDropdown && filteredUsers.length > 0 && (
                <div className="custom-dropdown-menu">
                  {filteredUsers.map((user) => (
                    <div 
                      key={user.userName} 
                      className="custom-dropdown-item"
                      onClick={() => {
                        setUsername(user.userName);
                        setShowDropdown(false);
                      }}
                    >
                      {user.userName}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Login as Administrator"
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
              className="admin-checkbox"
            />
          </Form.Group>
          
          <div className="d-grid gap-2">
            <Button variant="primary" type="submit" className="login-button">
              Login
            </Button>
            <Button 
              variant="secondary" 
              onClick={() => setShowCreateModal(true)}
              className="create-account-button"
            >
              Create New Account
            </Button>
          </div>
        </Form>
      </div>

      {/* Create User Modal */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create New User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter new username"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Create as Administrator"
                checked={newIsAdmin}
                onChange={(e) => setNewIsAdmin(e.target.checked)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCreateUser}>
            Create User
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

Login.propTypes = {
  onLogin: PropTypes.func.isRequired
};

export default Login;