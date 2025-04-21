// Login.jsx
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Modal, Form, Button, Alert } from "react-bootstrap";
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
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const users = await fetchUsers();
        setUserList(users);
        setFilteredUsers(users);
      } catch (error) {
        console.error("Error loading users:", error);
      }
    };
    
    loadUsers();
  }, []);

  useEffect(() => {
    if (username) {
      const filtered = userList.filter(user => 
        user.userName.toLowerCase().includes(username.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(userList);
    }
  }, [username, userList]);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!username) {
      setErrorMessage("Please enter or select a username");
      return;
    }

    try {
      const users = await fetchUsers();
      const userExists = users.some(user => user.userName === username);
      
      if (userExists) {
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
      
      const users = await fetchUsers();
      setUserList(users);
      
      onLogin(newUsername, newIsAdmin);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Timi Time Accounting</h1>
        
        {errorMessage && (
          <Alert variant="danger" onClose={() => setErrorMessage("")} dismissible>
            {errorMessage}
          </Alert>
        )}
        
        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3">
            <Form.Label className="input-label">Username</Form.Label>
            <div className="autocomplete-container">
              <input
                type="text"
                className="form-control autocomplete-input"
                placeholder="Type to search users..."
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              />
              {showDropdown && filteredUsers.length > 0 && (
                <div className="autocomplete-dropdown">
                  {filteredUsers.map((user) => (
                    <div 
                      key={user.userName} 
                      className="autocomplete-item"
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
          
          <Form.Group className="mb-4">
            <Form.Check
              type="checkbox"
              id="admin-checkbox"
              label="Login as Administrator"
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
              className="admin-checkbox"
            />
          </Form.Group>
          
          <div className="btn-group-vertical w-100">
            <Button 
              variant="primary" 
              type="submit" 
              className="login-button"
            >
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

      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} centered>
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
          <Button variant="outline-secondary" onClick={() => setShowCreateModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCreateUser}>
            Create
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