// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Modal, Button, Table } from "react-bootstrap";
// import Swal from "sweetalert2";
// import { translations } from "./translations"; // Import translations

import FinishedStudents from "./FinishedStudents";
import ReadingStudents from "./ReadingStudents";

// export default function StudentsPage() {
//   const [students, setStudents] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedStudent, setSelectedStudent] = useState({});
//   const [modalMode, setModalMode] = useState("add"); // 'add', 'edit', 'view'
//   const [language, setLanguage] = useState("ar"); // Default to Arabic

//   // Fetch Students from API
//   const fetchStudents = async () => {
//     try {
//       const response = await axios.get("http://localhost:5000/api/getStudents");
//       setStudents(response.data); // Assuming the response is an array of students
//     } catch (error) {
//       console.error("Error fetching students:", error);
//     }
//   };

//   useEffect(() => {
//     fetchStudents();
//   }, []);

//   const handleLanguageChange = () => {
//     setLanguage(language === "ar" ? "en" : "ar"); // Toggle between Arabic and English
//   };

//   const handleShowModal = (student = {}, mode = "add") => {
//     setSelectedStudent(student);
//     setModalMode(mode);
//     setShowModal(true);
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//     setSelectedStudent({});
//   };

//   const handleSaveStudent = async () => {
//     const formData = new FormData();
//     formData.append("name", selectedStudent.name);
//     formData.append("startDate", selectedStudent.startDate);
//     formData.append("currentPage", selectedStudent.currentPage);
//     formData.append("lastLessonDate", selectedStudent.lastLessonDate);
//     formData.append("lastQuiz", selectedStudent.lastQuiz);
//     formData.append("note", selectedStudent.note);
//     formData.append("studentImage", selectedStudent.studentImage);

//     try {
//       if (modalMode === "add") {
//         await axios.post("http://localhost:5000/api/addStudent", formData, {
//           headers: { "Content-Type": "multipart/form-data" },
//         });
//       } else if (modalMode === "edit") {
//         await axios.put(
//           `http://localhost:5000/api/updateStudent/${selectedStudent._id}`,
//           formData,
//           { headers: { "Content-Type": "multipart/form-data" } }
//         );
//       }
//       fetchStudents(); // Refresh student list
//       handleCloseModal();
//     } catch (error) {
//       console.error("Error saving student:", error);
//     }
//   };

//   const handleDeleteStudent = async (id) => {
//     Swal.fire({
//       title: translations[language].confirmDelete,
//       text: translations[language].confirmDeleteText,
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonText: translations[language].confirm,
//       cancelButtonText: translations[language].close,
//     }).then(async (result) => {
//       if (result.isConfirmed) {
//         try {
//           await axios.delete(`http://localhost:5000/api/deleteStudent/${id}`);
//           fetchStudents(); // Refresh student list
//           Swal.fire(translations[language].delete, "", "success");
//         } catch (error) {
//           console.error("Error deleting student:", error);
//         }
//       }
//     });
//   };

//   // Get the translation for the selected language
//   const t = translations[language];

//   return (
//     <div className="container mt-4" dir={language === "ar" ? "rtl" : "ltr"}>
//       <div className="mb-3">
//         <Button variant="success" onClick={handleLanguageChange}>
//           {language === "ar" ? "Switch to English" : "التبديل إلى العربية"}
//         </Button>
//       </div>

//       {/* Add New Student Button */}
//       <div className="mb-3">
//         <Button variant="success" onClick={() => handleShowModal({}, "add")}>
//           ➕ {t.addStudent}
//         </Button>
//       </div>

//       {/* Table */}
//       <Table striped bordered hover>
//         <thead>
//           <tr>
//             <th>{t.name}</th>
//             <th>{t.startDate}</th>
//             <th>{t.currentPage}</th>
//             <th>{t.actions}</th>
//           </tr>
//         </thead>
//         <tbody>
//           {students.map((student) => (
//             <tr key={student._id}>
//               <td>{student.name}</td>
//               <td>{student.startDate}</td>
//               <td>{student.currentPage}</td>
//               <td>
//                 <Button
//                   variant="primary"
//                   size="sm"
//                   onClick={() => handleShowModal(student, "edit")}
//                 >
//                   ✏️ {t.edit}
//                 </Button>{" "}
//                 <Button
//                   variant="danger"
//                   size="sm"
//                   onClick={() => handleDeleteStudent(student._id)}
//                 >
//                   🗑️ {t.delete}
//                 </Button>{" "}
//                 <Button
//                   variant="info"
//                   size="sm"
//                   onClick={() => handleShowModal(student, "view")}
//                 >
//                   👁️ {t.view}
//                 </Button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </Table>

