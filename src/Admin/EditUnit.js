import React, { useEffect, useState, useCallback } from "react";
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
    const [searchTerm, setSearchTerm] = useState("");
    const [videoFile, setVideoFile] = useState(null);
    const [pdfFile, setPdfFile] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [loading, setLoading] = useState(false);
    
    const token = process.env.REACT_APP_STRAPI_API_TOKEN;
    const pageSize = 10;

    // นิยาม fetchUnitsWithSearch ภายนอก useEffect
    const fetchUnitsWithSearch = useCallback(async (page) => {
        setLoading(true);
        
        let url = `http://localhost:1337/api/units?populate=course&pagination[page]=${page}&pagination[pageSize]=${pageSize}`;
        
        if (searchTerm) {
            url += `&filters[$or][0][unitname][$containsi]=${encodeURIComponent(searchTerm)}`;
            url += `&filters[$or][1][course][Title][$containsi]=${encodeURIComponent(searchTerm)}`;
        }
        
        try {
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const sortedUnits = response.data.data.sort((a, b) => {
                const titleA = a.course?.Title || "";
                const titleB = b.course?.Title || "";
                return titleA.localeCompare(titleB);
            });
            setUnits(sortedUnits);
            setTotalUnits(response.data.meta.pagination.total);
        } catch (error) {
            console.error("Error fetching units:", error);
            message.error("Failed to fetch units. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [searchTerm, token, pageSize]);

    // นิยาม fetchCourses ภายนอก useEffect
    const fetchCourses = useCallback(async () => {
        try {
            const response = await axios.get("http://localhost:1337/api/courses", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setCourses(response.data.data);
        } catch (error) {
            console.error("Error fetching courses:", error);
            message.error("Failed to fetch courses. Please try again.");
        }
    }, [token]);

    useEffect(() => {
        fetchUnitsWithSearch(currentPage);
        fetchCourses();
    }, [currentPage, fetchCourses, fetchUnitsWithSearch]);

    useEffect(() => {
        setCurrentPage(1);
        fetchUnitsWithSearch(1);
    }, [searchTerm, fetchUnitsWithSearch]);

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
        setPdfFile(null);
        setVideoFile(null);
    };

    const handleSave = async () => {
        if (!currentUnit) return;

        const unitName = form.getFieldValue('unitname');
        const unitDescription = form.getFieldValue('Discription');

        const uploadedVideo = videoFile ? await uploadFile(videoFile) : null;
        const uploadedPdf = pdfFile ? await uploadFile(pdfFile) : null;

        const updatedUnit = {
            data: {
                unitname: unitName !== currentUnit.unitname ? unitName : currentUnit.unitname,
                Discription: unitDescription !== currentUnit.Discription ? unitDescription : currentUnit.Discription,
                video: uploadedVideo ? uploadedVideo.id : currentUnit.video ? currentUnit.video.id : null,
                File: uploadedPdf ? uploadedPdf.id : currentUnit.File ? currentUnit.File.id : null,
                course: selectedCourse ? selectedCourse : currentUnit.course?.id
            },
        };

        try {
            const response = await axios.put(`http://localhost:1337/api/units/${currentUnit.documentId}?populate=*`, updatedUnit, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            fetchUnitsWithSearch(currentPage); // เรียกใช้ fetchUnitsWithSearch
            message.success("Unit updated successfully!");
            handleCancel();
        } catch (error) {
            console.error('Error updating unit:', error.response?.data);
            message.error('Failed to update unit. Please try again.');
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
                fetchUnitsWithSearch(currentPage); // เรียกใช้ fetchUnitsWithSearch
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

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleClearSearch = () => {
        setSearchTerm("");
    };

    const uploadFile = async (file) => {
        if (!file) return null;

        const formData = new FormData();
        formData.append("files", file);

        try {
            const response = await axios.post("http://localhost:1337/api/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });

            return response.data[0];
        } catch (error) {
            console.error("Error uploading file:", error);
            message.error("Failed to upload file. Please try again.");
            return null;
        }
    };

    return (
        <div className="edit-unit-container">
            <h2>Units</h2>
            <div style={{ display: 'flex', marginBottom: '20px' }}>
                <Input
                    placeholder="Search by unit name or course title"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    style={{ flex: 1, marginRight: '10px' }}
                    onPressEnter={() => fetchUnitsWithSearch(1)}
                />
                <Button 
                    type="primary" 
                    onClick={() => fetchUnitsWithSearch(1)}
                >
                    Search
                </Button>
                {searchTerm && (
                    <Button 
                        onClick={handleClearSearch}
                        style={{ marginLeft: '10px' }}
                    >
                        Clear
                    </Button>
                )}
            </div>

            <Button 
                type="primary" 
                onClick={() => showModal(null)}
                style={{ marginBottom: '20px' }}
            >
                Create New Unit
            </Button>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>Loading...</div>
            ) : units.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    {searchTerm ? `No units found matching "${searchTerm}"` : "No units available"}
                </div>
            ) : (
                <>
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
                            {units.map((unit) => (
                                <tr key={unit.documentId}>
                                    <td>{unit.unitname}</td>
                                    <td>{unit.Discription}</td>
                                    <td>{unit.video}</td>
                                    <td>{unit.course?.Title}</td>
                                    <td>{unit.File}</td>
                                    <td>
                                        <Button onClick={() => showModal(unit)}>Edit</Button>
                                        <Button 
                                            onClick={() => handleDelete(unit.documentId)} 
                                            danger 
                                            style={{ marginLeft: '10px' }}
                                        >
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                    <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={totalUnits}
                        onChange={handlePageChange}
                        style={{ marginTop: '20px', textAlign: 'center' }}
                        showSizeChanger={false}
                    />
                </>
            )}

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
                        <Upload
                            onChange={({ file }) => setVideoFile(file)}
                            fileList={videoFile ? [videoFile] : []}
                            beforeUpload={() => false} 
                        >
                            <Button icon={<UploadOutlined />}>Click to Upload</Button>
                        </Upload>
                        {videoFile && videoFile.url && (
                            <div>
                                <p>Current Video:</p>
                                <video width="200" controls>
                                    <source src={`http://localhost:1337${videoFile.url}`} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                        )}
                    </Form.Item>
                    <Form.Item name="File" label="File Upload">
                        <Upload
                            onChange={({ file }) => setPdfFile(file)}
                            fileList={pdfFile ? [pdfFile] : []}
                            beforeUpload={() => false}
                        >
                            <Button icon={<UploadOutlined />}>Click to Upload</Button>
                        </Upload>
                        {pdfFile && pdfFile.url && (
                            <div>
                                <p>Current PDF File:</p>
                                <a href={`http://localhost:1337${pdfFile.url}`} target="_blank" rel="noopener noreferrer">
                                    View PDF
                                </a>
                            </div>
                        )}
                    </Form.Item>
                    <Form.Item name="course" label="Course Title" rules={[{ required: true, message: 'Please select a course' }]}>
                        <Select
                            placeholder="Select a course"
                            onChange={(value) => setSelectedCourse(value)} 
                        >
                            {courses.map(course => (
                                <Option key={course.id} value={course.id}>{course.Title}</Option>
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