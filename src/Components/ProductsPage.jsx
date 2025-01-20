import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Modal,
  Button,
  Card,
  Spinner,
  Container,
  Row,
  Col,
  Form,
} from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    mainImage: null,
    sliderImages: [],
    title: "",
    name: "",
    description: "",
    features: {
      dimensions: "",
      pageCount: "",
      publishingPlace: "",
      edition: "",
      publishDate: "",
      language: "",
    },
  });
  const [loading, setLoading] = useState(false);

  // Fetch Products
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://lin-server.onrender.com/api/getProducts"
      );
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle File Change
  const handleFileChange = (e, field) => {
    if (field === "mainImage") {
      setNewProduct({ ...newProduct, mainImage: e.target.files[0] });
    } else if (field === "sliderImages") {
      setNewProduct({
        ...newProduct,
        sliderImages: Array.from(e.target.files),
      });
    }
  };

  // Handle Input Changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleFeatureChange = (field, value) => {
    setNewProduct((prev) => ({
      ...prev,
      features: {
        ...prev.features,
        [field]: value,
      },
    }));
  };

  // Add or Update Product
  const handleSaveProduct = async () => {
    try {
      const formData = new FormData();

      // Handle mainImage
      if (newProduct.mainImage instanceof File) {
        formData.append("mainImage", newProduct.mainImage);
      } else if (selectedProduct && selectedProduct.mainImage) {
        formData.append("existingMainImage", selectedProduct.mainImage);
      }

      // Handle sliderImages
      if (newProduct.sliderImages.some((img) => img instanceof File)) {
        // If new files were selected
        newProduct.sliderImages.forEach((file) => {
          if (file instanceof File) {
            formData.append("sliderImages", file);
          }
        });
      } else if (selectedProduct && selectedProduct.sliderImages) {
        // Keep existing slider images
        formData.append(
          "existingSliderImages",
          JSON.stringify(selectedProduct.sliderImages)
        );
      }

      formData.append("title", newProduct.title);
      formData.append("name", newProduct.name);
      formData.append("description", newProduct.description);

      // Ensure features is properly stringified
      const features = {
        dimensions: newProduct.features.dimensions || "",
        pageCount: newProduct.features.pageCount || "",
        publishingPlace: newProduct.features.publishingPlace || "",
        edition: newProduct.features.edition || "",
        publishDate: newProduct.features.publishDate || "",
        language: newProduct.features.language || "",
      };
      formData.append("features", JSON.stringify(features));

      if (selectedProduct) {
        await axios.put(
          `https://lin-server.onrender.com/api/updateProduct/${selectedProduct._id}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      } else {
        await axios.post(
          "https://lin-server.onrender.com/api/addProduct",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      }

      fetchProducts();
      handleCloseEditModal();
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id) => {
    try {
      await axios.delete(
        `https://lin-server.onrender.com/api/deleteProduct/${id}`
      );
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // View Product Details
  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  // Open Edit Modal
  const handleEditProduct = () => {
    // Parse the features string if it exists
    let parsedFeatures = {};
    try {
      if (selectedProduct.features) {
        // Handle the case where features is an array of JSON strings
        if (Array.isArray(selectedProduct.features)) {
          parsedFeatures = JSON.parse(selectedProduct.features[0]);
        } else {
          parsedFeatures = JSON.parse(selectedProduct.features);
        }
      }
    } catch (error) {
      console.error("Error parsing features:", error);
    }
    console.log(parsedFeatures.dimensions);
    setNewProduct({
      mainImage: selectedProduct.mainImage,
      sliderImages: selectedProduct.sliderImages,
      title: selectedProduct.title,
      name: selectedProduct.name,
      description: selectedProduct.description,
      features: {
        dimensions: parsedFeatures.dimensions || "",
        pageCount: parsedFeatures.pageCount || "",
        publishingPlace: parsedFeatures.publishingPlace || "",
        edition: parsedFeatures.edition || "",
        publishDate: parsedFeatures.publishDate || "",
        language: parsedFeatures.language || "",
      },
    });
    setShowEditModal(true);
    setShowModal(false);
  };

  // Modal Handlers
  const handleCloseModal = () => setShowModal(false);
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedProduct(null);
    setNewProduct({
      mainImage: null,
      sliderImages: [],
      title: "",
      name: "",
      description: "",
      features: {
        dimensions: "",
        pageCount: "",
        publishingPlace: "",
        edition: "",
        publishDate: "",
        language: "",
      },
    });
  };

  return (
    <Container className="mt-5">
      <h1 className="mb-4 text-center">Products Management</h1>
      <Button
        variant="primary"
        className="mb-4"
        onClick={() => setShowEditModal(true)}
      >
        Add Product
      </Button>

      {/* Product Cards */}
      {loading ? (
        <Spinner animation="border" variant="primary" />
      ) : (
        <Row>
          {products.map((product) => (
            <Col key={product._id} md={4} className="mb-4">
              <Card className="shadow">
                <Card.Img
                  variant="top"
                  //   src={product.mainImage}
                  src={`https://lin-server.onrender.com/productsImages/${product.mainImage}`}
                  alt={product.title}
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <Card.Body>
                  <Card.Title>{product.title}</Card.Title>
                  <div className="d-flex flex-column gap-3 justify-content-between mt-3">
                    <Button
                      variant="info"
                      size="sm"
                      onClick={() => handleViewProduct(product)}
                    >
                      View
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteProduct(product._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* View Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
        <Modal.Header closeButton className="border-bottom-0 bg-light">
          <Modal.Title className="fw-bold">
            <i className="fas fa-info-circle me-2"></i>
            Product Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-4 py-3">
          {selectedProduct && (
            <>
              <Row>
                <Col md={6}>
                  <div className="mb-4">
                    <h6 className="fw-bold mb-3">Main Image</h6>
                    <div
                      className="image-preview-container"
                      style={{ width: "100%", height: "200px" }}
                    >
                      <img
                        src={`https://lin-server.onrender.com/productsImages/${selectedProduct.mainImage}`}
                        alt={selectedProduct.title}
                        className="img-fluid rounded"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-4">
                    <h6 className="fw-bold mb-3">Product Information</h6>
                    <p className="mb-2">
                      <strong>Title:</strong> {selectedProduct.title}
                    </p>
                    <p className="mb-2">
                      <strong>Name:</strong> {selectedProduct.name}
                    </p>
                    <p>
                      <strong>Description:</strong>{" "}
                      {selectedProduct.description}
                    </p>
                  </div>
                </Col>
              </Row>

              <div className="mt-4">
                <h6 className="fw-bold mb-3">Product Features</h6>
                <Row>
                  <Col md={6}>
                    {selectedProduct.features && (
                      <>
                        <p className="mb-2">
                          <strong>القياس:</strong>{" "}
                          {(() => {
                            try {
                              const features = Array.isArray(
                                selectedProduct.features
                              )
                                ? JSON.parse(selectedProduct.features[0])
                                : JSON.parse(selectedProduct.features);
                              return features.dimensions || "Not specified";
                            } catch (e) {
                              return "Not specified";
                            }
                          })()}
                        </p>
                        <p className="mb-2">
                          <strong>عدد الصفحات:</strong>{" "}
                          {(() => {
                            try {
                              const features = Array.isArray(
                                selectedProduct.features
                              )
                                ? JSON.parse(selectedProduct.features[0])
                                : JSON.parse(selectedProduct.features);
                              return features.pageCount || "Not specified";
                            } catch (e) {
                              return "Not specified";
                            }
                          })()}
                        </p>
                        <p className="mb-2">
                          <strong>مكان النشر:</strong>{" "}
                          {(() => {
                            try {
                              const features = Array.isArray(
                                selectedProduct.features
                              )
                                ? JSON.parse(selectedProduct.features[0])
                                : JSON.parse(selectedProduct.features);
                              return (
                                features.publishingPlace || "Not specified"
                              );
                            } catch (e) {
                              return "Not specified";
                            }
                          })()}
                        </p>
                      </>
                    )}
                  </Col>
                  <Col md={6}>
                    {selectedProduct.features && (
                      <>
                        <p className="mb-2">
                          <strong>رقم الطبعة:</strong>{" "}
                          {(() => {
                            try {
                              const features = Array.isArray(
                                selectedProduct.features
                              )
                                ? JSON.parse(selectedProduct.features[0])
                                : JSON.parse(selectedProduct.features);
                              return features.edition || "Not specified";
                            } catch (e) {
                              return "Not specified";
                            }
                          })()}
                        </p>
                        <p className="mb-2">
                          <strong>تاريخ الطبع:</strong>{" "}
                          {(() => {
                            try {
                              const features = Array.isArray(
                                selectedProduct.features
                              )
                                ? JSON.parse(selectedProduct.features[0])
                                : JSON.parse(selectedProduct.features);
                              return features.publishDate || "Not specified";
                            } catch (e) {
                              return "Not specified";
                            }
                          })()}
                        </p>
                        <p className="mb-2">
                          <strong>لغة النشر:</strong>{" "}
                          {(() => {
                            try {
                              const features = Array.isArray(
                                selectedProduct.features
                              )
                                ? JSON.parse(selectedProduct.features[0])
                                : JSON.parse(selectedProduct.features);
                              return features.language || "Not specified";
                            } catch (e) {
                              return "Not specified";
                            }
                          })()}
                        </p>
                      </>
                    )}
                  </Col>
                </Row>
              </div>

              <div className="mt-4">
                <h6 className="fw-bold mb-3">Product Images</h6>
                <Swiper
                  spaceBetween={20}
                  slidesPerView={3}
                  navigation={true}
                  modules={[Navigation]}
                  className="product-slider"
                >
                  {selectedProduct.sliderImages &&
                    selectedProduct.sliderImages.map((image, index) => (
                      <SwiperSlide key={index}>
                        <div className="slider-image-container">
                          <img
                            src={`https://lin-server.onrender.com/productsImages/${image}`}
                            alt={`Product ${index + 1}`}
                            className="img-fluid rounded"
                            style={{
                              width: "100%",
                              height: "150px",
                              objectFit: "cover",
                            }}
                          />
                        </div>
                      </SwiperSlide>
                    ))}
                </Swiper>
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer className="border-top-0 bg-light">
          <Button variant="outline-secondary" onClick={handleCloseModal}>
            <i className="fas fa-times me-2"></i>
            Close
          </Button>
          <Button variant="primary" onClick={handleEditProduct}>
            <i className="fas fa-edit me-2"></i>
            Edit
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add/Edit Modal */}
      <Modal
        show={showEditModal}
        onHide={handleCloseEditModal}
        size="lg"
        centered
      >
        <Modal.Header closeButton className="border-bottom-0 bg-light">
          <Modal.Title className="fw-bold">
            <i className="fas fa-edit me-2"></i>
            {selectedProduct ? "Edit Product" : "Add New Product"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-4 py-3">
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">Main Image</Form.Label>
                  {selectedProduct && selectedProduct.mainImage && (
                    <div className="mb-3 image-preview-container">
                      <img
                        src={`https://lin-server.onrender.com/productsImages/${selectedProduct.mainImage}`}
                        alt="Current main image"
                        className="img-preview rounded"
                      />
                    </div>
                  )}
                  <Form.Control
                    type="file"
                    className="form-control-sm"
                    onChange={(e) => handleFileChange(e, "mainImage")}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">Slider Images</Form.Label>
                  {selectedProduct && selectedProduct.sliderImages && (
                    <div className="mb-3">
                      <Swiper
                        spaceBetween={10}
                        slidesPerView={1}
                        navigation={true}
                        modules={[Navigation]}
                        className="product-slider mb-3"
                      >
                        {selectedProduct.sliderImages.map((image, index) => (
                          <SwiperSlide key={index}>
                            <div className="image-preview-container">
                              <img
                                src={`https://lin-server.onrender.com/productsImages/${image}`}
                                alt={`Slider ${index}`}
                                className="img-preview rounded"
                              />
                            </div>
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    </div>
                  )}
                  <Form.Control
                    type="file"
                    className="form-control-sm"
                    multiple
                    onChange={(e) => handleFileChange(e, "sliderImages")}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Title</Form.Label>
                  <Form.Control
                    name="title"
                    placeholder="Enter product title"
                    value={newProduct.title}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Name</Form.Label>
                  <Form.Control
                    name="name"
                    placeholder="Enter product name"
                    value={newProduct.name}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                placeholder="Enter product description"
                value={newProduct.description}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">القياس</Form.Label>
                  <Form.Control
                    type="text"
                    value={newProduct.features.dimensions}
                    onChange={(e) =>
                      handleFeatureChange("dimensions", e.target.value)
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">عدد الصفحات</Form.Label>
                  <Form.Control
                    type="text"
                    value={newProduct.features.pageCount}
                    onChange={(e) =>
                      handleFeatureChange("pageCount", e.target.value)
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">مكان النشر</Form.Label>
                  <Form.Control
                    type="text"
                    value={newProduct.features.publishingPlace}
                    onChange={(e) =>
                      handleFeatureChange("publishingPlace", e.target.value)
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">رقم الطبعة</Form.Label>
                  <Form.Control
                    type="text"
                    value={newProduct.features.edition}
                    onChange={(e) =>
                      handleFeatureChange("edition", e.target.value)
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">تاريخ الطبع</Form.Label>
                  <Form.Control
                    type="date"
                    value={newProduct.features.publishDate}
                    onChange={(e) =>
                      handleFeatureChange("publishDate", e.target.value)
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">لغة النشر</Form.Label>
                  <Form.Control
                    type="text"
                    value={newProduct.features.language}
                    onChange={(e) =>
                      handleFeatureChange("language", e.target.value)
                    }
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-top-0 bg-light">
          <Button variant="outline-secondary" onClick={handleCloseEditModal}>
            <i className="fas fa-times me-2"></i>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveProduct}>
            <i className="fas fa-save me-2"></i>
            {selectedProduct ? "Update Product" : "Save Product"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ProductsPage;

// Add this CSS to your stylesheet
const styles = `
.product-slider {
  padding: 20px 0;
}

.slider-image-container {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.swiper-button-next,
.swiper-button-prev {
  color: #0d6efd;
  background: rgba(255,255,255,0.9);
  width: 35px;
  height: 35px;
  border-radius: 50%;
  &:after {
    font-size: 18px;
  }
}

.swiper-button-disabled {
  opacity: 0.35;
}

.image-preview-container {
  width: 100px;
  height: 100px;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.img-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.form-control:focus {
  border-color: #80bdff;
  box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
}

.form-control-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  border-radius: 0.2rem;
}

.modal-content {
  border-radius: 0.5rem;
}

.bg-light {
  background-color: #f8f9fa !important;
}

.product-slider {
  padding: 10px 0;
}

.product-slider .swiper-slide {
  display: flex;
  justify-content: center;
}

.product-slider .image-preview-container {
  width: 100%;
  aspect-ratio: 1;
  max-width: 150px;
}

.product-slider .swiper-button-next,
.product-slider .swiper-button-prev {
  width: 30px;
  height: 30px;
  background: rgba(0, 123, 255, 0.9);
  border-radius: 50%;
  color: white;
}

.product-slider .swiper-button-next:after,
.product-slider .swiper-button-prev:after {
  font-size: 14px;
  font-weight: bold;
}

.product-slider .swiper-button-disabled {
  opacity: 0.35;
  background: rgba(0, 0, 0, 0.2);
}

.modal-body p {
  margin-bottom: 0.5rem;
}

.feature-section {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}

.feature-title {
  color: #495057;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.feature-value {
  font-weight: 500;
}
`;
