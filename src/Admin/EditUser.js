import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './EditUser.css';

function EditUser() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:1337/api/users?populate=courses')
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => {
                console.error('Error fetching users:', error);
            });
    }, []);

    return (
        <div className="edit-user-container">
            <h1>Edit User</h1>
            <table className="user-table">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Created At</th>
                        <th>Courses</th>
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
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default EditUser;