//       {/* Modal */}
//       <Modal show={showModal} onHide={handleCloseModal}>
//         <Modal.Header closeButton>
//           <Modal.Title>
//             {modalMode === "add"
//               ? t.add
//               : modalMode === "edit"
//               ? t.saveChanges
//               : t.view}
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <div>
//             <label>{t.name}:</label>
//             <input
//               type="text"
//               className="form-control"
//               value={selectedStudent.name || ""}
//               onChange={(e) =>
//                 setSelectedStudent({ ...selectedStudent, name: e.target.value })
//               }
//               disabled={modalMode === "view"}
//             />
//           </div>
//           <div className="mt-2">
//             <label>{t.startDate}:</label>
//             <input
//               type="date"
//               className="form-control"
//               value={selectedStudent.startDate || ""}
//               onChange={(e) =>
//                 setSelectedStudent({
//                   ...selectedStudent,
//                   startDate: e.target.value,
//                 })
//               }
//               disabled={modalMode === "view"}
//             />
//           </div>
//           <div className="mt-2">
//             <label>{t.currentPage}:</label>
//             <input
//               type="number"
//               className="form-control"
//               value={selectedStudent.currentPage || ""}
//               onChange={(e) =>
//                 setSelectedStudent({
//                   ...selectedStudent,
//                   currentPage: e.target.value,
//                 })
//               }
//               disabled={modalMode === "view"}
//             />
//           </div>

//           {/* Editable Fields for Add/Edit */}
//           {modalMode !== "view" && (
//             <>
//               <div className="mt-2">
//                 <label>{t.lastLessonDate}:</label>
//                 <input
//                   type="date"
//                   className="form-control"
//                   value={selectedStudent.lastLessonDate || ""}
//                   onChange={(e) =>
//                     setSelectedStudent({
//                       ...selectedStudent,
//                       lastLessonDate: e.target.value,
//                     })
//                   }
//                 />
//               </div>
//               <div className="mt-2">
//                 <label>{t.lastQuiz}:</label>
//                 <input
//                   type="text"
//                   className="form-control"
//                   value={selectedStudent.lastQuiz || ""}
//                   onChange={(e) =>
//                     setSelectedStudent({
//                       ...selectedStudent,
//                       lastQuiz: e.target.value,
//                     })
//                   }
//                 />
//               </div>
//               <div className="mt-2">
//                 <label>{t.note}:</label>
//                 <textarea
//                   className="form-control"
//                   value={selectedStudent.note || ""}
//                   onChange={(e) =>
//                     setSelectedStudent({
//                       ...selectedStudent,
//                       note: e.target.value,
//                     })
//                   }
//                 />
//               </div>
//               <div className="mt-2">
//                 <label>{t.studentImage}:</label>
//                 <input
//                   type="file"
//                   className="form-control"
//                   onChange={(e) => {
//                     const file = e.target.files[0];
//                     if (file) {
//                       setSelectedStudent({
//                         ...selectedStudent,
//                         studentImage: file,
//                       });
//                     }
//                   }}
//                 />
//               </div>
//             </>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleCloseModal}>
//             {t.close}
//           </Button>
//           {modalMode !== "view" && (
//             <Button variant="primary" onClick={handleSaveStudent}>
//               {modalMode === "add" ? t.add : t.saveChanges}
//             </Button>
//           )}
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// }

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Modal, Button, Table, Dropdown, Spinner } from "react-bootstrap";
// import Swal from "sweetalert2";
// import { translations } from "./translations"; // Import translations

// export default function StudentsPage() {
//   const [students, setStudents] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedStudent, setSelectedStudent] = useState({});
//   const [modalMode, setModalMode] = useState("add"); // 'add', 'edit', 'view'
//   const [language, setLanguage] = useState("ar"); // Default to Arabic

//   // Fetch Students from API
//   const fetchStudents = async () => {
//     try {
//       const response = await axios.get("http://localhost:5000/api/getStudents");
//       setStudents(response.data); // Assuming the response is an array of students
//     } catch (error) {
//       console.error("Error fetching students:", error);
//     }
//   };

//   useEffect(() => {
//     fetchStudents();
//   }, []);

//   const handleLanguageChange = () => {
//     setLanguage(language === "ar" ? "en" : "ar"); // Toggle between Arabic and English
//   };

