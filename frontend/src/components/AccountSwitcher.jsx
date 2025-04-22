import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Dropdown, Button, Badge } from "react-bootstrap";
import UserManagement from "./UserManagement";
import { fetchUsers } from "../utils/api";
import "../stylesheets/AccountSwitcher.css";

const AccountSwitcher = ({ currentUser, onSwitch }) => {
  const [userList, setUserList] = useState([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(currentUser || "Select Account");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownToggleRef = useRef(null);
  const manageButtonRef = useRef(null);

  const loadUsers = async () => {
    try {
      const users = await fetchUsers();
      const userNames = users.map((user) => user.userName);
      setUserList(userNames);
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
    setDropdownOpen(false); // ✅ close menu after selection
  };

  const handleKeyDown = (e, user) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleSwitch(user);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setDropdownOpen(false);
    }
  };

  return (
    <div className="account-switcher">
      <div className="account-header">
        <h2 className="account-title">Account Management</h2>
        {selectedUser !== "Select Account" && (
          <Badge className="current-user-badge">
            Current: {selectedUser}
          </Badge>
        )}
      </div>

      <div className="account-actions">
        <Dropdown
          className="account-dropdown"
          show={dropdownOpen}
          onToggle={(isOpen) => setDropdownOpen(isOpen)}
        >
          <Dropdown.Toggle
            variant="primary"
            className="account-toggle"
            ref={dropdownToggleRef}
            aria-label="Select User Account"
            aria-haspopup="listbox"
            aria-expanded={dropdownOpen}
          >
            <i className="fa fa-user-circle" aria-hidden="true"></i>
            <span className="toggle-text">{selectedUser}</span>
          </Dropdown.Toggle>

          <Dropdown.Menu className="account-menu" role="listbox">
            {userList.length > 0 ? (
              userList.map((user) => (
                <div
                  key={user}
                  role="option"
                  aria-selected={user === selectedUser}
                  tabIndex={0}
                  className={`account-item dropdown-option ${user === selectedUser ? "active" : ""}`}
                  onClick={() => handleSwitch(user)}
                  onKeyDown={(e) => handleKeyDown(e, user)}
                >
                  {user}
                </div>
              ))
            ) : (
              <div className="account-item-empty" aria-disabled="true">
                No Users Available
              </div>
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


