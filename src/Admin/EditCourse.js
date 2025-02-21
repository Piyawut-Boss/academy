import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-modal";
import "./EditCourse.css";

Modal.setAppElement("#root");

function EditCourse() {
  const [courses, setCourses] = useState([]);
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [coursePrice, setCoursePrice] = useState("");
  const [realPrice, setRealPrice] = useState("");
  const [promotionImage, setPromotionImage] = useState("");
  const [courseDetail, setCourseDetail] = useState("");
  const [courseUnits, setCourseUnits] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState(null);

  const token = '026d08263b3ead716ea4e5b42c788650b0ab4a29f5a51f53d20cd1fb7262636f9a326a1cf4e236e1d5f474ae74b2a54fb57eef2413430ec925fc5cb550114572975324b04adfc8bf0f4adf8c5584b3148ea8d7c1729a996e6a56be2a2c7fe3d909a435bca999ca8ac8e6b3ac8ec222b8d840310e8352e5a47e297ad1893ed245'; // เปลี่ยนให้เป็น token ของคุณ

  useEffect(() => {
    axios
      .get("http://localhost:1337/api/courses?populate=*")
      .then((response) => {
        setCourses(response.data.data);
      })
      .catch((error) => console.error("Error fetching courses:", error));
  }, []);

  const openModal = (courseDocumentId) => {
    const selectedCourse = courses.find((course) => course.documentId === courseDocumentId);
    if (selectedCourse) {
      setCourseTitle(selectedCourse.Title);
      setCourseDescription(selectedCourse.Description);
      setCoursePrice(selectedCourse.Price);
      setRealPrice(selectedCourse.realprice);
      setPromotionImage(selectedCourse.Promotepic?.url || "");
      setCourseDetail(selectedCourse.Detail || "");
      setCourseUnits(selectedCourse.units || []);
      setEditingCourseId(courseDocumentId); // เก็บ documentId
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCourseId(null);
    setCourseTitle("");
    setCourseDescription("");
    setCoursePrice("");
    setRealPrice("");
    setPromotionImage("");
    setCourseDetail("");
    setCourseUnits([]);
  };

  const handleSave = () => {
    const selectedCourse = courses.find(course => course.documentId === editingCourseId);

    if (!selectedCourse || !selectedCourse.documentId) {
      alert('Missing course information');
      return;
    }

    const updatedCourse = {
      data: {
        Title: courseTitle,
        Description: courseDescription,
        Price: coursePrice,
        realprice: realPrice,
        Promotepic: promotionImage ? { url: promotionImage } : null,
        Detail: courseDetail,
        units: courseUnits.length > 0 ? courseUnits : [],
      }
    };

    console.log("Updated Course Data:", updatedCourse);

    axios.put(`http://localhost:1337/api/courses/${selectedCourse.documentId}`, updatedCourse, {  // ใช้ documentId แทน id
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then(() => {
        // Refresh the data after successful update
        return axios.get('http://localhost:1337/api/courses?populate=*');
      })
      .then(response => {
        setCourses(response.data.data); // Update the course list
        setEditingCourseId(null); // Reset the editing state
      })
      .catch(error => {
        console.error('Error updating course:', error);
        alert('Failed to update course. Please try again.');
      });
  };

  if (!courses.length) {
    return <div>Loading...</div>;
  }

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
                <button className="edit-course-button" onClick={() => openModal(course.documentId)}>
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <h2>Edit Course</h2>
        <div className="modal-body">
          <label>Title:</label>
          <input
            type="text"
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
          />

          <label>Description:</label>
          <textarea
            value={courseDescription}
            onChange={(e) => setCourseDescription(e.target.value)}
          />

          <label>Detail:</label>
          <textarea
            value={courseDetail}
            onChange={(e) => setCourseDetail(e.target.value)}
          />

          <label>Price:</label>
          <input
            type="number"
            value={coursePrice}
            onChange={(e) => setCoursePrice(e.target.value)}
          />

          <label>Real Price:</label>
          <input
            type="number"
            value={realPrice}
            onChange={(e) => setRealPrice(e.target.value)}
          />

          <label>Promotion Image URL:</label>
          <input
            type="text"
            value={promotionImage}
            onChange={(e) => setPromotionImage(e.target.value)}
          />

          <label>Units:</label>
          <textarea
            value={courseUnits.map((unit) => unit.unitname).join(", ")}
            onChange={(e) => {
              const updatedUnits = e.target.value
                .split(", ")
                .map((unitname) => ({ unitname }));
              setCourseUnits(updatedUnits);
            }}
          />

          <div className="button-group">
            <button className="edit-course-button" onClick={handleSave}>
              Save
            </button>
            <button className="edit-course-button cancel" onClick={closeModal}>
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default EditCourse;