//   const handleShowModal = (student = {}, mode = "add") => {
//     setSelectedStudent(student);
//     setModalMode(mode);
//     setShowModal(true);
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//     setSelectedStudent({});
//   };

//   const handleSaveStudent = async () => {
//     const formData = new FormData();
//     formData.append("name", selectedStudent.name);
//     formData.append("startDate", selectedStudent.startDate);
//     formData.append("currentPage", selectedStudent.currentPage);
//     formData.append("lastLessonDate", selectedStudent.lastLessonDate);
//     formData.append("lastQuiz", selectedStudent.lastQuiz);
//     formData.append("note", selectedStudent.note);
//     formData.append("studentImage", selectedStudent.studentImage);

//     try {
//       if (modalMode === "add") {
//         await axios.post("http://localhost:5000/api/addStudent", formData, {
//           headers: { "Content-Type": "multipart/form-data" },
//         });
//       } else if (modalMode === "edit") {
//         await axios.put(
//           `http://localhost:5000/api/updateStudent/${selectedStudent._id}`,
//           formData,
//           { headers: { "Content-Type": "multipart/form-data" } }
//         );
//       }
//       fetchStudents(); // Refresh student list
//       handleCloseModal();
//     } catch (error) {
//       console.error("Error saving student:", error);
//     }
//   };

//   const handleDeleteStudent = async (id) => {
//     Swal.fire({
//       title: translations[language].confirmDelete,
//       text: translations[language].confirmDeleteText,
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonText: translations[language].confirm,
//       cancelButtonText: translations[language].close,
//     }).then(async (result) => {
//       if (result.isConfirmed) {
//         try {
//           await axios.delete(`http://localhost:5000/api/deleteStudent/${id}`);
//           fetchStudents(); // Refresh student list
//           Swal.fire(translations[language].delete, "", "success");
//         } catch (error) {
//           console.error("Error deleting student:", error);
//         }
//       }
//     });
//   };

//   // Get the translation for the selected language
//   const t = translations[language];

//   return (
//     <div className="container mt-4">
//       <div className="mb-3">
//         {/* <Button variant="success" onClick={handleLanguageChange}>
//           {language === "ar" ? "Switch to English" : "التبديل إلى العربية"}
//         </Button> */}
//         <Dropdown className="mb-3 text-end">
//           <Dropdown.Toggle variant="secondary">
//             {language === "ar" ? "العربية" : "English"}
//           </Dropdown.Toggle>
//           <Dropdown.Menu>
//             <Dropdown.Item onClick={() => setLanguage("en")}>
//               English
//             </Dropdown.Item>
//             <Dropdown.Item onClick={() => setLanguage("ar")}>
//               العربية
//             </Dropdown.Item>
//           </Dropdown.Menu>
//         </Dropdown>
//       </div>
//       <h1 className="mb-4 text-center">{t.studentsTitle}</h1>
//       {/* Add New Student Button */}
//       <div className="mb-3">
//         <Button variant="success" onClick={() => handleShowModal({}, "add")}>
//           ➕ {t.addStudent}
//         </Button>
//       </div>
//       {/* {loading && (
//       )} */}
//       <div className="text-center my-4 ">
//         <Spinner animation="border" />
//         <p>{t.loading}</p>
//       </div>
//       {/* Table */}
//       <Table striped bordered hover dir={language === "ar" ? "rtl" : "ltr"}>
//         <thead>
//           <tr>
//             <th>{t.name}</th>
//             <th>{t.startDate}</th>
//             <th>{t.currentPage}</th>
//             <th>{t.actions}</th>
//           </tr>
//         </thead>

//         <tbody>
//           {students.map((student) => (
//             <tr key={student._id}>
//               <td>{student.name}</td>
//               <td>{student.startDate}</td>
//               <td>{student.currentPage}</td>
//               <td>
//                 <Button
//                   variant="warning"
//                   size="sm"
//                   onClick={() => handleShowModal(student, "edit")}
//                 >
//                   ✏️ {t.edit}
//                 </Button>{" "}
//                 <Button
//                   variant="danger"
//                   size="sm"
//                   onClick={() => handleDeleteStudent(student._id)}
//                 >
//                   🗑️ {t.delete}
//                 </Button>{" "}
//                 <Button
//                   variant="info"
//                   size="sm"
//                   onClick={() => handleShowModal(student, "view")}
//                 >
//                   👁️ {t.view}
//                 </Button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </Table>

