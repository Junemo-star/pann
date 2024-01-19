// SubjectForm.js
import React, { useState } from 'react';
import axios from 'axios';

const SubjectForm = () => {
    const [subjectData, setSubjectData] = useState({
        subject: '',
        teach: ''
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setSubjectData({
            ...subjectData,
            [name]: value
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        // ทำการ POST ข้อมูล
        axios.post('http://localhost:1337/api/courses', {data: subjectData}, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
            }
        }
        )
            .then(response => {
                console.log('Subject added successfully:', response.data);
                // ทำต่อไปเช่น รีเซ็ตฟอร์ม, แสดงข้อความสำเร็จ, หรืออื่น ๆ
            })
            .catch(error => {
                console.error('Error adding subject:', error);
            });
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Subject:
                <input
                    type="text"
                    name="subject"
                    value={subjectData.subject}
                    onChange={handleChange}
                />
            </label>
            <br />
            <label>
                Teach:
                <input
                    type="text"
                    name="teach"
                    value={subjectData.teach}
                    onChange={handleChange}
                />
            </label>
            <br />
            <button type="submit">Add Subject</button>
        </form>
    );
};

export default SubjectForm;
