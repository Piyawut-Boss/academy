import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./EditCourseDetail.css";

function EditCourseDetail() {
    const { documentId } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [courseTitle, setCourseTitle] = useState("");
    const [courseDescription, setCourseDescription] = useState("");
    const [coursePrice, setCoursePrice] = useState("");
    const [realPrice, setRealPrice] = useState("");
    const [promotionImage, setPromotionImage] = useState("");
    const [courseDetail, setCourseDetail] = useState("");
    const [units, setUnits] = useState([]);
    const [selectedUnit, setSelectedUnit] = useState(null);
    const [unitName, setUnitName] = useState("");
    const [unitDescription, setUnitDescription] = useState("");
    const [videoFile, setVideoFile] = useState(null);
    const [pdfFile, setPdfFile] = useState(null);



    const token = '6fea988a29f7c35f02cf01573097a41fed37f418132ef9d8f1f1243b5e31288fb98f17422433de6792660f6c7b8cd5277c2f1950c095a1c3a2ad7021480520a91d07901a12919476f70610d8e4e62998024a1349faedc87fae8e98caa024aaebe68539f384c0ede8866b6eea4506309dec1d41aee360bdcd4f1f50d2fb769d7e';

    useEffect(() => {
        axios.get(`http://localhost:1337/api/courses/${documentId}?populate=units&populate=Promotepic`)
            .then((response) => {
                const data = response.data.data;
                console.log(data);
                setCourse(data);
                setCourseTitle(data.Title);
                setCourseDescription(data.Description);
                setCoursePrice(data.Price);
                setRealPrice(data.realprice);
                setPromotionImage(data.Promotepic?.url || "");
                setCourseDetail(data.Detail || "");
                if (data.units) {
                    setUnits(data.units);
                }

            })
            .catch((error) => console.error("Error fetching course:", error));
    }, [documentId]);


    useEffect(() => {

        if (selectedUnit && selectedUnit.id) {
            axios.get(`http://localhost:1337/api/units/${selectedUnit.documentId}?populate=video&populate=File`)
                .then((response) => {
                    const unitData = response.data.data;
                    if (unitData.id !== selectedUnit.id) {
                        setSelectedUnit(unitData);
                    }
                })

                .catch((error) => console.error("Error fetching unit data:", error));
        }
    }, [selectedUnit]);


    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // แสดงตัวอย่างไฟล์ก่อน ใช้ URL ชั่วคราวแสดงตัวอย่าง มั้ง
        const imageUrl = URL.createObjectURL(file);
        setPromotionImage(imageUrl);


        handleImageUpload(file);
    };


    const handleImageUpload = async (file) => {

        const formData = new FormData();
        formData.append("files", file);

        console.log("FormData:", formData);
        console.log("Promotion Image URL:", promotionImage);

        try {
            const response = await axios.post("http://localhost:1337/api/upload", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const uploadedImage = response.data[0];
            setPromotionImage(uploadedImage);

            console.log("Uploaded Image:", uploadedImage);
        } catch (error) {
            console.error("Error uploading image:", error);
            alert("การอัปโหลดรูปภาพล้มเหลว กรุณาลองใหม่");
        }
    };

    const handleVideoUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setVideoFile(file);
    };

    const handlePdfUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setPdfFile(file);
    };

    const uploadFile = async (file) => {
        if (!file) return null;


        const formData = new FormData();
        formData.append("files", file);

        console.log("Uploading file:", file);
        console.log("FormData content:", formData.get("files"));

        try {
            const response = await axios.post("http://localhost:1337/api/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });


            console.log(uploadFile);
            console.log("Uploading file:", file);
            console.log("File uploaded successfully", response.data);
            if (response.data && response.data.length > 0) {
                return response.data[0];
            }
        }
        catch (error) {
            console.error("Error uploading file:", error);
            return null;
        }
    };




    const handleSaveUnit = async () => {
        if (!selectedUnit) return;

        const uploadedVideo = videoFile ? await uploadFile(videoFile) : null;
        const uploadedPdf = pdfFile ? await uploadFile(pdfFile) : null;

        const updatedUnit = {
            data: {
                unitname: unitName !== selectedUnit.unitname ? unitName : selectedUnit.unitname,
                Discription: unitDescription !== selectedUnit.Discription ? unitDescription : selectedUnit.Discription,
                video: uploadedVideo ? uploadedVideo.id : selectedUnit.video ? selectedUnit.video.id : null,
                File: uploadedPdf ? uploadedPdf.id : selectedUnit.File ? selectedUnit.File.id : null,
            },
        };

        console.log('Updated Unit:', updatedUnit);

        try {
            const response = await axios.put(`http://localhost:1337/api/units/${selectedUnit.documentId}?populate=*`, updatedUnit, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log("Update Success:", response.data);
            alert("Unit updated successfully!");

        } catch (error) {
            console.error('Error updating unit:', error.response?.data);
            alert('Failed to update unit. Please try again.');
        }
    };



    const handleSave = () => {
        const updatedCourse = {
            data: {
                Title: courseTitle,
                Description: courseDescription,
                Price: coursePrice,
                realprice: realPrice,
                Promotepic: promotionImage ? { id: promotionImage.id } : null,
                Detail: courseDetail,

            }
        };

        axios.put(`http://localhost:1337/api/courses/${documentId}`, updatedCourse, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        })
            .then(() => {
                alert("Course updated successfully!");
                navigate("/admin/editcourse");
            })
            .catch(error => {
                console.error('Error updating course:', error);
                alert('Failed to update course. Please try again.');
            });
    };

    if (!course) return <div>Loading...</div>;

    return (
        <div className="edit-course-detail-container">
            <div className="edit-course-detail-box">
                <span className="title-header">Edit Course</span>

                <div className="edit-course-detail-input-group">
                    <label>Title:</label>
                    <input type="text" value={courseTitle} onChange={(e) => setCourseTitle(e.target.value)} />
                </div>

                <div className="edit-course-detail-input-group">
                    <label>Description:</label>
                    <textarea value={courseDescription} onChange={(e) => setCourseDescription(e.target.value)} />
                </div>

                <div className="edit-course-detail-input-group">
                    <label>Detail:</label>
                    <textarea value={courseDetail} onChange={(e) => setCourseDetail(e.target.value)} />
                </div>

                <div className="edit-course-detail-input-group">
                    <label>Price:</label>
                    <input type="number" value={coursePrice} onChange={(e) => setCoursePrice(e.target.value)} />
                </div>

                <div className="edit-course-detail-input-group">
                    <label>Real Price:</label>
                    <input type="number" value={realPrice} onChange={(e) => setRealPrice(e.target.value)} />
                </div>

                <div className="edit-course-detail-input-group">
                    <label>Promotion Image:</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e)}
                    />
                    {promotionImage && promotionImage.url && (
                        <div>
                            <p>Current Promotion Image:</p>
                            <img
                                src={`http://localhost:1337${promotionImage.url}`}
                                alt="Current Promotion"
                                style={{ maxWidth: "200px" }}
                            />
                        </div>
                    )}
                </div>

                <div className="edit-course-detail-input-group">
                    <label>Select Unit:</label>
                    <select onChange={(e) => {
                        const unitDocumentId = e.target.value;
                        const unit = units.find(u => u.documentId === unitDocumentId);
                        if (unit) {
                            setSelectedUnit(unit);
                            setUnitName(unit.unitname);
                            setUnitDescription(unit.Discription);
                        }
                    }}>
                        <option value="">Select a Unit</option>
                        {units.map((unit) => (
                            <option key={unit.documentId} value={unit.documentId}>{unit.unitname}</option>
                        ))}
                    </select>
                </div>

                {selectedUnit && (
                    <>
                        <div className="edit-course-detail-input-group">
                            <label>Unit Name:</label>
                            <input type="text" value={unitName} onChange={(e) => setUnitName(e.target.value)} />
                        </div>

                        <div className="edit-course-detail-input-group">
                            <label>Description:</label>
                            <textarea value={unitDescription} onChange={(e) => setUnitDescription(e.target.value)} />
                        </div>

                        <div className="edit-course-detail-input-group">
                            <label>Upload Video:</label>
                            <input
                                type="file"
                                accept="video/*"
                                onChange={(e) => handleVideoUpload(e)}
                            />
                            {selectedUnit && selectedUnit.video && (
                                <div>
                                    <p>Current Video:</p>
                                    <video width="200" controls>
                                        <source src={`http://localhost:1337${selectedUnit.video.url}`} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                            )}
                        </div>

                        <div className="edit-course-detail-input-group">
                            <label>Upload PDF File:</label>
                            <input
                                type="file"
                                accept="application/pdf"
                                onChange={(e) => handlePdfUpload(e)}
                            />
                            {selectedUnit && selectedUnit.File && (
                                <div>
                                    <p>Current PDF File:</p>
                                    <a href={`http://localhost:1337${selectedUnit.File.url}`} target="_blank" rel="noopener noreferrer">
                                        View PDF
                                    </a>
                                </div>
                            )}
                        </div>

                        <div className="edit-course-detail-button-group">
                            <button onClick={handleSaveUnit}>Save Unit</button>
                        </div>

                    </>
                )}




                <div className="edit-course-detail-button-group">
                    <button onClick={handleSave}>Save</button>
                    <button onClick={() => navigate("/admin/editcourse")}>Cancel</button>
                </div>
            </div>
        </div>
    );
}

//test
export default EditCourseDetail;    
