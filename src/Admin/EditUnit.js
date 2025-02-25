import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button, Input, Form, Select, Pagination, Upload, message } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import "./EditUnit.css";

const { Option } = Select;

function EditUnit() {
    const [units, setUnits] = useState([]);
    const [courses, setCourses] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentUnit, setCurrentUnit] = useState(null);
    const [form] = Form.useForm();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalUnits, setTotalUnits] = useState(0);
    const [fileList, setFileList] = useState([]);
    const [videoList, setVideoList] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const token = "7093189716c93e4954335e0d85b317f18dec5ddd29799221e8727f330bc102c9fb38e45468a2c0432a514482504f360982fc094f85e24cb542a0603f35b3a72a3e201f3996d96e8008768a4b2f9fe351e49ccb066bd5ab2e8d0cf05c5bfa143d0470a74f648bd8d019c776472fa05128e6bfd70608491a1674f3b0307fca0697";

    useEffect(() => {
        fetchUnits(currentPage);
        fetchCourses();
    }, [currentPage]);

    const fetchUnits = (page) => {
        axios
            .get(`http://localhost:1337/api/units?populate=course&pagination[page]=${page}&pagination[pageSize]=10`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then((response) => {
                const sortedUnits = response.data.data.sort((a, b) => {
                    const titleA = a.course?.Title || "";
                    const titleB = b.course?.Title || "";
                    return titleA.localeCompare(titleB);
                });
                setUnits(sortedUnits);
                setTotalUnits(response.data.meta.pagination.total);
            })
            .catch((error) => console.error("Error fetching units:", error));
    };

    const fetchCourses = () => {
        axios
            .get("http://localhost:1337/api/courses", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then((response) => {
                setCourses(response.data.data);
            })
            .catch((error) => console.error("Error fetching courses:", error));
    };

    const showModal = (unit) => {
        setCurrentUnit(unit);
        form.setFieldsValue({
            unitname: unit?.unitname || "",
            Discription: unit?.Discription || "",
            video: unit?.video || "",
            File: unit?.File || "",
            course: unit?.course?.Title || ""
        });
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setCurrentUnit(null);
        form.resetFields();
        setFileList([]);
        setVideoList([]);
    };

    const handleSave = async (values) => {
        try {
            let fileUrl = values.File;
            let videoUrl = values.video;

            if (fileList.length > 0) {
                const formData = new FormData();
                formData.append('files', fileList[0]);
                const uploadRes = await axios.post('http://localhost:1337/api/upload', formData, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                fileUrl = uploadRes.data[0]?.url;
            }

            if (videoList.length > 0) {
                const formData = new FormData();
                formData.append('files', videoList[0]);
                const uploadRes = await axios.post('http://localhost:1337/api/upload', formData, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                videoUrl = uploadRes.data[0]?.url;
            }

            const selectedCourse = courses.find(course => course.Title === values.course);
            const updatedUnit = {
                unitname: values.unitname,
                Discription: values.Discription,
                video: videoUrl,
                course: selectedCourse ? { id: selectedCourse.id, Title: selectedCourse.Title } : null,
                File: fileUrl
            };

            console.log("Saving unit:", updatedUnit);

            const request = currentUnit
                ? axios.put(`http://localhost:1337/api/units/${currentUnit.documentId}`, { data: updatedUnit }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                : axios.post("http://localhost:1337/api/units", { data: updatedUnit }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

            await request;
            fetchUnits(currentPage);
            handleCancel();
            message.success("Unit saved successfully!");
        } catch (error) {
            console.error("Error saving unit:", error);
            if (error.response) {
                console.error("Error response data:", error.response.data);
                message.error(`Failed to save unit: ${error.response.data.message}`);
            } else {
                message.error("Failed to save unit. Please check the API and permissions.");
            }
        }
    };

    const handleDelete = (unitDocumentId) => {
        axios
            .delete(`http://localhost:1337/api/units/${unitDocumentId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(() => {
                fetchUnits(currentPage);
                message.success("Unit deleted successfully!");
            })
            .catch((error) => {
                console.error("Error deleting unit:", error);
                message.error("Failed to delete unit. Please check the API and permissions.");
            });
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredUnits = units.filter(unit => 
        unit.unitname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        unit.course?.Title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const uploadProps = {
        name: 'file',
        action: 'http://localhost:1337/upload',
        headers: {
            Authorization: `Bearer ${token}`
        },
        onChange(info) {
            if (info.file.status === 'done') {
                message.success(`${info.file.name} file uploaded successfully`);
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        }
    };

    return (
        <div className="edit-unit-container">
            <h2>Units</h2>
            <Input
                placeholder="Search by unit name or course title"
                value={searchTerm}
                onChange={handleSearch}
                style={{ marginBottom: '20px' }}
            />
            <Button type="primary" onClick={() => showModal(null)}>Create New Unit</Button>
            <table className="unit-table">
                <thead>
                    <tr>
                        <th>Unit Name</th>
                        <th>Description</th>
                        <th>Video</th>
                        <th>Course Title</th>
                        <th>File</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUnits.map((unit) => (
                        <tr key={unit.documentId}>
                            <td>{unit.unitname}</td>
                            <td>{unit.Discription}</td>
                            <td>{unit.video}</td>
                            <td>{unit.course?.Title}</td>
                            <td>{unit.File}</td>
                            <td>
                                <Button onClick={() => showModal(unit)}>Edit</Button>
                                <Button onClick={() => handleDelete(unit.documentId)} danger>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Pagination
                current={currentPage}
                pageSize={10}
                total={totalUnits}
                onChange={handlePageChange}
                style={{ marginTop: '20px', textAlign: 'center' }}
            />
            <Modal
                title={currentUnit ? "Edit Unit" : "Create New Unit"}
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
            >
                <Form form={form} onFinish={handleSave} layout="vertical">
                    <Form.Item name="unitname" label="Unit Name" rules={[{ required: true, message: 'Please enter unit name' }]}>
                        <Input placeholder="Enter unit name" />
                    </Form.Item>
                    <Form.Item name="Discription" label="Description">
                        <Input.TextArea placeholder="Enter unit description" />
                    </Form.Item>
                    <Form.Item name="video" label="Video Upload">
                        <Upload {...uploadProps} fileList={videoList} onChange={({ fileList }) => setVideoList(fileList)}>
                            <Button icon={<UploadOutlined />}>Click to Upload</Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item name="File" label="File Upload">
                        <Upload {...uploadProps} fileList={fileList} onChange={({ fileList }) => setFileList(fileList)}>
                            <Button icon={<UploadOutlined />}>Click to Upload</Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item name="course" label="Course Title" rules={[{ required: true, message: 'Please select a course' }]}>
                        <Select placeholder="Select a course">
                            {courses.map(course => (
                                <Option key={course.id} value={course.Title}>{course.Title}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">Save</Button>
                        <Button onClick={handleCancel} style={{ marginLeft: '10px' }}>Cancel</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default EditUnit;