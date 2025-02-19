// import { useEffect, useState } from "react";
// import UserModal from "./UserModal";

// export default function UsersPage() {
//   const [data, setData] = useState([]); // State to store table data
//   const [loading, setLoading] = useState(true); // Loading state
//   const [error, setError] = useState(null); // Error state
//   const token = localStorage.getItem("token");
//   useEffect(() => {
//     fetch("http://localhost:5000/api/users", {
//       method: "GET",
//       headers: { Authorization: `Bearer ${token}` },
//     })
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error("Failed to fetch data");
//         }
//         return response.json();
//       })
//       .then((data) => {
//         console.log(data);
//         setData(data); // Store data in state
//         setLoading(false); // Set loading to false
//       })
//       .catch((error) => {
//         console.error("Error fetching data:", error);
//         setError(error.message);
//         setLoading(false);
//       });
//   }, []);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [users, setUsers] = useState([]);

//   // Open modal
//   const openModal = () => setIsModalOpen(true);

//   // Close modal
//   const closeModal = () => setIsModalOpen(false);

//   // Add user
//   const addUser = (user) => {
//     fetch("http://localhost:5000/api/users/register", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(user),
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         setUsers((prevUsers) => [...prevUsers, data.user]); // Update state with new user
//         console.log("User added:", data);
//       })
//       .catch((error) => console.error("Error:", error));
//   };

//   return (
//     <>
//       <button className="btn btn-primary m-3" onClick={openModal}>
//         Add User
//       </button>
//       <UserModal
//         isOpen={isModalOpen}
//         onClose={closeModal}
//         onAddUser={addUser}
//       />
//       <table class="table table-striped table-hover p-5">
//         <thead className="border border-top">
//           <tr>
//             <th>User Name</th>
//             <th>Email</th>
//             <th>Role</th>
//             {/* <th>Password</th> */}
//           </tr>
//         </thead>
//         <tbody>
//           {error ? { error } : ""}
//           {loading ? "Loading Data" : ""}
//           {data.map((item) => (
//             <tr key={item.id}>
//               <td>{item.userName}</td>
//               <td>{item.email}</td>
//               <td>{item.role}</td>
//             </tr>
//           ))}
//           <tr>
//             <td>John</td>
//             <td>Doe</td>
//             <td>john@example.com</td>
//           </tr>
//           <tr>
//             <td>Mary</td>
//             <td>Moe</td>
//             <td>mary@example.com</td>
//           </tr>
//           <tr>
//             <td>July</td>
//             <td>Dooley</td>
//             <td>july@example.com</td>
//           </tr>
//         </tbody>
//       </table>
//     </>
//   );
// }

// "use client";
// import { useEffect, useState } from "react";
// import UserModal from "./UserModal";

// export default function UsersPage() {
//   const [data, setData] = useState([]); // State to store user data
//   const [loading, setLoading] = useState(true); // Loading state
//   const [error, setError] = useState(null); // Error state
//   const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
//   const token =
//     typeof window !== "undefined" ? localStorage.getItem("token") : null;

//   // Fetch user data
//   useEffect(() => {
//     if (!token) return;

//     fetch("http://localhost:5000/api/users", {
//       method: "GET",
//       headers: { Authorization: `Bearer ${token}` },
//     })
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error("Failed to fetch data");
//         }
//         return response.json();
//       })
//       .then((data) => {
//         console.log(data);
//         setData(data); // Update user list
//         setLoading(false); // Stop loading
//       })
//       .catch((error) => {
//         console.error("Error fetching data:", error);
//         setError(error.message);
//         setLoading(false);
//       });
//   }, [token]);

//   // Open modal
//   const openModal = () => setIsModalOpen(true);

//   // Close modal
//   const closeModal = () => setIsModalOpen(false);

//   // Add user
//   const addUser = async (user) => {
//     try {
//       const response = await fetch("http://localhost:5000/api/users/register", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(user),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to add user");
//       }

//       const result = await response.json();
//       console.log("API Response:", result);

//       // Add the new user from result.data
//       if (result && result.data) {
//         setData((prevData) => [...prevData, result.data]);
//       } else {
//         throw new Error("User data not found in response");
//       }
//     } catch (error) {
//       console.error("Error adding user:", error);
//       throw error;
//     }
//   };

