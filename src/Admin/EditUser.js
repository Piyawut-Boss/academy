import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Button, Input, message, Select } from 'antd';
import { Edit, UserPlus } from 'lucide-react';
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
    const [searchTerm, setSearchTerm] = useState('');

    const token = process.env.REACT_APP_STRAPI_API_TOKEN;
    const API_BASE = process.env.REACT_APP_API_BASE_URL;


    useEffect(() => {
        axios.get('http://localhost:1337/api/users?populate=*')
            .then(response => {
                const filteredUsers = response.data.filter(user => 
                    user.role?.type === 'authenticated' || 
                    !user.role?.type.toLowerCase().includes('admin')
                );
                setUsers(filteredUsers);
            })
            .catch(error => setError('Error fetching users'));

        axios.get('http://localhost:1337/api/courses')
            .then(response => setCourses(response.data.data))
            .catch(error => console.error('Error fetching courses:', error));
    }, []);                                                                                                                                                                                                         

    const handleEdit = (user) => {
        setCurrentUser(user);
        setUsername(user.username);
        setEmail(user.email);
        setPassword('');  
        setSelectedCourses(user.courses ? user.courses.map(course => course.id) : []);
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

            const updatedCourses = courses.filter(course => selectedCourses.includes(course.id));

            message.success('User updated successfully!');
            setIsModalVisible(false);
            setUsers(users.map(user =>
                user.id === currentUser.id
                    ? { ...user, username, email, courses: updatedCourses }
                    : user
            ));

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

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="edit-user-container">
            <h1>User Management</h1>
            
            {error && <p className="error-message">{error}</p>}
            
            <button 
                className="create-account-btn"
                onClick={() => setIsRegisterModalVisible(true)}
            >
                <UserPlus size={18} />
                <span>New Account</span>
            </button>

            <Input
                placeholder="Search by username"
                value={searchTerm}
                onChange={handleSearchChange}
                style={{ marginBottom: '20px', marginTop: '20px' }}
            />

            <div className="user-table-container">
                <table className="user-table">
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Registration Date</th>
                            <th>Enrolled Courses</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user.id}>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                <td>{user.courses?.length > 0 ? 
                                    user.courses.map(course => course.Title).join(', ') : 
                                    'No courses'}
                                </td>
                                <td>
                                    <button 
                                        className="action-button"
                                        onClick={() => handleEdit(user)}
                                    >
                                        <Edit size={16} />
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal title="Edit User" open={isModalVisible} onCancel={() => setIsModalVisible(false)} footer={null}>
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

            <Modal title="Create Account" open={isRegisterModalVisible} onCancel={() => setIsRegisterModalVisible(false)} footer={null}>
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