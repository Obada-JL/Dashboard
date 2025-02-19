import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // If using React Router
import axios from "axios";
export default function CourseDetails() {
  const { id } = useParams();
  const [course, setCourse] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/getCourse/${id}`
        );
        if (response.status != 200) {
          navigate("/404");
        } else if (!response.ok) {
          throw new Error("Failed to fetch course");
        }
        const course = await response.json();
        setCourse(course);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  if (loading) return <p>Loading course details...</p>;
  if (error) return <p>{error}</p>;
  console.log(`http://localhost:5000/courseImages/${course.courseMainImage}`);
  return (
    <div className="container mt-3">
      <div>
        <a href="javascript:history.back()" class="btn btn-primary">
          <i class="bi bi-arrow-left"></i> Back
        </a>
      </div>
      <h1 className="d-flex justify-content-center mb-2">
        {course.courseField}
      </h1>
      <h3 className="d-flex justify-content-center mt-1 mb-3">
        {course.mainTitle}
      </h3>
      <div className="mt-2">
        <h2 className="mt-4 mb-3 ">Main Image</h2>
        <div className="d-flex justify-content-center">
          {course.courseMainImage && (
            <img
              src={`http://localhost:5000/courseImages/${course.courseMainImage}`}
              onError={(e) => {
                e.target.src = `http://localhost:5000/others/${course.courseMainImage}`;
              }}
              alt="Student"
              width="350"
            />
          )}
        </div>
      </div>
      <h2 className="mt-4 mb-3 ">Lessons</h2>
      <div className="d-flex gap-5 flex-wrap justify-content-center">
        {course.videos.map((video, index) => {
          const parsedVideo =
            typeof video === "string" ? JSON.parse(video) : video;
          return (
            <div key={index}>
              <h3>{parsedVideo.title}</h3>
              <iframe
                width="500"
                height="300"
                src={parsedVideo.url}
                title={parsedVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          );
        })}
      </div>
      <h2 className="mt-4 mb-3 ">Games</h2>
      <div className="d-flex gap-5 flex-wrap justify-content-center mt-5 mb-3">
        {course.games.map((Game, index) => {
          const parsedGame = typeof Game === "string" ? JSON.parse(Game) : Game;
          return (
            <div key={index}>
              <h3>{parsedGame.title}</h3>
              <iframe
                src={parsedGame.url}
                title={parsedGame.title}
                width={500}
                height={300}
                className="mediaQuery"
                allowFullScreen
              ></iframe>
            </div>
          );
        })}
      </div>
      <h2 className="mt-4 mb-3 ">Lesson Images</h2>

      {course.courseImages && course.courseImages.length > 0 && (
        <div className="d-flex justify-content-center flex-wrap mb-5">
          {course.courseImages.map((image, index) => (
            <div className="d-flex align-items-center ">
              <img
                key={index}
                src={`http://localhost:5000/courseImages/${image}`}
                onError={(e) => {
                  e.target.src = `http://localhost:5000/others/${image}`;
                }}
                alt={`Image ${index + 1}`}
                width="350"
                style={{ margin: "10px" }} // Optional styling
              />
            </div>
          ))}
        </div>
      )}

      {/* Render other details like videos, images, etc. */}
    </div>
  );
}
