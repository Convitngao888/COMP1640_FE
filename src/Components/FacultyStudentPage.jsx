import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

function FacultyStudentPage() {
    const [students, setStudents] = useState([]);
    const { userId, facultyName } = useAuth();

    useEffect(() => {
        async function fetchStudents() {
            try {
                const response = await axios.get('https://localhost:7021/api/Users');
                const facultyStudents = response.data.value.filter(user => user.facultyName === facultyName);
                setStudents(facultyStudents);
            } catch (error) {
                console.error('Error fetching students:', error);
            }
        }
        fetchStudents();
    }, [facultyName]);

    // Function to handle delete student
    async function handleDeleteStudent(deleteUserId) {
        const isConfirmed = window.confirm('Are you sure you want to delete this user?');
        if (isConfirmed) {
            try {
                const formData = new FormData();
                formData.append('loggedId', userId);
                formData.append('id', deleteUserId);
                if (userId === deleteUserId) {
                    console.log("Ngu");
                    window.confirm('Cannot delete yourself');
                }
                else {
                    await axios.delete(`https://localhost:7021/api/Users/${deleteUserId}`, { formData });
                    setStudents(prevUsers => prevUsers.filter(user => user.userId !== userId));
                }
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    }

    return (
        <div>
            <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Users in {facultyName}</h1>
            <table style={{ width: '100%', borderCollapse: 'collapse', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f2f2f2' }}>
                        <th style={{ borderBottom: '1px solid #ccc', padding: '10px 0', textAlign: 'left', paddingLeft: '20px' }}>User ID</th>
                        <th style={{ borderBottom: '1px solid #ccc', padding: '10px 0', textAlign: 'left' }}>User Name</th>
                        <th style={{ borderBottom: '1px solid #ccc', padding: '10px 0', textAlign: 'left' }}>Faculty Name</th>
                        <th style={{ borderBottom: '1px solid #ccc', padding: '10px 0', textAlign: 'left' }}>Email</th>
                        <th style={{ borderBottom: '1px solid #ccc', padding: '10px 0', textAlign: 'left' }}>Actions</th>
                        {/* Add more table headers for additional user details */}
                    </tr>
                </thead>
                <tbody>
                    {students.map((student, index) => (
                        <tr key={student.userId} style={{ borderBottom: '1px solid #ccc', backgroundColor: index % 2 === 0 ? '#fff' : '#f9f9f9' }}>
                            <td style={{ padding: '10px 0', paddingLeft: '20px' }}>{student.userId}</td>
                            <td style={{ padding: '10px 0' }}>{student.userName}</td>
                            <td style={{ padding: '10px 0' }}>{student.facultyName}</td>
                            <td style={{ padding: '10px 0' }}>{student.email}</td>
                            <td style={{ padding: '10px 0' }}>
                                <button
                                    onClick={() => handleDeleteStudent(student.userId)}
                                    style={{ backgroundColor: 'red', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}
                                >
                                    Delete
                                </button>
                            </td>
                            {/* Add more table cells for additional user details */}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default FacultyStudentPage;
