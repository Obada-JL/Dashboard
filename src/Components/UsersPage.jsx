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

        const response = await fetch(
          "https://lin-server.onrender.com/api/users",
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

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
          ? "https://lin-server.onrender.com/api/users/register"
          : `https://lin-server.onrender.com/api/users/${currentUser.id}`;

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
      const response = await fetch(
        `https://lin-server.onrender.com/api/users/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

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

      <div className="mb-3">
        <h2>إدارة المستخدمين</h2>
        <Button variant="success" onClick={() => handleShowModal({}, "add")}>
          ➕ إضافة مستخدم جديد
        </Button>
      </div>

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
