import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Modal, Input, message, Select, Form } from 'antd';
import { Edit, Plus, Trash2 } from 'lucide-react';
import "./EditCourse.css";

const { confirm } = Modal;

const token = process.env.REACT_APP_STRAPI_API_TOKEN;
const API_BASE = process.env.REACT_APP_API_BASE_URL;


function EditCourse() {
  const [courses, setCourses] = useState([]);
  const [units, setUnits] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [detail, setDetail] = useState('');
  const [price, setPrice] = useState('');
  const [realPrice, setRealPrice] = useState('');
  const [selectedUnits, setSelectedUnits] = useState([]);
  const [promotionImage, setPromotionImage] = useState("");
  const [, setPdfFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [createForm] = Form.useForm();

  useEffect(() => {
    fetchCourses();
    axios
      .get(`${API_BASE}/api/units`)
      .then((response) => {
        setUnits(response.data.data);
      })
      .catch((error) => console.error("Error fetching units:", error));
  }, []);

  const fetchCourses = () => {
    axios
      .get(`${API_BASE}/api/courses?populate=*`)
      .then((response) => {
        setCourses(response.data.data);
      })
      .catch((error) => console.error("Error fetching courses:", error));
  };

  const showModal = (course) => {
    setCurrentCourse(course);
    setTitle(course.Title);
    setDescription(course.Description);
    setDetail(course.Detail);
    setPrice(course.Price);
    setRealPrice(course.realprice);
    setSelectedUnits(course.units ? course.units.map(unit => unit.documentId) : []);
    setPromotionImage(course.Promotepic?.url || "");
    setIsModalVisible(true);
  };

  const showCreateModal = () => {
    setIsCreateModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentCourse(null);
  };

  const handleCreateCancel = () => {
    setIsCreateModalVisible(false);
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
        Promotepic: promotionImage ? { id: promotionImage.id } : null,
      }
    };

    axios.put(`${API_BASE}/api/courses/${currentCourse.documentId}`, updatedCourse, {
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
        fetchCourses();
      })
      .catch(error => {
        console.error('Error updating course:', error);
        message.error('Failed to update course. Please try again.');
      });
  };

  const handleCreate = async (values) => {
    try {
      const courseData = {
        Title: values.title,
        Description: values.description,
        Detail: values.detail,
        Price: values.price,
        realprice: values.realPrice,
        units: values.units,
        Promotepic: promotionImage ? { id: promotionImage.id } : null,
      };

      await axios.post(`${API_BASE}/api/courses`, { data: courseData }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      message.success('Course created successfully');
      setIsCreateModalVisible(false);
      fetchCourses();
    } catch (error) {
      console.error('Error creating course:', error);
      message.error('Failed to create course. Please try again.');
    }
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      await axios.delete(`${API_BASE}/api/courses/${courseId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Refresh the courses list
      fetchCourses();

      message.success("Course deleted successfully!");
    } catch (error) {
      console.error("Error deleting course:", error);
      message.error("Failed to delete course. Please try again.");
    }
  };

  const showDeleteCourseConfirm = (courseId) => {
    confirm({
      title: 'Are you sure you want to delete this course?',
      content: 'This action cannot be undone.',
      onOk() {
        handleDeleteCourse(courseId);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const handleUnitChange = (value) => {
    setSelectedUnits(value);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setPromotionImage(imageUrl);

    handleImageUpload(file);
  };

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("files", file);

    try {
      const response = await axios.post(`${API_BASE}/api/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const uploadedImage = response.data[0];
      setPromotionImage(uploadedImage);

      console.log("Uploaded Image:", uploadedImage);
    } catch (error) {
      console.error("Error uploading image:", error);
      message.error("Failed to upload image. Please try again.");
    }
  };

  const handlePdfUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPdfFile(file);
  };

  const handleDeletePdf = async (unitId) => {
    try {
      await axios.put(`${API_BASE}/api/units/${unitId}`, {
        data: {
          File: null,
        }
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      // Refresh the units list
      axios
        .get(`${API_BASE}/api/units`)
        .then((response) => {
          setUnits(response.data.data);
        })
        .catch((error) => console.error("Error fetching units:", error));

      message.success("PDF file deleted successfully!");
    } catch (error) {
      console.error("Error deleting PDF file:", error);
      message.error("Failed to delete PDF file. Please try again.");
    }
  };

  const showDeletePdfConfirm = (unitId) => {
    confirm({
      title: 'Are you sure you want to delete this PDF file?',
      content: 'This action cannot be undone.',
      onOk() {
        handleDeletePdf(unitId);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsImageModalVisible(true);
  };

  const handleImageModalCancel = () => {
    setIsImageModalVisible(false);
    setSelectedImage(null);
  };

  const filteredCourses = courses.filter(course =>
    course.Title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="edit-course-container">
      <h1>Edit Course</h1>
      <Button
        type="primary"
        icon={<Plus />}
        onClick={showCreateModal}
        style={{ marginBottom: '20px' }}
      >
        Create New Course
      </Button>
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
            <th>Promote Image</th>
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
              <td>{course.Promotepic?.url ? <img src={`${API_BASE}${course.Promotepic.url}`} alt="Promotion" style={{ width: "50px", cursor: "pointer" }} onClick={() => handleImageClick(`${API_BASE}${course.Promotepic.url}`)} /> : "No Image"}</td>
              <td>
                <Button className="edit-course-button" onClick={() => showModal(course)}>Edit</Button>
                <Button
                  className="edit-button-delete"
                  onClick={() => showDeleteCourseConfirm(course.documentId)}
                  style={{ marginLeft: '10px' }}
                >
                  Delete
                </Button>
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
        <div className="form-group">
          <label>Promote Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          {promotionImage && (
            <div>
              <p>Current Promotion Image:</p>
              <img
                src={`${API_BASE}${promotionImage.url || promotionImage}`}
                alt="Promotion"
                style={{ maxWidth: "200px", cursor: "pointer" }}
                onClick={() => handleImageClick(`${API_BASE}${promotionImage.url || promotionImage}`)}
              />
            </div>
          )}
        </div>
        <div className="form-group">
          <label>📄 PDF File (Unit PDF)</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={handlePdfUpload}
          />
          {currentCourse && currentCourse.units && currentCourse.units.map(unit => (
            unit.File && (
              <div key={unit.documentId}>
                <a href={`${API_BASE}${unit.File.url}`} target="_blank" rel="noopener noreferrer">
                  View PDF
                </a>
                <Button
                  icon={<Trash2 />}
                  onClick={() => showDeletePdfConfirm(unit.documentId)}
                  style={{ marginLeft: '10px' }}
                >
                  Delete
                </Button>
              </div>
            )
          ))}
        </div>
        <Button type="primary" onClick={handleSave}>Save</Button>
      </Modal>
      <Modal
        title="Create New Course"
        visible={isCreateModalVisible}
        onCancel={handleCreateCancel}
        onOk={createForm.submit}
      >
        <Form form={createForm} onFinish={handleCreate}>
          <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Please enter the course title' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description" rules={[{ required: true, message: 'Please enter the course description' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="detail" label="Detail" rules={[{ required: true, message: 'Please enter the course detail' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="price" label="Price" rules={[{ required: true, message: 'Please enter the course price' }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="realPrice" label="Real Price" rules={[{ required: true, message: 'Please enter the course real price' }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="units" label="Units" rules={[{ required: true, message: 'Please select units' }]}>
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="Select units"
            >
              {units.map(unit => (
                <Select.Option key={unit.documentId} value={unit.documentId}>
                  {unit.unitname}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="promotionImage" label="PromoteImage">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {promotionImage && (
              <div>
                <p>Current Promotion Image:</p>
                <img
                  src={`${API_BASE}${promotionImage.url || promotionImage}`}
                  alt="Promotion"
                  style={{ maxWidth: "200px", cursor: "pointer" }}
                  onClick={() => handleImageClick(`${API_BASE}${promotionImage.url || promotionImage}`)}
                />
              </div>
            )}
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        visible={isImageModalVisible}
        onCancel={handleImageModalCancel}
        footer={null}
      >
        <img
          src={selectedImage}
          alt="Promotion"
          style={{ width: "100%" }}
        />
      </Modal>
    </div>
  );
}

export default EditCourse;