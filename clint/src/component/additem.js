import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Form, FormGroup } from "react-bootstrap";

const AddEventForm = () => {
    const [eventName, setEventName] = useState('');
    const [eventcouse, setEventcouse] = useState('');
    const [eventDateTime, setEventDateTime] = useState('');
    const [error, setError] = useState(null);
    const [datacouse, setDatacouse] = useState([]);

    const [data, setData] = useState('');

    ///////////////////////////////////////////////////////////////////////////////////////////////////
    useEffect(() => {
        //เก็บข้อมูล jwt ที่ได้จากการ login
        const config = {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
            },
        };

        axios.get("http://localhost:1337/api/courses", config)
            .then(({ data }) => setDatacouse(data.data))
            .catch((error) => setError(error));
    }, []);  // ในที่นี้ให้เรียกในที่ render แรกเท่านั้น

    // ใช้ useEffect ที่สอง
/*     useEffect(() => {
        //เก็บข้อมูล jwt ที่ได้จากการ login
        const config = {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
            },
        };

        axios.get("http://localhost:1337/api/events?populate=course", config)
            .then(({ data }) => setData(data.data))
            .catch((error) => setError(error));
    }, [data]);  // ในที่นี้ให้เรียกในทุกครั้งที่ data เปลี่ยนแปลง */

    if (error) {
        // Print errors if any
        return <div>An error occured: {error.message}</div>;
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////


    const handleSubmit = async (e) => {
        e.preventDefault();

        const newEventData = {
            name: eventName,
            datetime: eventDateTime,
            course: eventcouse,
        };

        try {
            const response = await axios.post('http://localhost:1337/api/events', { data: newEventData }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
                }
            });
            console.log('Event added successfully:', response.data);

            // เคลียร์ค่าช่อง input
            setEventName('');
            setEventcouse('');
        } catch (error) {
            console.error('Error adding event:', error);
        }
    };

    const choose = (event) => {
        const selectedCourseId = event.target.value;
        setEventcouse(selectedCourseId);
    }

    return (
        <div>
            <div className='head'>
                Add
            </div>
            <Card style={{ margin: '20px', display: 'flex' }}>
                <Form onSubmit={handleSubmit} style={{display: "flex",margin: "15px"}}>

                    <Form.Group style={{ marginRight: "15px" }}>
                        <Form.Label>เพิ่มชื่ออีเว้น</Form.Label>
                        <Form.Control type="text" placeholder="เพิ่มอีเว้น" value={eventName}
                            onChange={(e) => setEventName(e.target.value)} style={{ width: '200px' }} />
                    </Form.Group>

                    <Form.Group style={{ marginRight: "15px" }}>
                        <Form.Label>เลือกวิชา</Form.Label>
                        <Form.Select onChange={choose} style={{ width: '250px' }}>
                            <option>......</option>
                            {datacouse.map(({ id, attributes }) => (
                                <option key={id} value={id}>{attributes.subject}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <FormGroup style={{ marginRight: "15px" }}>
                        <Form.Label>เวลาประกาศ</Form.Label>
                        <Form.Control type="datetime-local" placeholder="เพิ่มอีเว้น" value={eventDateTime}
                            onChange={(e) => setEventDateTime(e.target.value)} style={{ width: '200px' }} />
                    </FormGroup>
                    
                    <button type="submit">Add Event</button>
                </Form>
            </Card>

            <Card style={{ margin: '20px', display: 'flex' }}>

            </Card>
        </div>
    );
};

export default AddEventForm;
