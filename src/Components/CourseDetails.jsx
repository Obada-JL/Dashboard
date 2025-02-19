import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { useTranslation } from "../contexts/LanguageContext";
import axios from "axios";

export default function CourseDetails() {
  const { id } = useParams();
  s;
  const navigate = useNavigate();
  const t = useTranslation();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/getCourse/${id}`
        );
        console.log("Course data:", response.data);
        setCourse(response.data);
      } catch (error) {
        console.error("Error fetching course:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  if (loading)
    return <div className="text-center p-5">{t("common.loading")}</div>;
  if (!course)
    return <div className="text-center p-5">{t("courses.notFound")}</div>;

  return (
    <Container className="py-4">
      <Button variant="primary" onClick={() => navigate(-1)} className="mb-4">
        <i className="fas fa-arrow-left me-2"></i>
        {t("common.back")}
      </Button>

      <Card className="shadow-sm">
        <Card.Header>
          <Row>
            <Col>
              <h2>{course.mainTitle?.en || ""}</h2>
              <h2 dir="rtl" className="text-end">
                {course.mainTitle?.ar || ""}
              </h2>
            </Col>
          </Row>
        </Card.Header>

        <Card.Body>
          <Row className="mb-4">
            <Col md={6}>
              <Card>
                <Card.Body>
                  <h4>{t("courses.courseField")}</h4>
                  <p>{course.courseField?.en || ""}</p>
                  <p dir="rtl">{course.courseField?.ar || ""}</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card>
                <Card.Body>
                  <h4>{t("courses.description")}</h4>
                  <p>{course.description?.en || ""}</p>
                  <p dir="rtl">{course.description?.ar || ""}</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {course.courseMainImage && (
            <div className="text-center mb-4">
              <h4>{t("courses.mainImage")}</h4>
              <img
                src={`http://localhost:5000/courseImages/${course.courseMainImage}`}
                alt={course.mainTitle?.en}
                className="img-fluid rounded"
                style={{ maxHeight: "400px" }}
              />
            </div>
          )}

          <h4 className="mb-3">{t("courses.videos.title")}</h4>
          <Row className="mb-4">
            {course.videos?.map((video, index) => (
              <Col md={6} key={index} className="mb-3">
                <Card>
                  <Card.Body>
                    <h5>{video.title?.en || ""}</h5>
                    <h5 dir="rtl">{video.title?.ar || ""}</h5>
                    <div className="ratio ratio-16x9 mt-2">
                      <iframe
                        src={video.url}
                        title={video.title?.en || ""}
                        allowFullScreen
                        className="rounded"
                      />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          <h4 className="mb-3">{t("courses.games.title")}</h4>
          <Row className="mb-4">
            {course.games?.map((game, index) => (
              <Col md={6} key={index} className="mb-3">
                <Card>
                  <Card.Body>
                    <h5>{game.title?.en || ""}</h5>
                    <h5 dir="rtl">{game.title?.ar || ""}</h5>
                    <div className="ratio ratio-16x9 mt-2">
                      <iframe
                        src={game.url}
                        title={game.title?.en || ""}
                        allowFullScreen
                        className="rounded"
                      />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {course.courseImages && course.courseImages.length > 0 && (
            <>
              <h4 className="mb-3">{t("courses.courseImages")}</h4>
              <Row>
                {course.courseImages.map((image, index) => (
                  <Col md={4} key={index} className="mb-3">
                    <Card>
                      <Card.Img
                        src={`http://localhost:5000/courseImages/${image}`}
                        alt={`Course image ${index + 1}`}
                        className="img-fluid"
                      />
                    </Card>
                  </Col>
                ))}
              </Row>
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}
