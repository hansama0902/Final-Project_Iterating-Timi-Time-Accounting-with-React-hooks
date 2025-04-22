import { useState, useRef } from "react";
import useUser from "./hooks/useUser";
import useTransactions from "./hooks/useTransactions";
import useDashboard from "./hooks/useDashboard";
import Login from "./components/Login";
import AccountSwitcher from "./components/AccountSwitcher";
import Dashboard from "./components/Dashboard";
import AddForm from "./components/AddForm";
import TransactionList from "./components/TransactionList";
import GoalProgress from "./components/GoalProgress";
import FinanceChart from "./components/FinanceChart";
import DateRangeFilter from "./components/DateRangeFilter";
import "./stylesheets/AppHeader.css";

const App = () => {
  const { currentUser, setCurrentUser } = useUser();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const {
    transactions,
    handleAddTransaction,
    handleUpdateTransaction,
    handleDeleteTransaction,
    loading,
  } = useTransactions(currentUser);

  const [editingTransaction, setEditingTransaction] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const addFormRef = useRef(null);

  const handleLogin = (username, adminStatus) => {
    setCurrentUser(username);
    setIsAdmin(adminStatus);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser("");
    setIsAdmin(false);
  };

  const onTransactionAdded = async (newTransaction) => {
    await handleAddTransaction(newTransaction);
    setEditingTransaction(null);
  };

  const onTransactionUpdated = async (transactionId, updatedData) => {
    await handleUpdateTransaction(transactionId, updatedData);
    setEditingTransaction(null);
  };

  const onTransactionDeleted = async (transactionId) => {
    await handleDeleteTransaction(transactionId);
  };

  const onTransactionEdit = (transaction) => {
    setEditingTransaction(transaction);
    addFormRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const parseDateLocal = (dateStr) => new Date(dateStr + "T00:00:00");

  const filteredTransactions = transactions.filter((t) => {
    const tDate = parseDateLocal(t.date);
    const afterStart = startDate ? parseDateLocal(startDate) <= tDate : true;
    const beforeEnd = endDate ? tDate <= new Date(endDate + "T23:59:59") : true;
    return afterStart && beforeEnd;
  });

  const { totalIncome, totalExpenses, balance } =
    useDashboard(filteredTransactions);

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="app-branding">
          <h1 className="app-title">Timi Time Accounting</h1>
        </div>

        <div className="app-user-section">
          {isAdmin && (
            <div className="account-control-area">
              <AccountSwitcher
                currentUser={currentUser}
                onSwitch={setCurrentUser}
              />
            </div>
          )}
          <button
            type="button"
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </header>

      <main className="app-content">
        {!currentUser ? (
          <p className="no-user-message">
            {isAdmin
              ? "Please switch your account to view data."
              : "No user data available."}
          </p>
        ) : (
          <>
            <section className="filter-section">
              <DateRangeFilter
                startDate={startDate}
                endDate={endDate}
                onChange={(type, value) => {
                  if (type === "start") setStartDate(value);
                  else setEndDate(value);
                }}
              />
            </section>

            <section className="overview-section">
              <div className="overview-row">
                <Dashboard
                  key={filteredTransactions.length}
                  totalIncome={totalIncome}
                  totalExpenses={totalExpenses}
                  balance={balance}
                />

                <GoalProgress
                  key={currentUser}
                  userId={currentUser}
                  balance={balance}
                />
              </div>
            </section>

            <section className="transaction-section" ref={addFormRef}>
              <AddForm
                onTransactionAdded={onTransactionAdded}
                onTransactionUpdated={onTransactionUpdated}
                userName={currentUser}
                editingTransaction={editingTransaction}
              />

              {loading ? (
                <div className="loading-indicator">Loading transactions...</div>
              ) : filteredTransactions.length === 0 ? (
                <div className="empty-state">No transactions found.</div>
              ) : (
                <TransactionList
                  transactions={filteredTransactions}
                  onDelete={onTransactionDeleted}
                  onEdit={onTransactionEdit}
                  loading={loading}
                />
              )}
            </section>

            {filteredTransactions.length > 0 && (
              <section className="chart-section">
                <FinanceChart data={filteredTransactions} />
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default App;
