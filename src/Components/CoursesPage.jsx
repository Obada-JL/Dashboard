import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Table, Modal, Form } from "react-bootstrap";
import Swal from "sweetalert2";

export default function CoursesPage() {
  const [categories, setCategories] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false); // State for view modal
  const [editingCourse, setEditingCourse] = useState(null);
  const [newVideoTitle, setNewVideoTitle] = useState("");
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [newGameTitle, setNewGameTitle] = useState("");
  const [newGameUrl, setNewGameUrl] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const [newCourse, setNewCourse] = useState({
    mainImage: null,
    mainTitle: "",
    courseField: "",
    videos: [],
    videosTitles: [],
    games: [],
    gameTitles: [],
    courseImages: [],
  });
  const [newCategory, setNewCategory] = useState({
    categoryTitle: "",
    categoryImage: null,
  });
  const [selectedCourse, setSelectedCourse] = useState(null); // To hold selected course for view modal

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchLessons(activeCategory);
  }, [activeCategory]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "https://lin-server.onrender.com/api/getCategorys"
      );
      setCategories(response.data);
      if (response.data.length > 0) {
        setActiveCategory(response.data[0].id);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // const fetchLessons = async (categoryId) => {
  //   try {
  //     const response = await axios.get("https://lin-server.onrender.com/api/getCourses");
  //     response.data.forEach((lesson) => {
  //       if (lesson.courseField === categoryId) {
  //         setLessons((prev) => [...prev, lesson]);
  //       }
  //     });
  //     // setLessons(response.data);
  //   } catch (error) {
  //     console.error("Error fetching lessons:", error);
  //   }
  // };
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };
  const fetchLessons = async (categoryId) => {
    try {
      const response = await axios.get(
        "https://lin-server.onrender.com/api/getCourses"
      );
      if (!categoryId) {
        setLessons(response.data);
        return;
      } else {
        // Filter lessons based on categoryId
        const filteredLessons = response.data.filter(
          (lesson) => lesson.courseField === categoryId
        );
        console.log(response.data, categoryId);
        // Update the state with filtered lessons
        setLessons(filteredLessons); // Replace previous state with new lessons
      }
    } catch (error) {
      console.error("Error fetching lessons:", error);
    }
  };
  const handleAddCourse = async () => {
    const formData = new FormData();
    if (editingCourse) {
      formData.append("id", editingCourse.id);
    }
    if (newCourse.mainImage) {
      formData.append("courseMainImage", newCourse.mainImage);
    } else {
      console.error("Main image is missing!");
    }
    formData.append("mainTitle", newCourse.mainTitle);
    formData.append("courseField", newCourse.courseField);
    // Appending videos as JSON strings
    if (newCourse.videos && newCourse.videos.length > 0) {
      newCourse.videos.forEach((video) => {
        formData.append("videos", JSON.stringify(video)); // Convert each object to a JSON string
      });
    }

    // Appending games as JSON strings
    if (newCourse.games && newCourse.games.length > 0) {
      newCourse.games.forEach((game) => {
        formData.append("games", JSON.stringify(game)); // Convert each object to a JSON string
      });
    }

    if (newCourse.courseImages && newCourse.courseImages.length > 0) {
      newCourse.courseImages.forEach((image, index) => {
        formData.append(`courseImages`, image); // Append each image
      });
    } else {
      console.error("No course images selected!");
    }
    try {
      const response = editingCourse
        ? await axios.put(
            `https://lin-server.onrender.com/api/updateCourse/${editingCourse._id}`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
          )
        : await axios.post(
            "https://lin-server.onrender.com/api/addCourse",
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );
      console.log("Response from server:", response.data);
      fetchLessons(activeCategory);
      setNewCourse({
        mainImage: null,
        mainTitle: "",
        courseField: "",
        videos: [],
        videosTitles: [],
        games: [],
        gameTitles: [],
        courseImages: [],
      });
      setEditingCourse(null);
      setShowCourseModal(false);
      Swal.fire({
        title: "Success!",
        text: `Course ${editingCourse ? "updated" : "added"} successfully!`,
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error(
        `Error ${editingCourse ? "updating" : "adding"} course:`,
        error.response?.data || error
      );
      Swal.fire({
        title: "Error!",
        text: `Failed to ${
          editingCourse ? "update" : "add"
        } course. Check the console for details.`,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };
  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setNewCourse({
      mainImage: null,
      mainTitle: course.mainTitle,
      courseField: course.courseField,
      videos: course.videos,
      videosTitles: course.videosTitles,
      games: course.games,
      gameTitles: course.gameTitles,
      courseImages: course.courseImages,
    });
    setShowCourseModal(true);
  };
  const handleAddCategory = async () => {
    const formData = new FormData();
    formData.append("categoryTitle", newCategory.categoryTitle);
    if (newCategory.categoryImage) {
      formData.append("categoryImage", newCategory.categoryImage);
    } else {
      console.error("Category image is missing!");
    }

    try {
      const response = await axios.post(
        "https://lin-server.onrender.com/api/addCategory",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      console.log("Response from server:", response.data);
      fetchCategories();
      setNewCategory({ categoryTitle: "", categoryImage: null });
      setShowCategoryModal(false);
      Swal.fire({
        title: "Success!",
        text: "Category added successfully!",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Error adding category:", error.response?.data || error);
      Swal.fire({
        title: "Error!",
        text: "Failed to add category. Check the console for details.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleViewCourse = (course) => {
    setSelectedCourse(course); // Set the selected course for the view modal
    setShowViewModal(true); // Show the view modal
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      await axios.delete(
        `https://lin-server.onrender.com/api/deleteCourse/${courseId}`
      );
      fetchLessons(activeCategory);
      Swal.fire({
        title: "Success!",
        text: "Course deleted successfully!",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Error deleting course:", error.response?.data || error);
      Swal.fire({
        title: "Error!",
        text: "Failed to delete course. Check the console for details.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fw-bold">Courses Management</h1>
        <div className="d-flex gap-2">
          <Button
            variant="success"
            className="d-flex align-items-center gap-2"
            onClick={() => setShowCategoryModal(true)}
          >
            <i className="fas fa-folder-plus"></i>
            Add Category
          </Button>
          <Button
            variant="primary"
            className="d-flex align-items-center gap-2"
            onClick={() => setShowCourseModal(true)}
          >
            <i className="fas fa-plus-circle"></i>
            Add Course
          </Button>
        </div>
      </div>

      <div className="bg-light p-3 rounded mb-4">
        <div className="d-flex gap-2 flex-wrap justify-content-center">
          <Button
            variant="outline-primary"
            onClick={() => fetchLessons(undefined)}
            className="px-4"
          >
            <i className="fas fa-th-list me-2"></i>
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              onClick={() => fetchLessons(category.categoryTitle)}
              variant={
                activeCategory === category.id ? "primary" : "outline-primary"
              }
              className="px-4"
            >
              {category.categoryTitle}
            </Button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded shadow-sm p-4">
        <Table hover responsive className="align-middle">
          <thead>
            <tr>
              <th>Title</th>
              <th>Course Field</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {lessons.map((lesson) => (
              <tr key={lesson.id}>
                <td>{lesson.mainTitle}</td>
                <td>{lesson.courseField}</td>
                <td>
                  <div className="d-flex justify-content-center gap-2">
                    <Button
                      variant="outline-warning"
                      size="sm"
                      className="d-flex align-items-center gap-1"
                      onClick={() => handleEditCourse(lesson)}
                    >
                      <i className="fas fa-edit"></i>
                      Edit
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="d-flex align-items-center gap-1"
                      onClick={() => handleDeleteCourse(lesson._id)}
                    >
                      <i className="fas fa-trash-alt"></i>
                      Delete
                    </Button>
                    <Button
                      variant="outline-info"
                      size="sm"
                      className="d-flex align-items-center gap-1"
                      href={`course/${lesson._id}`}
                    >
                      <i className="fas fa-eye"></i>
                      View
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Update Modal Styles */}
      <Modal
        show={showCourseModal}
        onHide={() => setShowCourseModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton className="border-bottom-0">
          <Modal.Title className="fw-bold">
            {editingCourse ? "Edit Course" : "Add New Course"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddCourse();
            }}
          >
            <Form.Group className="mb-3">
              <Form.Label>Main Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setNewCourse({ ...newCourse, mainImage: e.target.files[0] })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Main Title</Form.Label>
              <Form.Control
                type="text"
                value={newCourse.mainTitle}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, mainTitle: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Course field</Form.Label>
              <Form.Control
                type="text"
                value={newCourse.courseField}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, courseField: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Add Videos</Form.Label>
              <div
                style={{ display: "flex", gap: "10px", alignItems: "center" }}
              >
                <Form.Control
                  type="text"
                  placeholder="Video Title"
                  value={newVideoTitle}
                  onChange={(e) => setNewVideoTitle(e.target.value)}
                />
                <Form.Control
                  type="url"
                  placeholder="Video URL"
                  value={newVideoUrl}
                  onChange={(e) => setNewVideoUrl(e.target.value)}
                />
                <Button
                  variant="success"
                  onClick={() => {
                    if (newVideoTitle && newVideoUrl) {
                      setNewCourse((prev) => ({
                        ...prev,
                        videos: [
                          ...prev.videos,
                          { title: newVideoTitle, url: newVideoUrl },
                        ],
                      }));
                      setNewVideoTitle("");
                      setNewVideoUrl("");
                    }
                  }}
                >
                  Add
                </Button>
              </div>
              <ul className="d-flex flex-column gap-3 mt-3">
                <li className="d-flex justify-content-around gap-5">
                  <h6>Video Title</h6>
                  <h6>Video URL</h6>
                  <h6>Actions</h6>
                </li>
                {newCourse.videos.map((video, index) => {
                  const parsedVideo =
                    typeof video === "string" ? JSON.parse(video) : video;
                  return (
                    <div className="d-flex gap-3" key={index}>
                      <Form.Control
                        type="text"
                        placeholder="Video Title"
                        value={parsedVideo.title}
                        // onChange={(e) => setNewVideoTitle(e.target.value)}
                        disabled
                      />
                      <Form.Control
                        type="text"
                        placeholder="Video URL"
                        value={parsedVideo.url}
                        // onChange={(e) => setNewVideoTitle(e.target.value)}
                        disabled
                      />
                      {/* <strong>{video.title}:</strong> {video.url}{" "} */}
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() =>
                          setNewCourse((prev) => ({
                            ...prev,
                            videos: prev.videos.filter((_, i) => i !== index),
                          }))
                        }
                      >
                        Remove
                      </Button>
                    </div>
                  );
                })}
              </ul>
            </Form.Group>
            {/* dddddddddddddddddddddddddddddddddddddddddddddddd */}
            <Form.Group className="mb-3">
              <Form.Label>Add Games</Form.Label>
              <div
                style={{ display: "flex", gap: "10px", alignItems: "center" }}
              >
                <Form.Control
                  type="text"
                  placeholder="Game Title"
                  value={newGameTitle}
                  onChange={(e) => setNewGameTitle(e.target.value)}
                />
                <Form.Control
                  type="url"
                  placeholder="Game URL"
                  value={newGameUrl}
                  onChange={(e) => setNewGameUrl(e.target.value)}
                />
                <Button
                  variant="success"
                  onClick={() => {
                    if (newGameTitle && newGameUrl) {
                      setNewCourse((prev) => ({
                        ...prev,
                        games: [
                          ...prev.games,
                          { title: newGameTitle, url: newGameUrl },
                        ],
                      }));
                      setNewGameTitle("");
                      setNewGameUrl("");
                    }
                  }}
                >
                  Add
                </Button>
              </div>
              <ul className="d-flex flex-column gap-3 mt-3">
                <li className="d-flex justify-content-around gap-5">
                  <h6>Game Title</h6>
                  <h6>Game URL</h6>
                  <h6>Actions</h6>
                </li>
                {newCourse.games.map((game, index) => {
                  const parsedGame =
                    typeof game === "string" ? JSON.parse(game) : game;
                  return (
                    <div className="d-flex gap-3" key={index}>
                      <Form.Control
                        type="text"
                        placeholder="Game Title"
                        value={parsedGame.title}
                        // onChange={(e) => setNewVideoTitle(e.target.value)}
                        disabled
                      />
                      <Form.Control
                        type="text"
                        placeholder="Game URL"
                        value={parsedGame.url}
                        // onChange={(e) => setNewVideoTitle(e.target.value)}
                        disabled
                      />
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() =>
                          setNewCourse((prev) => ({
                            ...prev,
                            games: prev.games.filter((_, i) => i !== index),
                          }))
                        }
                      >
                        Remove
                      </Button>
                    </div>
                  );
                })}
              </ul>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Course Images</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                multiple
                onChange={(e) =>
                  setNewCourse({
                    ...newCourse,
                    courseImages: Array.from(e.target.files),
                  })
                }
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              {editingCourse ? "Update Course" : "Add Course"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Add New Category Modal */}
      <Modal
        show={showCategoryModal}
        onHide={() => setShowCategoryModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add New Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddCategory();
            }}
          >
            <Form.Group className="mb-3">
              <Form.Label>Category Title</Form.Label>
              <Form.Control
                type="text"
                value={newCategory.categoryTitle}
                onChange={(e) =>
                  setNewCategory({
                    ...newCategory,
                    categoryTitle: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setNewCategory({
                    ...newCategory,
                    categoryImage: e.target.files[0],
                  })
                }
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Add Category
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

// Add this CSS to your stylesheet
const styles = `
.table-hover tbody tr:hover {
  background-color: rgba(0,0,0,0.02);
}
.btn {
  transition: all 0.3s ease;
}
.btn:hover {
  transform: translateY(-1px);
}
`;
