import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Table, Modal, Form, Row, Col } from "react-bootstrap";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function CoursesPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false); // State for view modal
  const [editingCourse, setEditingCourse] = useState(null);
  const [newVideoTitle, setNewVideoTitle] = useState({ en: "", ar: "" });
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [newGameTitle, setNewGameTitle] = useState({ en: "", ar: "" });
  const [newGameUrl, setNewGameUrl] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const [newCourse, setNewCourse] = useState({
    courseMainImage: null,
    courseImages: [],
    mainTitle: { en: "", ar: "" },
    courseField: { en: "", ar: "" },
    description: { en: "", ar: "" },
    videos: [],
    games: [],
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
  const handleSaveCourse = async () => {
    try {
      const formData = new FormData();

      // Handle file uploads with proper field names
      if (newCourse.mainImage) {
        formData.append("courseMainImage", newCourse.mainImage);
      }

      if (newCourse.courseImages?.length > 0) {
        newCourse.courseImages.forEach((image) => {
          formData.append("courseImages", image);
        });
      }

      // Append multilingual fields
      formData.append("mainTitle_en", newCourse.mainTitle.en);
      formData.append("mainTitle_ar", newCourse.mainTitle.ar);
      formData.append("courseField_en", newCourse.courseField.en);
      formData.append("courseField_ar", newCourse.courseField.ar);
      formData.append("description_en", newCourse.description.en);
      formData.append("description_ar", newCourse.description.ar);

      // Format videos and games properly before sending
      const formattedVideos = newCourse.videos.map((video) => ({
        url: video.url,
        title: {
          en: video.title.en,
          ar: video.title.ar,
        },
      }));

      const formattedGames = newCourse.games.map((game) => ({
        url: game.url,
        title: {
          en: game.title.en,
          ar: game.title.ar,
        },
      }));

      formData.append("videos", JSON.stringify(formattedVideos));
      formData.append("games", JSON.stringify(formattedGames));

      console.log("Submitting course data:", Object.fromEntries(formData));

      const url = editingCourse
        ? `https://lin-server.onrender.com/api/updateCourse/${editingCourse._id}`
        : "https://lin-server.onrender.com/api/addCourse";

      const response = await axios.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Server response:", response.data);

      fetchLessons(activeCategory);
      setShowCourseModal(false);
      setNewCourse({
        mainImage: null,
        courseImages: [],
        mainTitle: { en: "", ar: "" },
        courseField: { en: "", ar: "" },
        description: { en: "", ar: "" },
        videos: [],
        games: [],
      });

      Swal.fire({
        title: "Success!",
        text: `Course ${editingCourse ? "updated" : "added"} successfully!`,
        icon: "success",
      });
    } catch (error) {
      console.error("Error saving course:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to save course",
        icon: "error",
      });
    }
  };

  const handleFileChange = (e, field) => {
    const files = e.target.files;
    if (!files) return;

    if (field === "mainImage") {
      setNewCourse((prev) => ({
        ...prev,
        mainImage: files[0],
      }));
    } else if (field === "courseImages") {
      setNewCourse((prev) => ({
        ...prev,
        courseImages: Array.from(files),
      }));
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
    <div className="p-4" dir="rtl">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fw-bold">إدارة الدورات التدريبية</h1>
        <div className="d-flex gap-2">
          <Button
            variant="success"
            className="d-flex align-items-center gap-2"
            onClick={() => setShowCategoryModal(true)}
          >
            <i className="fas fa-folder-plus"></i>
            إضافة تصنيف
          </Button>
          <Button
            variant="primary"
            className="d-flex align-items-center gap-2"
            onClick={() => setShowCourseModal(true)}
          >
            <i className="fas fa-plus-circle"></i>
            إضافة دورة
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
              <tr key={lesson._id || lesson.id}>
                <td>
                  <div>{lesson.mainTitle?.en || ""}</div>
                  <div dir="rtl">{lesson.mainTitle?.ar || ""}</div>
                </td>
                <td>
                  <div>{lesson.courseField?.en || ""}</div>
                  <div dir="rtl">{lesson.courseField?.ar || ""}</div>
                </td>
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
                      onClick={() => navigate(`/course/${lesson._id}`)}
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
              handleSaveCourse();
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
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Main Title (English)</Form.Label>
                  <Form.Control
                    type="text"
                    value={newCourse.mainTitle.en}
                    onChange={(e) =>
                      setNewCourse({
                        ...newCourse,
                        mainTitle: {
                          ...newCourse.mainTitle,
                          en: e.target.value,
                        },
                      })
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Main Title (Arabic)</Form.Label>
                  <Form.Control
                    type="text"
                    value={newCourse.mainTitle.ar}
                    onChange={(e) =>
                      setNewCourse({
                        ...newCourse,
                        mainTitle: {
                          ...newCourse.mainTitle,
                          ar: e.target.value,
                        },
                      })
                    }
                    dir="rtl"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Course Field (English)</Form.Label>
                  <Form.Control
                    type="text"
                    value={newCourse.courseField.en}
                    onChange={(e) =>
                      setNewCourse({
                        ...newCourse,
                        courseField: {
                          ...newCourse.courseField,
                          en: e.target.value,
                        },
                      })
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Course Field (Arabic)</Form.Label>
                  <Form.Control
                    type="text"
                    value={newCourse.courseField.ar}
                    onChange={(e) =>
                      setNewCourse({
                        ...newCourse,
                        courseField: {
                          ...newCourse.courseField,
                          ar: e.target.value,
                        },
                      })
                    }
                    dir="rtl"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Description (English)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={newCourse.description.en}
                    onChange={(e) =>
                      setNewCourse({
                        ...newCourse,
                        description: {
                          ...newCourse.description,
                          en: e.target.value,
                        },
                      })
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Description (Arabic)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={newCourse.description.ar}
                    onChange={(e) =>
                      setNewCourse({
                        ...newCourse,
                        description: {
                          ...newCourse.description,
                          ar: e.target.value,
                        },
                      })
                    }
                    dir="rtl"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Add Videos</Form.Label>
              <div className="d-flex gap-2 mb-3">
                <Form.Control
                  type="text"
                  placeholder="Video Title (English)"
                  value={newVideoTitle.en || ""}
                  onChange={(e) =>
                    setNewVideoTitle((prev) => ({
                      ...prev,
                      en: e.target.value,
                    }))
                  }
                />
                <Form.Control
                  type="text"
                  placeholder="Video Title (Arabic)"
                  value={newVideoTitle.ar || ""}
                  onChange={(e) =>
                    setNewVideoTitle((prev) => ({
                      ...prev,
                      ar: e.target.value,
                    }))
                  }
                  dir="rtl"
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
                    if (newVideoTitle.en && newVideoTitle.ar && newVideoUrl) {
                      setNewCourse((prev) => ({
                        ...prev,
                        videos: [
                          ...prev.videos,
                          {
                            title: {
                              en: newVideoTitle.en,
                              ar: newVideoTitle.ar,
                            },
                            url: newVideoUrl,
                          },
                        ],
                      }));
                      setNewVideoTitle({ en: "", ar: "" });
                      setNewVideoUrl("");
                    }
                  }}
                >
                  Add
                </Button>
              </div>

              {/* Videos list */}
              <div className="videos-list mt-3">
                {newCourse.videos.map((video, index) => (
                  <div
                    key={index}
                    className="d-flex gap-2 mb-2 align-items-center"
                  >
                    <div className="flex-grow-1">
                      <div>{video.title?.en || ""}</div>
                      <div dir="rtl">{video.title?.ar || ""}</div>
                    </div>
                    <div className="flex-grow-1">{video.url}</div>
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
                ))}
              </div>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Add Games</Form.Label>
              <div className="d-flex gap-2 mb-3">
                <Form.Control
                  type="text"
                  placeholder="Game Title (English)"
                  value={newGameTitle.en || ""}
                  onChange={(e) =>
                    setNewGameTitle((prev) => ({
                      ...prev,
                      en: e.target.value,
                    }))
                  }
                />
                <Form.Control
                  type="text"
                  placeholder="Game Title (Arabic)"
                  value={newGameTitle.ar || ""}
                  onChange={(e) =>
                    setNewGameTitle((prev) => ({
                      ...prev,
                      ar: e.target.value,
                    }))
                  }
                  dir="rtl"
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
                    if (newGameTitle.en && newGameTitle.ar && newGameUrl) {
                      setNewCourse((prev) => ({
                        ...prev,
                        games: [
                          ...prev.games,
                          {
                            title: {
                              en: newGameTitle.en,
                              ar: newGameTitle.ar,
                            },
                            url: newGameUrl,
                          },
                        ],
                      }));
                      setNewGameTitle({ en: "", ar: "" });
                      setNewGameUrl("");
                    }
                  }}
                >
                  Add
                </Button>
              </div>

              {/* Games list */}
              <div className="games-list mt-3">
                {newCourse.games.map((game, index) => (
                  <div
                    key={index}
                    className="d-flex gap-2 mb-2 align-items-center"
                  >
                    <div className="flex-grow-1">
                      <div>{game.title?.en || ""}</div>
                      <div dir="rtl">{game.title?.ar || ""}</div>
                    </div>
                    <div className="flex-grow-1">{game.url}</div>
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
                ))}
              </div>
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
            {/* <Form.Group className="mb-4">
              <h5 className="mb-3">Course Features</h5>
              {Object.entries({
                dimensions: "Dimensions / القياس",
                pageCount: "Page Count / عدد الصفحات",
                publishingPlace: "Publishing Place / مكان النشر",
                edition: "Edition / رقم الطبعة",
                publishDate: "Publish Date / تاريخ الطبع",
                language: "Language / لغة النشر",
              }).map(([key, label]) => (
                <div key={key} className="mb-3">
                  <Form.Label>{label}</Form.Label>
                  <Row>
                   <Col md={6}>
                      <Form.Control
                        placeholder="English"
                        value={newCourse.features[key].en}
                        onChange={(e) =>
                          setNewCourse((prev) => ({
                            ...prev,
                            features: {
                              ...prev.features,
                              [key]: {
                                ...prev.features[key],
                                en: e.target.value,
                              },
                            },
                          }))
                        }
                      />
                    </Col> 
                    <Col md={6}>
                      <Form.Control
                        placeholder="Arabic"
                        value={newCourse.features[key].ar}
                        onChange={(e) =>
                          setNewCourse((prev) => ({
                            ...prev,
                            features: {
                              ...prev.features,
                              [key]: {
                                ...prev.features[key],
                                ar: e.target.value,
                              },
                            },
                          }))
                        }
                        dir="rtl"
                      />
                    </Col>
                  </Row>
                </div>
              ))}
            </Form.Group> */}
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
