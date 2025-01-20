import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Table, Dropdown, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import { translations } from "./translations"; // Import translations
export default function FinishedStudents() {
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState({});
  const [modalMode, setModalMode] = useState("add"); // 'add', 'edit', 'view'
  const [language, setLanguage] = useState("ar"); // Default to Arabic
  const [loading, setLoading] = useState(false); // State to track loading status

  // Fetch Students from API
  const fetchStudents = async () => {
    setLoading(true); // Start loading when fetching
    try {
      const response = await axios.get(
        "https://lin-server.onrender.com/api/getFinishedStudents"
      );
      setStudents(response.data); // Assuming the response is an array of students
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false); // Stop loading once fetching is complete
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleLanguageChange = () => {
    setLanguage(language === "ar" ? "en" : "ar"); // Toggle between Arabic and English
  };

  const handleShowModal = (student = {}, mode = "add") => {
    setSelectedStudent(student);
    setModalMode(mode);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedStudent({});
  };

  const handleSaveStudent = async () => {
    setLoading(true); // Start loading when saving
    const formData = new FormData();
    formData.append("name", selectedStudent.name);
    formData.append("startDate", selectedStudent.startDate);
    formData.append("endDate", selectedStudent.currentPage);
    formData.append("riwayah", selectedStudent.lastLessonDate);
    formData.append("city", selectedStudent.lastQuiz);
    formData.append("note", selectedStudent.note);
    formData.append("finishedStudentImage", selectedStudent.studentImage);

    try {
      if (modalMode === "add") {
        await axios.post(
          "https://lin-server.onrender.com/api/addFinishedStudent",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      } else if (modalMode === "edit") {
        await axios.put(
          `https://lin-server.onrender.com/api/updateFinishedStudent/${selectedStudent._id}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      }
      fetchStudents(); // Refresh student list
      handleCloseModal();
    } catch (error) {
      console.error("Error saving student:", error);
    } finally {
      setLoading(false); // Stop loading once saving is complete
    }
  };

  const handleDeleteStudent = async (id) => {
    setLoading(true); // Start loading when deleting
    Swal.fire({
      title: translations[language].confirmDelete,
      text: translations[language].confirmDeleteText,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: translations[language].confirm,
      cancelButtonText: translations[language].close,
    })
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            await axios.delete(
              `https://lin-server.onrender.com/api/deleteFinishedStudent/${id}`
            );
            fetchStudents(); // Refresh student list
            Swal.fire(translations[language].delete, "", "success");
          } catch (error) {
            console.error("Error deleting student:", error);
          }
        }
      })
      .finally(() => {
        setLoading(false); // Stop loading once deleting is complete
      });
  };

  // Get the translation for the selected language
  const t = translations[language];

  return (
    <div className="p-4 bg-light min-vh-100">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Dropdown>
          <Dropdown.Toggle variant="outline-primary" className="shadow-sm">
            <i className="fas fa-globe me-2"></i>
            {language === "ar" ? "العربية" : "English"}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => setLanguage("en")}>
              <i className="fas fa-flag-usa me-2"></i>English
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setLanguage("ar")}>
              <i className="fas fa-flag me-2"></i>العربية
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <h1 className="fw-bold">إدارة الطلاب الحفاظ</h1>
      </div>

      <div className="bg-white rounded-3 shadow-sm p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <Button
            variant="primary"
            className="d-flex align-items-center gap-2"
            onClick={() => handleShowModal({}, "add")}
          >
            <i className="fas fa-user-plus"></i>
            {t.addStudent}
          </Button>
          <div className="d-flex align-items-center text-muted">
            <i className="fas fa-users me-2"></i>
            <span>Total Students: {students.length}</span>
          </div>
        </div>

        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" variant="primary" />
            <p className="text-muted mt-2">{t.loading}</p>
          </div>
        ) : (
          <div className="table-responsive">
            <Table
              hover
              className="align-middle"
              dir={language === "ar" ? "rtl" : "ltr"}
            >
              <thead>
                <tr>
                  <th className="bg-light">
                    <i className="fas fa-user me-2"></i>
                    {t.name}
                  </th>
                  <th className="bg-light">
                    <i className="fas fa-calendar me-2"></i>
                    {t.startDate}
                  </th>
                  <th className="bg-light">
                    <i className="fas fa-calendar-check me-2"></i>End Date
                  </th>
                  <th className="bg-light text-center">
                    <i className="fas fa-cog me-2"></i>
                    {t.actions}
                  </th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student._id} className="student-row">
                    <td className="fw-medium">{student.name}</td>
                    <td>{student.startDate}</td>
                    <td>{student.riwayah}</td>
                    <td>
                      <div className="d-flex justify-content-center gap-2">
                        <Button
                          variant="outline-warning"
                          size="sm"
                          className="action-button"
                          onClick={() => handleShowModal(student, "edit")}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            class="bi bi-pencil-square"
                            viewBox="0 0 16 16"
                          >
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                            <path
                              fill-rule="evenodd"
                              d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
                            />
                          </svg>
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          className="action-button"
                          onClick={() => handleDeleteStudent(student._id)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            class="bi bi-trash3"
                            viewBox="0 0 16 16"
                          >
                            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
                          </svg>
                        </Button>
                        <Button
                          variant="outline-info"
                          size="sm"
                          className="action-button"
                          onClick={() => handleShowModal(student, "view")}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            class="bi bi-eye"
                            viewBox="0 0 16 16"
                          >
                            <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                            <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                          </svg>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton className="border-bottom-0 bg-light">
          <Modal.Title className="fw-bold">
            <i
              className={`fas ${
                modalMode === "add"
                  ? "fa-user-plus"
                  : modalMode === "edit"
                  ? "fa-user-edit"
                  : "fa-user"
              } me-2`}
            ></i>
            {modalMode === "add"
              ? t.add
              : modalMode === "edit"
              ? t.saveChanges
              : t.view}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-4 py-3">
          <div className="d-flex justify-content-center">
            {selectedStudent.finishedStudentImage && (
              <img
                src={`https://lin-server.onrender.com/studentsImages/${selectedStudent.finishedStudentImage}`}
                onError={(e) => {
                  e.target.src = `https://lin-server.onrender.com/others/${selectedStudent.finishedStudentImage}`;
                }}
                alt="Student"
                width="150"
              />
            )}
          </div>
          <div>
            <label>{t.name}:</label>
            <input
              type="text"
              className="form-control"
              value={selectedStudent.name || ""}
              onChange={(e) =>
                setSelectedStudent({ ...selectedStudent, name: e.target.value })
              }
              disabled={modalMode === "view"}
            />
          </div>
          <div className="mt-2">
            <label>city:</label>
            <input
              type="text"
              className="form-control"
              value={selectedStudent.city || ""}
              onChange={(e) =>
                setSelectedStudent({
                  ...selectedStudent,
                  city: e.target.value,
                })
              }
            />
          </div>
          <div className="mt-2">
            <label>{t.startDate}:</label>
            <input
              type="date"
              className="form-control"
              value={selectedStudent.startDate || ""}
              onChange={(e) =>
                setSelectedStudent({
                  ...selectedStudent,
                  startDate: e.target.value,
                })
              }
              disabled={modalMode === "view"}
            />
          </div>
          <div className="mt-2">
            <label>endDate:</label>
            <input
              type="date"
              className="form-control"
              value={selectedStudent.endDate || ""}
              onChange={(e) =>
                setSelectedStudent({
                  ...selectedStudent,
                  endDate: e.target.value,
                })
              }
              disabled={modalMode === "view"}
            />
          </div>

          {/* Display fields only for view mode */}
          {modalMode === "view" && (
            <>
              <div className="mt-2">
                <label>riwayah:</label>
                <p className="form-control">
                  {selectedStudent.riwayah || t.notAvailable}
                </p>
              </div>
              <div className="mt-2">
                <label>city:</label>
                <p className="form-control">
                  {selectedStudent.city || t.notAvailable}
                </p>
              </div>
              <div className="mt-2">
                <label>{t.note}:</label>
                <p className="form-control">
                  {selectedStudent.note || t.notAvailable}
                </p>
              </div>
              <div className="mt-2">
                <label>{t.studentImage}:</label>
                {selectedStudent.finishedStudentImage && (
                  <img
                    src={`https://lin-server.onrender.com/studentsImages/${selectedStudent.finishedStudentImage}`}
                    onError={(e) => {
                      e.target.src = `https://lin-server.onrender.com/others/${selectedStudent.finishedStudentImage}`;
                    }}
                    alt="Student"
                    width="150"
                  />
                )}
              </div>
            </>
          )}

          {/* Editable Fields for Add/Edit */}
          {modalMode !== "view" && (
            <>
              <div className="mt-2">
                <label>riwayah:</label>
                <input
                  type="TEXT"
                  className="form-control"
                  value={selectedStudent.riwayah || ""}
                  onChange={(e) =>
                    setSelectedStudent({
                      ...selectedStudent,
                      riwayah: e.target.value,
                    })
                  }
                />
              </div>

              <div className="mt-2">
                <label>{t.note}:</label>
                <textarea
                  className="form-control"
                  value={selectedStudent.note || ""}
                  onChange={(e) =>
                    setSelectedStudent({
                      ...selectedStudent,
                      note: e.target.value,
                    })
                  }
                />
              </div>
              {/* <div className="mt-2">
                <label>{t.studentImage}:</label>
                <input
                  type="file"
                  className="form-control"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setSelectedStudent({
                        ...selectedStudent,
                        studentImage: file,
                      });
                    }
                  }}
                />
              </div> */}
            </>
          )}
        </Modal.Body>
        <Modal.Footer className="border-top-0 bg-light">
          <Button variant="outline-secondary" onClick={handleCloseModal}>
            <i className="fas fa-times me-2"></i>
            {t.close}
          </Button>
          {modalMode !== "view" && (
            <Button variant="primary" onClick={handleSaveStudent}>
              <i
                className={`fas ${
                  modalMode === "add" ? "fa-plus" : "fa-save"
                } me-2`}
              ></i>
              {modalMode === "add" ? t.add : t.saveChanges}
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
}

// Add this CSS to your stylesheet
const styles = `
.student-row {
  transition: all 0.2s ease;
}

.student-row:hover {
  background-color: rgba(0,123,255,0.05) !important;
}

.action-button {
  width: 32px;
  height: 32px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.action-button:hover {
  transform: translateY(-2px);
}

.table th {
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.table td {
  font-size: 0.95rem;
}

.modal-content {
  border-radius: 12px;
  overflow: hidden;
}

.form-control:focus {
  border-color: #80bdff;
  box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
}
`;
