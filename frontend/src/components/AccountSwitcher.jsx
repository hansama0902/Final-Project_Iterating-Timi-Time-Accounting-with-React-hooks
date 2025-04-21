import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Dropdown, Button, Badge } from "react-bootstrap";
import UserManagement from "./UserManagement";
import { fetchUsers } from "../utils/api";
import "../stylesheets/AccountSwitcher.css";

const AccountSwitcher = ({ currentUser, onSwitch }) => {
  const [userList, setUserList] = useState([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(
    currentUser || "Select Account"
  );
  const dropdownToggleRef = useRef(null);
  const manageButtonRef = useRef(null);
  
  const loadUsers = async () => {
    try {
      const users = await fetchUsers();
      const userNames = users.map((user) => user.userName);
      setUserList(userNames);
      console.log("Loaded users:", userNames);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleSwitch = (user) => {
    setSelectedUser(user);
    onSwitch(user);
  };
  
  const handleKeyDown = (e, user) => {
    // Enter or Space key to select user
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleSwitch(user);
    }
  };

  return (
    <div className="account-switcher">
      <div className="account-header">
        <h2 className="account-title">Account Management</h2>
        {selectedUser !== "Select Account" && (
          <Badge bg="info" className="current-user-badge">
            Current: {selectedUser}
          </Badge>
        )}
      </div>

      <div className="account-actions">
        <Dropdown className="account-dropdown">
          <Dropdown.Toggle 
            variant="primary" 
            className="account-toggle"
            ref={dropdownToggleRef}
            aria-label="Select User Account"
          >
            <i className="fa fa-user-circle"></i>
            <span className="toggle-text">{selectedUser}</span>
          </Dropdown.Toggle>
          <Dropdown.Menu className="account-menu">
            {userList.length > 0 ? (
              userList.map((user) => (
                <Dropdown.Item
                  key={user}
                  onClick={() => handleSwitch(user)}
                  onKeyDown={(e) => handleKeyDown(e, user)}
                  active={user === selectedUser}
                  className="account-item"
                  tabIndex={0}
                  aria-selected={user === selectedUser}
                >
                  {user}
                </Dropdown.Item>
              ))
            ) : (
              <Dropdown.Item disabled className="account-item-empty">
                No Users Available
              </Dropdown.Item>
            )}
          </Dropdown.Menu>
        </Dropdown>

        <Button
          variant="outline-primary"
          onClick={() => setShowUserModal(true)}
          className="account-button"
          ref={manageButtonRef}
          aria-label="Manage Users"
        >
          Manage Users
        </Button>
      </div>

      <UserManagement
        show={showUserModal}
        onClose={() => {
          setShowUserModal(false);
          manageButtonRef.current?.focus();
        }}
        onUserChange={(user) => {
          handleSwitch(user);
          loadUsers();
        }}
        currentUser={currentUser}
      />
    </div>
  );
};

AccountSwitcher.propTypes = {
  currentUser: PropTypes.string.isRequired,
  onSwitch: PropTypes.func.isRequired,
};

export default AccountSwitcher;