//   return (
//     <div className="container mt-4">
//       <h1 className="mb-4">User Management</h1>

//       {/* Add User Button */}
//       <button className="btn btn-primary mb-3" onClick={openModal}>
//         Add User
//       </button>

//       {/* User Modal */}
//       <UserModal
//         isOpen={isModalOpen}
//         onClose={closeModal}
//         onAddUser={addUser}
//       />

//       {/* Error Handling */}
//       {error && <div className="alert alert-danger">{error}</div>}

//       {/* Loading State */}
//       {loading && <p>Loading Data...</p>}

//       {/* User Table */}
//       {!loading && !error && (
//         <table className="table table-striped table-hover">
//           <thead className="table-dark">
//             <tr>
//               <th>User Name</th>
//               <th>Email</th>
//               <th>Role</th>
//             </tr>
//           </thead>
//           <tbody>
//             {data.length > 0 ? (
//               data.map((user) => (
//                 <tr key={user.id}>
//                   <td>{user.userName}</td>
//                   <td>{user.email}</td>
//                   <td>{user.role}</td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="3" className="text-center">
//                   No Users Found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// }

// "use client";
// import { useEffect, useState } from "react";
// import {
//   Button,
//   Table,
//   Modal,
//   Form,
//   Alert,
//   Dropdown,
//   Spinner,
// } from "react-bootstrap";

// export default function UsersPage() {
//   // ✅ States
//   const [users, setUsers] = useState([]); // User data
//   const [loading, setLoading] = useState(true); // Loading state
//   const [error, setError] = useState(null); // Error state
//   const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
//   const [modalMode, setModalMode] = useState("add"); // Modal mode (add/edit)
//   const [currentUser, setCurrentUser] = useState(null); // Current user for edit
//   const [formData, setFormData] = useState({
//     userName: "",
//     email: "",
//     role: "",
//   }); // Form data
//   const [language, setLanguage] = useState("ar"); // Default language

//   const token =
//     typeof window !== "undefined" ? localStorage.getItem("token") : null;

//   // ✅ Language Texts
//   const texts = {
//     en: {
//       title: "User Management",
//       addUser: "Add User",
//       editUser: "Edit User",
//       deleteUser: "Delete User",
//       userName: "User Name",
//       email: "Email",
//       role: "Role",
//       actions: "Actions",
//       save: "Save",
//       close: "Close",
//       noUsers: "No Users Found",
//       loading: "Loading Data...",
//       error: "Error",
//     },
//     ar: {
//       title: "إدارة المستخدمين",
//       addUser: "إضافة مستخدم",
//       editUser: "تعديل مستخدم",
//       deleteUser: "حذف مستخدم",
//       userName: "اسم المستخدم",
//       email: "البريد الإلكتروني",
//       role: "الدور",
//       actions: "الإجراءات",
//       save: "حفظ",
//       close: "إغلاق",
//       noUsers: "لا يوجد مستخدمون",
//       loading: "جاري تحميل البيانات...",
//       error: "خطأ",
//     },
//   };

//   // ✅ Update page direction on language change
//   useEffect(() => {
//     document.documentElement.lang = language;
//     document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
//   }, [language]);

