// import React, { useState } from "react";

// const UserModal = ({ isOpen, onClose, onAddUser }) => {
//   const [userName, setUserName] = useState(""); // Changed to userName
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleAddUser = () => {
//     if (!userName || !email || !password) {
//       alert("Please fill in all fields");
//       return;
//     }

//     onAddUser({ userName, email, password });

//     setUserName("");
//     setEmail("");
//     setPassword("");
//     onClose();
//   };

//   if (!isOpen) return null;

//   return (
//     <div style={styles.overlay}>
//       <div style={styles.modal}>
//         <h2>Add New User</h2>
//         <input
//           type="text"
//           placeholder="Username"
//           value={userName}
//           onChange={(e) => setUserName(e.target.value)}
//           style={styles.input}
//         />
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           style={styles.input}
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           style={styles.input}
//         />
//         <div style={styles.buttons}>
//           <button onClick={handleAddUser} style={styles.addButton}>
//             Add User
//           </button>
//           <button onClick={onClose} style={styles.cancelButton}>
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Inline styles remain the same
// const styles = {
//   overlay: {
//     position: "fixed",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   modal: {
//     background: "#fff",
//     padding: "20px",
//     borderRadius: "8px",
//     width: "300px",
//     boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
//   },
//   input: {
//     width: "100%",
//     marginBottom: "10px",
//     padding: "8px",
//     border: "1px solid #ddd",
//     borderRadius: "4px",
//   },
//   buttons: {
//     display: "flex",
//     justifyContent: "space-between",
//     marginTop: "10px",
//   },
//   addButton: {
//     background: "#4CAF50",
//     color: "#fff",
//     border: "none",
//     padding: "8px 16px",
//     borderRadius: "4px",
//     cursor: "pointer",
//   },
//   cancelButton: {
//     background: "#f44336",
//     color: "#fff",
//     border: "none",
//     padding: "8px 16px",
//     borderRadius: "4px",
//     cursor: "pointer",
//   },
// };

// export default UserModal;
import React, { useState } from "react";

const UserModal = ({ isOpen, onClose, onAddUser }) => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // New loading state
  const [error, setError] = useState(""); // New error state

  const handleAddUser = async () => {
    if (!userName || !email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true); // Start loading
    setError(""); // Clear any previous errors

    try {
      await onAddUser({ userName, email, password });
      setUserName("");
      setEmail("");
      setPassword("");
      onClose();
    } catch (err) {
      setError("Failed to add user. Please try again.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2>Add New User</h2>
        {error && <p style={styles.error}>{error}</p>} {/* Display Error */}
        <input
          type="text"
          placeholder="Username"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          style={styles.input}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
        <div style={styles.buttons}>
          <button
            onClick={handleAddUser}
            style={styles.addButton}
            disabled={loading} // Disable button while loading
          >
            {loading ? "Adding..." : "Add User"}
          </button>
          <button onClick={onClose} style={styles.cancelButton}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// Updated Inline Styles
const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    background: "#fff",
    padding: "20px",
    borderRadius: "8px",
    width: "350px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
  },
  input: {
    width: "100%",
    marginBottom: "10px",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "14px",
  },
  buttons: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "15px",
  },
  addButton: {
    background: "#4CAF50",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
  },
  cancelButton: {
    background: "#f44336",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
  },
  error: {
    color: "red",
    fontSize: "14px",
    marginBottom: "10px",
  },
};

export default UserModal;
