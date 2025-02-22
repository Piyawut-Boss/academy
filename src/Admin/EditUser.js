import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Button, Input, message, Select } from 'antd';  // นำเข้า Select
import './EditUser.css';

function EditUser() {
    const [users, setUsers] = useState([]);
    const [courses, setCourses] = useState([]);  // เพิ่ม state สำหรับ Courses
    const [error, setError] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [selectedCourses, setSelectedCourses] = useState([]);  // เพิ่ม state สำหรับเก็บคอร์สที่เลือก

    const token = '7a636603f59fa4cea900b468684046aa3e662d3f4ba69150200f83fa125b6d5a344aa19158bc53cef7eff2206896575fd1dd23b89034dc77c6b47dc1807e45e123a13a4bcda3834f97f126c52a93755f87495079abeb6e2d31adae8cac4ff33ace41cb45da8d312f5e5edd549935e16106eeedcd2a03b7e3ae7cd961cc52c071';

    useEffect(() => {
        // ดึงข้อมูล users
        axios.get('http://localhost:1337/api/users?populate=courses')
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => {
                console.error('Error fetching users:', error);
                setError('Error fetching users');
            });

        // ดึงข้อมูล Courses (ถ้ามีใน API)
        axios.get('http://localhost:1337/api/courses')
            .then(response => {
                setCourses(response.data.data);  // สมมติว่า API คืนค่าข้อมูลคอร์สใน response.data.data
            })
            .catch(error => {
                console.error('Error fetching courses:', error);
            });
    }, []);

    const handleEdit = (user) => {
        setCurrentUser(user);
        setUsername(user.username);
        setEmail(user.email);
        setSelectedCourses(user.courses ? user.courses.map(course => course.id) : []);  // ตั้งค่า default ของ selected courses
        setIsModalVisible(true);
    };

    const handleSave = async () => {
        console.log('Sending PUT request with the following data:');
        console.log('User ID:', currentUser.id);
        console.log('Username:', username);
        console.log('Email:', email);
        console.log('Selected Courses:', selectedCourses);

        try {
            const response = await axios.put(
                `http://localhost:1337/api/users/${currentUser.id}`,
                { username, email, courses: selectedCourses },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            message.success('User updated successfully!');
            setIsModalVisible(false);
            setUsers(users.map(user => user.id === currentUser.id ? { ...user, username, email, courses: selectedCourses } : user));
        } catch (error) {
            console.error('Error updating user:', error);
            message.error('Error updating user');
            if (error.response) {
                console.log('Error response:', error.response);
            }
        }
    };

    return (
        <div className="edit-user-container">
            <h1>Edit User</h1>
            {error && <p className="error-message">{error}</p>}
            <table className="user-table">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Created At</th>
                        <th>Courses</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                            <td>
                                {user.courses && user.courses.length > 0
                                    ? user.courses.map(course => course.Title).join(', ')
                                    : 'No courses'}
                            </td>
                            <td>
                                <button onClick={() => handleEdit(user)}>Edit</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Modal
                title="Edit User"
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={[
                    <Button key="cancel" onClick={() => setIsModalVisible(false)}>
                        Cancel
                    </Button>,
                    <Button key="save" type="primary" onClick={handleSave}>
                        Save
                    </Button>
                ]}
            >
                <div className="form-group">
                    <label>Username</label>
                    <Input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Courses</label>
                    <Select
                        mode="multiple"  // เลือกหลายคอร์สได้
                        style={{ width: '100%' }}
                        value={selectedCourses}
                        onChange={(value) => setSelectedCourses(value)}
                    >
                        {courses.map(course => (
                            <Select.Option key={course.id} value={course.id}>
                                {course.Title}
                            </Select.Option>
                        ))}
                    </Select>
                </div>
            </Modal>
        </div>
    );
}

export default EditUser;