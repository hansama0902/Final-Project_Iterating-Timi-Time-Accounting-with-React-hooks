import { useState, useEffect, useRef } from "react";
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
  const [dropdownFocusIndex, setDropdownFocusIndex] = useState(-1);

  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

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
    setDropdownFocusIndex(-1);
  }, [username, userList]);

  useEffect(() => {
    if (dropdownFocusIndex >= 0 && showDropdown && filteredUsers.length > 0) {
      const focusedItem = document.querySelector('.autocomplete-item.focused');
      if (focusedItem && dropdownRef.current) {
        focusedItem.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [dropdownFocusIndex, showDropdown, filteredUsers.length]);

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
    if (!newUsername) return;

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

  const handleInputKeyDown = (e) => {
    if (!showDropdown || filteredUsers.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setDropdownFocusIndex((prev) =>
          prev < filteredUsers.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setDropdownFocusIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case "Enter":
        if (dropdownFocusIndex >= 0 && dropdownFocusIndex < filteredUsers.length) {
          e.preventDefault();
          setUsername(filteredUsers[dropdownFocusIndex].userName);
          setShowDropdown(false);
          setDropdownFocusIndex(-1);
        }
        break;
      case "Escape":
        e.preventDefault();
        setShowDropdown(false);
        setDropdownFocusIndex(-1);
        break;
      case "Tab":
        setShowDropdown(false);
        break;
      default:
        break;
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
            <Form.Label className="input-label" htmlFor="username-input">Username</Form.Label>
            <div className="autocomplete-container">
              <input
                id="username-input"
                ref={inputRef}
                type="text"
                role="combobox"
                aria-haspopup="listbox"
                aria-controls="autocomplete-list"
                aria-expanded={showDropdown}
                className="form-control autocomplete-input"
                placeholder="Type to search users..."
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                onKeyDown={handleInputKeyDown}
              />

              {showDropdown && filteredUsers.length > 0 && (
                <div
                  id="autocomplete-list"
                  className="autocomplete-dropdown"
                  ref={dropdownRef}
                  role="listbox"
                  tabIndex={0}
                  aria-label="User suggestions"
                >
                  {filteredUsers.map((user, index) => (
                    <div
                      key={user.userName}
                      className={`autocomplete-item ${index === dropdownFocusIndex ? "focused" : ""}`}
                      role="option"
                      aria-selected={index === dropdownFocusIndex}
                      onClick={() => {
                        setUsername(user.userName);
                        setShowDropdown(false);
                      }}
                      onMouseEnter={() => setDropdownFocusIndex(index)}
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

      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Create New User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="new-username">Username</Form.Label>
              <Form.Control
                id="new-username"
                type="text"
                placeholder="Enter new username"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                autoFocus
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                id="new-admin-checkbox"
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
          <Button
            variant="primary"
            onClick={handleCreateUser}
            disabled={!newUsername}
          >
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