//   // ✅ Fetch Users
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         if (!token) {
//           throw new Error("Token is missing. Please log in again.");
//         }

//         const response = await fetch("http://localhost:5000/api/users", {
//           method: "GET",
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         if (!response.ok) {
//           throw new Error("Failed to fetch users");
//         }

//         const result = await response.json();
//         console.log("Fetched Users:", result); // Debugging fetched data
//         setUsers(result?.data || result || []);
//         setLoading(false);
//       } catch (err) {
//         console.error(err.message);
//         setError(err.message);
//         setLoading(false);
//       }
//     };

//     fetchUsers();
//   }, [token]);

//   // ✅ Open Modal
//   const openModal = (mode, user = null) => {
//     setModalMode(mode);
//     setCurrentUser(user);
//     setFormData(user || { userName: "", email: "", role: "" });
//     setIsModalOpen(true);
//   };

//   // ✅ Close Modal
//   const closeModal = () => {
//     setIsModalOpen(false);
//     setCurrentUser(null);
//     setFormData({ userName: "", email: "", role: "" });
//   };

//   // ✅ Handle Input Change
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   // ✅ Save User (Add/Edit)
//   const handleSaveUser = async () => {
//     try {
//       const url =
//         modalMode === "add"
//           ? "http://localhost:5000/api/users/register"
//           : `http://localhost:5000/api/users/${currentUser.id}`;

//       const method = modalMode === "add" ? "POST" : "PUT";

//       const response = await fetch(url, {
//         method,
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(formData),
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to ${modalMode} user`);
//       }

//       const result = await response.json();

//       if (modalMode === "add") {
//         setUsers((prev) => [...prev, result.data]);
//       } else {
//         setUsers((prev) =>
//           prev.map((user) =>
//             user.id === currentUser.id ? { ...user, ...formData } : user
//           )
//         );
//       }

//       closeModal();
//     } catch (err) {
//       console.error(err.message);
//       setError(err.message);
//     }
//   };

//   // ✅ Delete User
//   const handleDeleteUser = async (id) => {
//     try {
//       const response = await fetch(`http://localhost:5000/api/users/${id}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (!response.ok) {
//         throw new Error("Failed to delete user");
//       }

//       setUsers((prev) => prev.filter((user) => user.id !== id));
//     } catch (err) {
//       console.error(err.message);
//       setError(err.message);
//     }
//   };

//   // ✅ Render
//   return (
//     <div className="container mt-4">
//       {/* Language Switch */}
//       <Dropdown className="mb-3 text-end">
//         <Dropdown.Toggle variant="secondary">
//           {language === "ar" ? "العربية" : "English"}
//         </Dropdown.Toggle>
//         <Dropdown.Menu>
//           <Dropdown.Item onClick={() => setLanguage("en")}>
//             English
//           </Dropdown.Item>
//           <Dropdown.Item onClick={() => setLanguage("ar")}>
//             العربية
//           </Dropdown.Item>
//         </Dropdown.Menu>
//       </Dropdown>

//       <h1 className="mb-4 text-center">{texts[language].title}</h1>

//       {/* Add User Button */}
//       <Button variant="primary" onClick={() => openModal("add")}>
//         {texts[language].addUser}
//       </Button>

//       {/* Error Alert */}
//       {error && (
//         <Alert variant="danger">{`${texts[language].error}: ${error}`}</Alert>
//       )}

//       {/* Loading State */}
//       {loading && (
//         <div className="text-center my-4">
//           <Spinner animation="border" />
//           <p>{texts[language].loading}</p>
//         </div>
//       )}

//       {/* User Table */}
//       {!loading && users.length > 0 ? (
//         <Table striped bordered hover className="mt-4">
//           <thead className="table-dark">
//             <tr>
//               <th>{texts[language].userName}</th>
//               <th>{texts[language].email}</th>
//               <th>{texts[language].role}</th>
//               <th>{texts[language].actions}</th>
//             </tr>
//           </thead>
//           <tbody>
//             {users.map((user) => (
//               <tr key={user.id}>
//                 <td>{user.userName}</td>
//                 <td>{user.email}</td>
//                 <td>{user.role}</td>
//                 <td>
//                   <Button
//                     variant="warning"
//                     size="sm"
//                     onClick={() => openModal("edit", user)}
//                   >
//                     {texts[language].editUser}
//                   </Button>{" "}
//                   <Button
//                     variant="danger"
//                     size="sm"
//                     onClick={() => handleDeleteUser(user.id)}
//                   >
//                     {texts[language].deleteUser}
//                   </Button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//       ) : (
//         !loading && (
//           <p className="text-center mt-4">{texts[language].noUsers}</p>
//         )
//       )}
//     </div>
//   );
// }

// "use client";
// import { useEffect, useState } from "react";
// import {
//   Button,
//   Table,
//   Modal,
//   Form,
//   Alert,
//   Dropdown,
//   Spinner,
// } from "react-bootstrap";

// export default function UsersPage() {
//   // ✅ States
//   const [users, setUsers] = useState([]); // User data
//   const [loading, setLoading] = useState(true); // Loading state
//   const [error, setError] = useState(null); // Error state
//   const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
//   const [modalMode, setModalMode] = useState("add"); // Modal mode (add/edit)
//   const [currentUser, setCurrentUser] = useState(null); // Current user for edit
//   const [formData, setFormData] = useState({
//     userName: "",
//     email: "",
//     role: "",
//   }); // Form data
//   const [language, setLanguage] = useState("ar"); // Default language

//   const token =
//     typeof window !== "undefined" ? localStorage.getItem("token") : null;

//   // ✅ Language Texts
//   const texts = {
//     en: {
//       title: "User Management",
//       addUser: "Add User",
//       editUser: "Edit User",
//       deleteUser: "Delete User",
//       userName: "User Name",
//       email: "Email",
//       role: "Role",
//       actions: "Actions",
//       save: "Save",
//       close: "Close",
//       noUsers: "No Users Found",
//       loading: "Loading Data...",
//       error: "Error",
//     },
//     ar: {
//       title: "إدارة المستخدمين",
//       addUser: "إضافة مستخدم",
//       editUser: "تعديل مستخدم",
//       deleteUser: "حذف مستخدم",
//       userName: "اسم المستخدم",
//       email: "البريد الإلكتروني",
//       role: "الدور",
//       actions: "الإجراءات",
//       save: "حفظ",
//       close: "إغلاق",
//       noUsers: "لا يوجد مستخدمون",
//       loading: "جاري تحميل البيانات...",
//       error: "خطأ",
//     },
//   };

//   // ✅ Update page direction on language change (only content direction)
//   useEffect(() => {
//     const contentElement = document.getElementById("content-wrapper"); // Main content wrapper
//     contentElement.dir = language === "ar" ? "rtl" : "ltr";
//   }, [language]);

//   // ✅ Fetch Users
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         if (!token) {
//           throw new Error("Token is missing. Please log in again.");
//         }

//         const response = await fetch("http://localhost:5000/api/users", {
//           method: "GET",
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         if (!response.ok) {
//           throw new Error("Failed to fetch users");
//         }

//         const result = await response.json();
//         console.log("Fetched Users:", result); // Debugging fetched data
//         setUsers(result?.data || result || []);
//         setLoading(false);
//       } catch (err) {
//         console.error(err.message);
//         setError(err.message);
//         setLoading(false);
//       }
//     };

//     fetchUsers();
//   }, [token]);

//   // ✅ Open Modal
//   const openModal = (mode, user = null) => {
//     setModalMode(mode);
//     setCurrentUser(user);
//     setFormData(user || { userName: "", email: "", role: "" });
//     setIsModalOpen(true);
//   };

//   // ✅ Close Modal
//   const closeModal = () => {
//     setIsModalOpen(false);
//     setCurrentUser(null);
//     setFormData({ userName: "", email: "", role: "" });
//   };

//   // ✅ Handle Input Change
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   // ✅ Save User (Add/Edit)
//   const handleSaveUser = async () => {
//     try {
//       const url =
//         modalMode === "add"
//           ? "http://localhost:5000/api/users/register"
//           : `http://localhost:5000/api/users/${currentUser.id}`;

//       const method = modalMode === "add" ? "POST" : "PUT";

//       const response = await fetch(url, {
//         method,
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(formData),
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to ${modalMode} user`);
//       }

//       const result = await response.json();

//       if (modalMode === "add") {
//         setUsers((prev) => [...prev, result.data]);
//       } else {
//         setUsers((prev) =>
//           prev.map((user) =>
//             user.id === currentUser.id ? { ...user, ...formData } : user
//           )
//         );
//       }

//       closeModal();
//     } catch (err) {
//       console.error(err.message);
//       setError(err.message);
//     }
//   };

//   // ✅ Delete User
//   const handleDeleteUser = async (id) => {
//     try {
//       const response = await fetch(`http://localhost:5000/api/users/${id}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (!response.ok) {
//         throw new Error("Failed to delete user");
//       }

//       setUsers((prev) => prev.filter((user) => user.id !== id));
//     } catch (err) {
//       console.error(err.message);
//       setError(err.message);
//     }
//   };

//   // ✅ Render
//   return (
//     <div className="container mt-4">
//       {/* Language Switch */}
//       <Dropdown className="mb-3 text-end">
//         <Dropdown.Toggle variant="secondary">
//           {language === "ar" ? "العربية" : "English"}
//         </Dropdown.Toggle>
//         <Dropdown.Menu>
//           <Dropdown.Item onClick={() => setLanguage("en")}>
//             English
//           </Dropdown.Item>
//           <Dropdown.Item onClick={() => setLanguage("ar")}>
//             العربية
//           </Dropdown.Item>
//         </Dropdown.Menu>
//       </Dropdown>

//       <h1 className="mb-4 text-center">{texts[language].title}</h1>

//       {/* Add User Button */}
//       <Button variant="primary" onClick={() => openModal("add")}>
//         {texts[language].addUser}
//       </Button>

//       {/* Error Alert */}
//       {error && (
//         <Alert variant="danger">{`${texts[language].error}: ${error}`}</Alert>
//       )}

//       {/* Loading State */}
//       {loading && (
//         <div className="text-center my-4">
//           <Spinner animation="border" />
//           <p>{texts[language].loading}</p>
//         </div>
//       )}

//       {/* Main Content Wrapper */}
//       <div id="content-wrapper">
//         {/* User Table */}
//         {!loading && users.length > 0 ? (
//           <Table striped bordered hover className="mt-4">
//             <thead className="table-dark">
//               <tr>
//                 <th>{texts[language].userName}</th>
//                 <th>{texts[language].email}</th>
//                 <th>{texts[language].role}</th>
//                 {/* <th>{texts[language].actions}</th> */}
//               </tr>
//             </thead>
//             <tbody>
//               {users.map((user) => (
//                 <tr key={user.id}>
//                   <td>{user.userName}</td>
//                   <td>{user.email}</td>
//                   <td>{user.role}</td>
//                   {/* <td>
//                     <Button
//                       variant="warning"
//                       size="sm"
//                       onClick={() => openModal("edit", user)}
//                     >
//                       {texts[language].editUser}
//                     </Button>{" "}
//                     <Button
//                       variant="danger"
//                       size="sm"
//                       onClick={() => handleDeleteUser(user.id)}
//                     >
//                       {texts[language].deleteUser}
//                     </Button>
//                   </td> */}
//                 </tr>
//               ))}
//             </tbody>
//           </Table>
//         ) : (
//           !loading && (
//             <p className="text-center mt-4">{texts[language].noUsers}</p>
//           )
//         )}
//       </div>
//     </div>
//   );
// }
"use client";
import { useEffect, useState } from "react";
import {
  Button,
  Table,
  Modal,
  Form,
  Alert,
  Dropdown,
  Spinner,
} from "react-bootstrap";

export default function UsersPage() {
  // ✅ States
  const [users, setUsers] = useState([]); // User data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [modalMode, setModalMode] = useState("add"); // Modal mode (add/edit)
  const [currentUser, setCurrentUser] = useState(null); // Current user for edit
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    role: "",
    password: "",
  }); // Form data
  const [language, setLanguage] = useState("ar"); // Default language

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // ✅ Language Texts
  const texts = {
    en: {
      title: "User Management",
      addUser: "Add User",
      editUser: "Edit User",
      deleteUser: "Delete User",
      userName: "User Name",
      email: "Email",
      role: "Role",
      password: "Password",
      actions: "Actions",
      save: "Save",
      close: "Close",
      noUsers: "No Users Found",
      loading: "Loading Data...",
      error: "Error",
    },
    ar: {
      title: "إدارة المستخدمين",
      addUser: "إضافة مستخدم",
      editUser: "تعديل مستخدم",
      deleteUser: "حذف مستخدم",
      userName: "اسم المستخدم",
      email: "البريد الإلكتروني",
      role: "الدور",
      password: "كلمة المرور",
      actions: "الإجراءات",
      save: "حفظ",
      close: "إغلاق",
      noUsers: "لا يوجد مستخدمون",
      loading: "جاري تحميل البيانات...",
      error: "خطأ",
    },
  };

  // ✅ Update page direction on language change (only content direction)
  useEffect(() => {
    const contentElement = document.getElementById("content-wrapper"); // Main content wrapper
    contentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);

  // ✅ Fetch Users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (!token) {
          throw new Error("Token is missing. Please log in again.");
        }

        const response = await fetch("http://localhost:5000/api/users", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const result = await response.json();
        console.log("Fetched Users:", result); // Debugging fetched data
        setUsers(result?.data || result || []);
        setLoading(false);
      } catch (err) {
        console.error(err.message);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  // ✅ Open Modal
  const openModal = (mode, user = null) => {
    setModalMode(mode);
    setCurrentUser(user);
    setFormData(user || { userName: "", email: "", role: "", password: "" });
    setIsModalOpen(true); // Ensure the modal state is set to true
  };

  // ✅ Close Modal
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentUser(null);
    setFormData({ userName: "", email: "", role: "", password: "" });
  };

  // ✅ Handle Input Change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // ✅ Save User (Add/Edit)
  const handleSaveUser = async () => {
    try {
      const url =
        modalMode === "add"
          ? "http://localhost:5000/api/users/register"
          : `http://localhost:5000/api/users/${currentUser.id}`;

      const method = modalMode === "add" ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${modalMode} user`);
      }

      const result = await response.json();

      if (modalMode === "add") {
        setUsers((prev) => [...prev, result.data]);
      } else {
        setUsers((prev) =>
          prev.map((user) =>
            user.id === currentUser.id ? { ...user, ...formData } : user
          )
        );
      }

      closeModal();
    } catch (err) {
      console.error(err.message);
      setError(err.message);
    }
  };

  // ✅ Delete User
  const handleDeleteUser = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      setUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (err) {
      console.error(err.message);
      setError(err.message);
    }
  };

  // ✅ Render
  return (
    <div className="container mt-4">
      {/* Language Switch */}
      <Dropdown className="mb-3 text-end">
        <Dropdown.Toggle variant="secondary">
          {language === "ar" ? "العربية" : "English"}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={() => setLanguage("en")}>
            English
          </Dropdown.Item>
          <Dropdown.Item onClick={() => setLanguage("ar")}>
            العربية
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      <h1 className="mb-4 text-center">{texts[language].title}</h1>

      {/* Add User Button */}
      <Button variant="primary" onClick={() => openModal("add")}>
        {texts[language].addUser}
      </Button>

      {/* Error Alert */}
      {error && (
        <Alert variant="danger">{`${texts[language].error}: ${error}`}</Alert>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center my-4">
          <Spinner animation="border" />
          <p>{texts[language].loading}</p>
        </div>
      )}

      {/* Main Content Wrapper */}
      <div id="content-wrapper">
        {/* User Table */}
        {!loading && users.length > 0 ? (
          <Table striped bordered hover className="mt-4">
            <thead className="h5">
              <tr>
                <th>{texts[language].userName}</th>
                <th>{texts[language].email}</th>
                <th>{texts[language].role}</th>
                {/* <th>{texts[language].actions}</th> */}
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.userName}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  {/* <td>
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={() => openModal("edit", user)}
                    >
                      {texts[language].editUser}
                    </Button>{" "}
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      {texts[language].deleteUser}
                    </Button>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          !loading && (
            <p className="text-center mt-4">{texts[language].noUsers}</p>
          )
        )}
      </div>

      {/* Modal for Adding or Editing User */}
      <Modal show={isModalOpen} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalMode === "add"
              ? texts[language].addUser
              : texts[language].editUser}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="userName">
              <Form.Label>{texts[language].userName}</Form.Label>
              <Form.Control
                type="text"
                name="userName"
                value={formData.userName}
                onChange={handleInputChange}
                placeholder="Enter user name"
              />
            </Form.Group>

            <Form.Group controlId="email" className="mt-3">
              <Form.Label>{texts[language].email}</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter email"
              />
            </Form.Group>

            <Form.Group controlId="role" className="mt-3">
              <Form.Label>{texts[language].role}</Form.Label>
              <Form.Control
                type="text"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                placeholder="Enter role"
              />
            </Form.Group>

            <Form.Group controlId="password" className="mt-3">
              <Form.Label>{texts[language].password}</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter password"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            {texts[language].close}
          </Button>
          <Button variant="primary" onClick={handleSaveUser}>
            {texts[language].save}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
