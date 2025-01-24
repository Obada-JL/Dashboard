import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Modal,
  Form,
  Spinner,
} from "react-bootstrap";
import Swal from "sweetalert2";

export default function NewsPage() {
  const [news, setNews] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newNews, setNewNews] = useState({
    newsTitle: "",
    newsDescription: "",
    newsDate: "",
    newsCategory: "",
    newsImage: null,
  });

  // Fetch news
  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://lin-server.onrender.com/api/getNews"
      );
      setNews(response.data);
    } catch (error) {
      console.error("Error fetching news:", error);
      Swal.fire("Error", "Failed to fetch news", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNews = async () => {
    try {
      const formData = new FormData();
      formData.append("newsTitle", newNews.newsTitle);
      formData.append("newsDescription", newNews.newsDescription);
      formData.append("newsDate", newNews.newsDate);
      formData.append("newsCategory", newNews.newsCategory);
      if (newNews.newsImage instanceof File) {
        formData.append("newsImage", newNews.newsImage);
      }

      if (selectedNews) {
        await axios.put(
          `https://lin-server.onrender.com/api/updateNews/${selectedNews._id}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      } else {
        await axios.post(
          "https://lin-server.onrender.com/api/addNews",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      }

      fetchNews();
      handleCloseModal();
      Swal.fire(
        "Success",
        `News ${selectedNews ? "updated" : "added"} successfully`,
        "success"
      );
    } catch (error) {
      console.error("Error saving news:", error);
      Swal.fire("Error", "Failed to save news", "error");
    }
  };

  const handleDeleteNews = async (id) => {
    try {
      await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await axios.delete(
            `https://lin-server.onrender.com/api/deleteNews/${id}`
          );
          fetchNews();
          Swal.fire("Deleted!", "News has been deleted.", "success");
        }
      });
    } catch (error) {
      console.error("Error deleting news:", error);
      Swal.fire("Error", "Failed to delete news", "error");
    }
  };

  const handleEditNews = (item) => {
    setSelectedNews(item);
    setNewNews({
      newsTitle: item.newsTitle,
      newsDescription: item.newsDescription,
      newsDate: item.newsDate,
      newsCategory: item.newsCategory,
      newsImage: item.newsImage,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedNews(null);
    setNewNews({
      newsTitle: "",
      newsDescription: "",
      newsDate: "",
      newsCategory: "",
      newsImage: null,
    });
  };

  return (
    <Container className="mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">News Management</h1>
        <Button
          variant="primary"
          className="d-flex align-items-center gap-2"
          onClick={() => setShowModal(true)}
        >
          <i className="fas fa-plus-circle"></i>
          Add News
        </Button>
      </div>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Row>
          {news.map((item) => (
            <Col key={item._id} lg={4} md={6} className="mb-4">
              <Card className="h-100 shadow-sm hover-card">
                <Card.Img
                  variant="top"
                  src={`https://lin-server.onrender.com/newsImages/${item.newsImage}`}
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <Card.Body>
                  <Card.Title>{item.newsTitle}</Card.Title>
                  <Card.Text>{item.newsDescription}</Card.Text>
                  <Card.Text className="text-muted mb-2">
                    <span className="badge bg-primary me-2">
                      {item.newsCategory}
                    </span>
                    {item.newsDate}
                  </Card.Text>
                  <div className="d-flex gap-2">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleEditNews(item)}
                    >
                      <i className="fas fa-edit"></i> Edit
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDeleteNews(item._id)}
                    >
                      <i className="fas fa-trash-alt"></i> Delete
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selectedNews ? "Edit News" : "Add News"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={newNews.newsTitle}
                onChange={(e) =>
                  setNewNews({ ...newNews, newsTitle: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                value={newNews.newsCategory}
                onChange={(e) =>
                  setNewNews({ ...newNews, newsCategory: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newNews.newsDescription}
                onChange={(e) =>
                  setNewNews({ ...newNews, newsDescription: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={newNews.newsDate}
                onChange={(e) =>
                  setNewNews({ ...newNews, newsDate: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Image</Form.Label>
              {selectedNews && selectedNews.newsImage && (
                <div className="mb-2">
                  <img
                    src={`https://lin-server.onrender.com/newsImages/${selectedNews.newsImage}`}
                    alt="Current news"
                    style={{ height: "100px" }}
                    className="d-block rounded"
                  />
                </div>
              )}
              <Form.Control
                type="file"
                onChange={(e) =>
                  setNewNews({ ...newNews, newsImage: e.target.files[0] })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveNews}>
            {selectedNews ? "Update" : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
