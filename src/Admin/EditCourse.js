import React, { useEffect, useState} from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom'; 
import "./EditCourse.css";

function EditCourse() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:1337/api/courses?populate=*")
      .then((response) => {
        setCourses(response.data.data);
      })
      .catch((error) => console.error("Error fetching courses:", error));
  }, []);

  return (
    <div className="edit-course-container">
      <h1>Edit Course</h1>
      <table className="edit-course-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Detail</th>
            <th>Units</th>
            <th>Price</th>
            <th>Real Price</th>
            <th>Promotion Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.documentId}>
              <td>{course.Title}</td>
              <td>{course.Description}</td>
              <td>{course.Detail}</td>
              <td>{course.units ? course.units.map((unit) => unit.unitname).join(", ") : "No Units"}</td>
              <td>{course.Price}</td>
              <td>{course.realprice}</td>
              <td>{course.Promotepic?.url ? (
                <img
                  src={`http://localhost:1337${course.Promotepic.url}`}
                  alt="Promotion"
                  className="promotion-image"
                  width="80"
                  height="80"
                />
              ) : (
                "No Image"
              )}</td>
              <td>
                <button
                  className="edit-course-button"
                  onClick={() => navigate(`/admin/editcourse/${course.documentId}`)}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EditCourse;