//       {/* Modal */}
//       <Modal show={showModal} onHide={handleCloseModal}>
//         <Modal.Header closeButton>
//           <Modal.Title>
//             {modalMode === "add"
//               ? t.add
//               : modalMode === "edit"
//               ? t.saveChanges
//               : t.view}
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <div>
//             <label>{t.name}:</label>
//             <input
//               type="text"
//               className="form-control"
//               value={selectedStudent.name || ""}
//               onChange={(e) =>
//                 setSelectedStudent({ ...selectedStudent, name: e.target.value })
//               }
//               disabled={modalMode === "view"}
//             />
//           </div>
//           <div className="mt-2">
//             <label>{t.startDate}:</label>
//             <input
//               type="date"
//               className="form-control"
//               value={selectedStudent.startDate || ""}
//               onChange={(e) =>
//                 setSelectedStudent({
//                   ...selectedStudent,
//                   startDate: e.target.value,
//                 })
//               }
//               disabled={modalMode === "view"}
//             />
//           </div>
//           <div className="mt-2">
//             <label>{t.currentPage}:</label>
//             <input
//               type="number"
//               className="form-control"
//               value={selectedStudent.currentPage || ""}
//               onChange={(e) =>
//                 setSelectedStudent({
//                   ...selectedStudent,
//                   currentPage: e.target.value,
//                 })
//               }
//               disabled={modalMode === "view"}
//             />
//           </div>

//           {/* Display fields only for view mode */}
//           {modalMode === "view" && (
//             <>
//               <div className="mt-2">
//                 <label>{t.lastLessonDate}:</label>
//                 <p className="form-control">
//                   {selectedStudent.lastLessonDate || t.notAvailable}
//                 </p>
//               </div>
//               <div className="mt-2">
//                 <label>{t.lastQuiz}:</label>
//                 <p className="form-control">
//                   {selectedStudent.lastQuiz || t.notAvailable}
//                 </p>
//               </div>
//               <div className="mt-2">
//                 <label>{t.note}:</label>
//                 <p className="form-control">
//                   {selectedStudent.note || t.notAvailable}
//                 </p>
//               </div>
//               <div className="mt-2">
//                 <label>{t.studentImage}:</label>
//                 {selectedStudent.studentImage && (
//                   <img
//                     src={`http://localhost:5000/uploads/studentsImages/${selectedStudent.studentImage}`}
//                     alt="Student"
//                     width="150"
//                   />
//                 )}
//               </div>
//             </>
//           )}

//           {/* Editable Fields for Add/Edit */}
//           {modalMode !== "view" && (
//             <>
//               <div className="mt-2">
//                 <label>{t.lastLessonDate}:</label>
//                 <input
//                   type="date"
//                   className="form-control"
//                   value={selectedStudent.lastLessonDate || ""}
//                   onChange={(e) =>
//                     setSelectedStudent({
//                       ...selectedStudent,
//                       lastLessonDate: e.target.value,
//                     })
//                   }
//                 />
//               </div>
//               <div className="mt-2">
//                 <label>{t.lastQuiz}:</label>
//                 <input
//                   type="text"
//                   className="form-control"
//                   value={selectedStudent.lastQuiz || ""}
//                   onChange={(e) =>
//                     setSelectedStudent({
//                       ...selectedStudent,
//                       lastQuiz: e.target.value,
//                     })
//                   }
//                 />
//               </div>
//               <div className="mt-2">
//                 <label>{t.note}:</label>
//                 <textarea
//                   className="form-control"
//                   value={selectedStudent.note || ""}
//                   onChange={(e) =>
//                     setSelectedStudent({
//                       ...selectedStudent,
//                       note: e.target.value,
//                     })
//                   }
//                 />
//               </div>
//               <div className="mt-2">
//                 <label>{t.studentImage}:</label>
//                 <input
//                   type="file"
//                   className="form-control"
//                   onChange={(e) => {
//                     const file = e.target.files[0];
//                     if (file) {
//                       setSelectedStudent({
//                         ...selectedStudent,
//                         studentImage: file,
//                       });
//                     }
//                   }}
//                 />
//               </div>
//             </>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleCloseModal}>
//             {t.close}
//           </Button>
//           {modalMode !== "view" && (
//             <Button variant="primary" onClick={handleSaveStudent}>
//               {modalMode === "add" ? t.add : t.saveChanges}
//             </Button>
//           )}
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// }

export default function StudentsPage() {
  return (
    <>
      <div>
        <ReadingStudents />
      </div>
      <div>
        <FinishedStudents />
      </div>
    </>
  );
}
