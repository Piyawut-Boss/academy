import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { Button, Modal, Input, message, Select } from 'antd';
import { Edit } from 'lucide-react';
import "./EditCourse.css";

const token = '6fea988a29f7c35f02cf01573097a41fed37f418132ef9d8f1f1243b5e31288fb98f17422433de6792660f6c7b8cd5277c2f1950c095a1c3a2ad7021480520a91d07901a12919476f70610d8e4e62998024a1349faedc87fae8e98caa024aaebe68539f384c0ede8866b6eea4506309dec1d41aee360bdcd4f1f50d2fb769d7e';

function EditCourse() {
  const [courses, setCourses] = useState([]);
  const [units, setUnits] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [detail, setDetail] = useState('');
  const [price, setPrice] = useState('');
  const [realPrice, setRealPrice] = useState('');
  const [selectedUnits, setSelectedUnits] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:1337/api/courses?populate=*")
      .then((response) => {
        setCourses(response.data.data);
      })
      .catch((error) => console.error("Error fetching courses:", error));

    axios
      .get("http://localhost:1337/api/units")
      .then((response) => {
        setUnits(response.data.data);
      })
      .catch((error) => console.error("Error fetching units:", error));
  }, []);

  const showModal = (course) => {
    setCurrentCourse(course);
    setTitle(course.Title);
    setDescription(course.Description);
    setDetail(course.Detail);
    setPrice(course.Price);
    setRealPrice(course.realprice);
    setSelectedUnits(course.units ? course.units.map(unit => unit.documentId) : []);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentCourse(null);
  };

  const handleSave = () => {
    if (!currentCourse) return;

    const updatedCourse = {
      data: {
        Title: title,
        Description: description,
        Detail: detail,
        Price: price,
        realprice: realPrice,
        units: selectedUnits,
      }
    };

    axios.put(`http://localhost:1337/api/courses/${currentCourse.documentId}`, updatedCourse, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then(() => {
        message.success("Course updated successfully!");
        setIsModalVisible(false);
        setCurrentCourse(null);
        // Refresh the courses list
        axios
          .get("http://localhost:1337/api/courses?populate=*")
          .then((response) => {
            setCourses(response.data.data);
          })
          .catch((error) => console.error("Error fetching courses:", error));
      })
      .catch(error => {
        console.error('Error updating course:', error);
        message.error('Failed to update course. Please try again.');
      });
  };

  const handleUnitChange = (value) => {
    setSelectedUnits(value);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredCourses = courses.filter(course =>
    course.Title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="edit-course-container">
      <h1>Edit Course</h1>
      <Input
        placeholder="Search by course title"
        value={searchTerm}
        onChange={handleSearch}
        style={{ marginBottom: '20px' }}
      />
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
          {filteredCourses.map((course) => (
            <tr key={course.documentId}>
              <td>{course.Title}</td>
              <td>{course.Description}</td>
              <td>{course.Detail}</td>
              <td>{course.units ? course.units.map((unit) => unit.unitname).join(", ") : "No Units"}</td>
              <td>{course.Price}</td>
              <td>{course.realprice}</td>
              <td>{course.Promotepic?.url ? <img src={`http://localhost:1337${course.Promotepic.url}`} alt="Promotion" style={{ width: "50px" }} /> : "No Image"}</td>
              <td>
                <Button icon={<Edit />} onClick={() => showModal(course)}>Edit</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal
        title="Edit Course Details"
        visible={isModalVisible}
        onCancel={handleCancel}
        onOk={handleSave}
      >
        <div className="form-group">
          <label>Title</label>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <Input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Detail</label>
          <Input
            type="text"
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Price</label>
          <Input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Real Price</label>
          <Input
            type="number"
            value={realPrice}
            onChange={(e) => setRealPrice(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Units</label>
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Select units"
            value={selectedUnits}
            onChange={handleUnitChange}
          >
            {units.map(unit => (
              <Select.Option key={unit.documentId} value={unit.documentId}>
                {unit.unitname}
              </Select.Option>
            ))}
          </Select>
        </div>
        <Button type="primary" onClick={handleSave}>Save</Button>
      </Modal>
    </div>
  );
}

export default EditCourse;