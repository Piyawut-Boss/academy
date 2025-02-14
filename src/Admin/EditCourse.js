import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './EditCourse.css';

function EditCourse() {
  const [courses, setCourses] = useState([]);
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [coursePrice, setCoursePrice] = useState('');
  const [realPrice, setRealPrice] = useState('');
  const [promotionImage, setPromotionImage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:1337/api/courses?populate=Promotepic')
      .then(response => {
        const allCourses = response.data.data;
        setCourses(allCourses);
      })
      .catch(error => console.error('Error fetching courses:', error));
  }, []);

  const handleEdit = (courseId) => {
    const selectedCourse = courses.find(course => course.id === courseId);
    if (selectedCourse) {
      setCourseTitle(selectedCourse.Title);
      setCourseDescription(selectedCourse.Description);
      setCoursePrice(selectedCourse.Price);
      setRealPrice(selectedCourse.realprice);
      setPromotionImage(selectedCourse.Promotepic?.url || '');
      setIsEditing(true);
      setEditingCourseId(courseId);
    }
  };

  const handleSave = () => {
    const updatedCourse = {
      Title: courseTitle,
      Description: courseDescription,
      Price: coursePrice,
      realprice: realPrice,
      Promotepic: promotionImage,
    };

    axios.put(`http://localhost:1337/api/courses/${editingCourseId}`, { data: updatedCourse })
      .then(response => {
        alert('Course updated successfully!');
        setIsEditing(false);
        setEditingCourseId(null);
      })
      .catch(error => console.error('Error updating course:', error));
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingCourseId(null);
    setCourseTitle('');
    setCourseDescription('');
    setCoursePrice('');
    setRealPrice('');
    setPromotionImage('');
  };

  if (!courses.length) {
    return <div>Loading...</div>;
  }

  return (
    <div className="edit-course-container">
      <h1>Edit Course</h1>
      <div className="edit-course-table">
        <div className="edit-course-table-header">
          <div className="edit-course-table-row">
            <div className="edit-course-table-cell">Course Title</div>
            <div className="edit-course-table-cell">Description</div>
            <div className="edit-course-table-cell">Price</div>
            <div className="edit-course-table-cell">Real Price</div>
            <div className="edit-course-table-cell">Promotion Image</div>
            <div className="edit-course-table-cell">Actions</div>
          </div>
        </div>
        <div className="edit-course-table-body">
          {courses.map(course => (
            <div key={course.id} className="edit-course-table-row">
              <div className="edit-course-table-cell">
                {isEditing && editingCourseId === course.id ? (
                  <input
                    type="text"
                    value={courseTitle}
                    onChange={(e) => setCourseTitle(e.target.value)}
                    className="select-input"
                  />
                ) : (
                  course.Title
                )}
              </div>
              <div className="edit-course-table-cell">
                {isEditing && editingCourseId === course.id ? (
                  <textarea
                    value={courseDescription}
                    onChange={(e) => setCourseDescription(e.target.value)}
                    className="select-input"
                  />
                ) : (
                  course.Description
                )}
              </div>
              <div className="edit-course-table-cell">
                {isEditing && editingCourseId === course.id ? (
                  <input
                    type="number"
                    value={coursePrice}
                    onChange={(e) => setCoursePrice(e.target.value)}
                    className="select-input"
                  />
                ) : (
                  course.Price
                )}
              </div>
              <div className="edit-course-table-cell">
                {isEditing && editingCourseId === course.id ? (
                  <input
                    type="number"
                    value={realPrice}
                    onChange={(e) => setRealPrice(e.target.value)}
                    className="select-input"
                  />
                ) : (
                  course.realprice
                )}
              </div>
              <div className="edit-course-table-cell">
                {isEditing && editingCourseId === course.id ? (
                  <input
                    type="text"
                    value={promotionImage}
                    onChange={(e) => setPromotionImage(e.target.value)}
                    className="select-input"
                  />
                ) : (
                  <img
                    src={`http://localhost:1337${course.Promotepic?.url}`}
                    alt="Promotion"
                    className="promotion-image"
                    width="100"
                    height="100"
                  />
                )}
              </div>
              <div className="edit-course-table-cell">
                {isEditing && editingCourseId === course.id ? (
                  <div className="button-group">
                    <button className="edit-course-button" onClick={handleSave}>Save</button>
                    <button className="edit-course-button cancel" onClick={handleCancel}>Cancel</button>
                  </div>
                ) : (
                  <button className="edit-course-button" onClick={() => handleEdit(course.id)}>Edit</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default EditCourse;
