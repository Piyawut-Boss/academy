import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Button, Input, message, Select } from 'antd';
import './EditUser.css';

function EditUser() {
    const [users, setUsers] = useState([]);
    const [courses, setCourses] = useState([]);
    const [error, setError] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isRegisterModalVisible, setIsRegisterModalVisible] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [selectedCourses, setSelectedCourses] = useState([]);

    const token = '7a636603f59fa4cea900b468684046aa3e662d3f4ba69150200f83fa125b6d5a344aa19158bc53cef7eff2206896575fd1dd23b89034dc77c6b47dc1807e45e123a13a4bcda3834f97f126c52a93755f87495079abeb6e2d31adae8cac4ff33ace41cb45da8d312f5e5edd549935e16106eeedcd2a03b7e3ae7cd961cc52c071';

    useEffect(() => {
        axios.get('http://localhost:1337/api/users?populate=courses')
            .then(response => setUsers(response.data))
            .catch(error => setError('Error fetching users'));

        axios.get('http://localhost:1337/api/courses')
            .then(response => setCourses(response.data.data))
            .catch(error => console.error('Error fetching courses:', error));
    }, []);

    const handleEdit = (user) => {
        setCurrentUser(user);
        setUsername(user.username);
        setEmail(user.email);
        setPassword('');  // Clear the password field when editing
        setSelectedCourses(user.courses ? user.courses.map(course => course.documentId) : []);
        setIsModalVisible(true);
    };

    const handleSave = async () => {
        try {
            const data = { username, email, courses: selectedCourses };
            await axios.put(`http://localhost:1337/api/users/${currentUser.id}`, data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            message.success('User updated successfully!');
            setIsModalVisible(false);
            setUsers(users.map(user => user.id === currentUser.id ? { ...user, username, email, courses: selectedCourses } : user));
        } catch (error) {
            message.error('Error updating user');
        }
    };

    const handleCreateAccount = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match!');
            return;
        }

        try {
            await axios.post('http://localhost:1337/api/auth/local/register', { username, email, password });
            message.success('Account created successfully!');
            setIsRegisterModalVisible(false);
        } catch (error) {
            message.error('Error creating account');
        }
    };

    return (
        <div className="edit-user-container">
            <h1>Edit User</h1>
            {error && <p className="error-message">{error}</p>}
            <Button type="primary" onClick={() => setIsRegisterModalVisible(true)}>Create Account</Button>
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
                            <td>{user.courses && user.courses.length > 0 ? user.courses.map(course => course.Title).join(', ') : 'No courses'}</td>
                            <td>
                                <button onClick={() => handleEdit(user)}>Edit</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Edit User Modal */}
            <Modal title="Edit User" visible={isModalVisible} onCancel={() => setIsModalVisible(false)} footer={null}>
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
                        mode="multiple"
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
                <Button type="primary" onClick={handleSave}>Save</Button>
            </Modal>

            {/* Create Account Modal */}
            <Modal title="Create Account" visible={isRegisterModalVisible} onCancel={() => setIsRegisterModalVisible(false)} footer={null}>
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
                    <label>Password</label>
                    <Input.Password
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Confirm Password</label>
                    <Input.Password
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
                {error && <p className="error-message">{error}</p>}
                <Button type="primary" onClick={handleCreateAccount}>Create Account</Button>
            </Modal>
        </div>
    );
}

export default EditUser;