import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

function AllStudentPage() {
    const { userId } = useAuth();
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFaculty, setSelectedFaculty] = useState('');
    const [selectedRole, setSelectedRole] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(10);


    useEffect(() => {
        async function fetchUsers() {
            try {
                const response = await axios.get('https://localhost:7021/api/Users');
                setUsers(response.data.value); // Set users state with response.data.value
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        }
        fetchUsers();
    }, []);

    // Function to map roleId to roleName
    function mapRoleIdToRoleName(roleId) {
        switch (roleId) {
            case 1:
                return 'Student';
            case 2:
                return 'Marketing Manager';
            case 3:
                return 'Marketing Coordinator';
            case 4:
                return 'Admin';
            case 5:
                return 'Guest account';
            default:
                return '';
        }
    }

    // Function to handle search term change
    function handleSearchTermChange(event) {
        setSearchTerm(event.target.value);
    }

    // Function to handle select faculty change
    function handleSelectFacultyChange(event) {
        setSelectedFaculty(event.target.value);
    }

    // Function to handle select role change
    function handleSelectRoleChange(event) {
        setSelectedRole(event.target.value);
    }

    // Function to handle pagination
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users
        .filter(filterUsersByName)
        .filter(filterUsersByFaculty)
        .filter(filterUsersByRole)
        .slice(indexOfFirstUser, indexOfLastUser);

    // Function to handle page change
    function paginate(pageNumber) {
        setCurrentPage(pageNumber);
    }

    // Function to filter users by name
    function filterUsersByName(user) {
        return user.userName.toLowerCase().includes(searchTerm.toLowerCase());
    }

    // Function to filter users by faculty name
    function filterUsersByFaculty(user) {
        return selectedFaculty === '' || user.facultyName === selectedFaculty;
    }

    // Function to filter users by role name
    function filterUsersByRole(user) {
        return selectedRole === '' || mapRoleIdToRoleName(user.roleId) === selectedRole;
    }

    // Function to handle delete user
    async function handleDeleteUser(deleteUserId) {
        const isConfirmed = window.confirm('Are you sure you want to delete this user?');
        if (isConfirmed) {
            try {
                const formData = new FormData();
                formData.append('loggedId', userId);
                formData.append('id', deleteUserId);
                if (userId === deleteUserId) {
                    window.confirm('Cannot delete yourself');
                }
                else {
                    await axios.delete(`https://localhost:7021/api/Users/${deleteUserId}`, { formData });
                    setUsers(prevUsers => prevUsers.filter(user => user.userId !== userId));
                }
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    }

    return (
        <div>
            <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>User List</h1>
            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                <input
                    type="text"
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={handleSearchTermChange}
                    style={{ marginRight: '10px', padding: '8px', fontSize: '16px', width: '300px' }}
                />
                <select
                    value={selectedFaculty}
                    onChange={handleSelectFacultyChange}
                    style={{ marginRight: '10px', padding: '8px', fontSize: '16px' }}
                >
                    <option value="">Filter by faculty...</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Business Administration">Business Administration</option>
                    <option value="Graphic Design">Graphic Design</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Law">Law</option>
                    <option value="None">None</option>
                </select>
                <select
                    value={selectedRole}
                    onChange={handleSelectRoleChange}
                    style={{ marginRight: '10px', padding: '8px', fontSize: '16px' }}
                >
                    <option value="">Filter by role...</option>
                    <option value="Student">Student</option>
                    <option value="Marketing Manager">Marketing Manager</option>
                    <option value="Marketing Coordinator">Marketing Coordinator</option>
                    <option value="Admin">Admin</option>
                    <option value="Guest account">Guest account</option>
                </select>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th style={{ borderBottom: '1px solid #ccc', padding: '10px 0', textAlign: 'left' }}>User ID</th>
                        <th style={{ borderBottom: '1px solid #ccc', padding: '10px 0', textAlign: 'left' }}>User Name</th>
                        <th style={{ borderBottom: '1px solid #ccc', padding: '10px 0', textAlign: 'left' }}>Email</th>
                        <th style={{ borderBottom: '1px solid #ccc', padding: '10px 0', textAlign: 'left' }}>Faculty Name</th>
                        <th style={{ borderBottom: '1px solid #ccc', padding: '10px 0', textAlign: 'left' }}>Role Name</th>
                        <th style={{ borderBottom: '1px solid #ccc', padding: '10px 0', textAlign: 'left' }}>Actions</th>
                        {/* Add more table headers for additional user details */}
                    </tr>
                </thead>
                <tbody>
                    {currentUsers.map(user => (
                        <tr key={user.userId} style={{ borderBottom: '1px solid #ccc' }}>
                            <td style={{ padding: '10px 0' }}>{user.userId}</td>
                            <td style={{ padding: '10px 0' }}>{user.userName}</td>
                            <td style={{ padding: '10px 0' }}>{user.email}</td>
                            <td style={{ padding: '10px 0' }}>{user.facultyName}</td>
                            <td style={{ padding: '10px 0' }}>{mapRoleIdToRoleName(user.roleId)}</td>
                            <td style={{ padding: '10px 0' }}>
                                <button
                                    onClick={() => handleDeleteUser(user.userId)}
                                    style={{ backgroundColor: 'red', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px' }}
                                >
                                    Delete
                                </button>
                            </td>
                            {/* Add more table cells for additional user details */}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <ul style={{ listStyleType: 'none', padding: 0, display: 'inline-block' }}>
                    {[...Array(Math.ceil(users.length / usersPerPage)).keys()].map(number => (
                        <li key={number} style={{ display: 'inline-block', marginRight: '10px' }}>
                            <button
                                style={{ backgroundColor: currentPage === number + 1 ? 'blue' : 'gray', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px' }}
                                onClick={() => paginate(number + 1)}
                            >
                                {number + 1}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default AllStudentPage;
