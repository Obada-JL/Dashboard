import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Card, Container, Row, Col, ListGroup } from "react-bootstrap";

export default function CourseView() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(
          `https://lin-server.onrender.com/api/getCourse/${id}`
        );
        setCourse(response.data);
      } catch (error) {
        console.error("Error fetching course:", error);
      }
    };

    fetchCourse();
  }, [id]);

  if (!course) {
    return <div>Loading...</div>;
  }

  return (
    <Container className="py-4">
      <Card>
        <Card.Header>
          <h2>
            <span className="me-3">{course.mainTitle?.en || ""}</span>
            <span className="text-end" dir="rtl">
              {course.mainTitle?.ar || ""}
            </span>
          </h2>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <h4>Course Field</h4>
              <p>{course.courseField?.en || ""}</p>
              <p dir="rtl">{course.courseField?.ar || ""}</p>
            </Col>
            <Col md={6}>
              <h4>Description</h4>
              <p>{course.description?.en || ""}</p>
              <p dir="rtl">{course.description?.ar || ""}</p>
            </Col>
          </Row>

          <h4 className="mt-4">Videos</h4>
          <ListGroup>
            {course.videos?.map((video, index) => (
              <ListGroup.Item key={index}>
                <h5>{video.title?.en || ""}</h5>
                <h5 dir="rtl">{video.title?.ar || ""}</h5>
                <div className="embed-responsive embed-responsive-16by9">
                  <iframe
                    className="embed-responsive-item"
                    src={video.url}
                    title={video.title?.en || ""}
                    allowFullScreen
                  />
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>

          <h4 className="mt-4">Games</h4>
          <ListGroup>
            {course.games?.map((game, index) => (
              <ListGroup.Item key={index}>
                <h5>{game.title?.en || ""}</h5>
                <h5 dir="rtl">{game.title?.ar || ""}</h5>
                <div className="embed-responsive embed-responsive-16by9">
                  <iframe
                    className="embed-responsive-item"
                    src={game.url}
                    title={game.title?.en || ""}
                    allowFullScreen
                  />
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card.Body>
      </Card>
    </Container>
  );
}
