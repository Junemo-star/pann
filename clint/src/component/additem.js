import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardBody, Form, FormGroup, Modal, Button } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import StaticExample from './editpage';
import Deleteevent from './deletepage';
import { useAuth } from './AuthContext';

const AddEventForm = () => {
    const navigate = useNavigate()
    const [eventName, setEventName] = useState('');
    const [eventcouse, setEventcouse] = useState('');
    const [eventDateTime, setEventDateTime] = useState('');
    const [eventdescribtion, setEventDescribtion] = useState('')
    const [error, setError] = useState(null);
    const [datacouse, setDatacouse] = useState([]);

    const [data, setData] = useState('');
    const [modal, setModal] = useState(false)
    const [test, setTest] = useState([])

    const { userRole } = useAuth();

    ///////////////////////////////////////////////////////////////////////////////////////////////////
    useEffect(() => {
        if (userRole !== 'stuff') {
            // Remove JWT Token from Local Storage
            window.localStorage.removeItem("jwtToken");
            // Clear Authorization Header in Axios Defaults
            axios.defaults.headers.common.Authorization = "";
            // Navigate to the "/" path (adjust this if using a different routing library)
            navigate("/");
        }

        //เก็บข้อมูล jwt ที่ได้จากการ login
        const config = {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
            },
        };

        axios.get("http://localhost:1337/api/courses", config)
            .then(({ data }) => setDatacouse(data.data))
            .catch((error) => setError(error));

        axios.get("http://localhost:1337/api/events?populate=course", config)
            .then(({ data }) => setData(data.data))
            .catch((error) => setError(error));

        axios.get("http://localhost:1337/api/users/me?populate=course", config)
            .then(({ data }) => setTest([data.course]))
            .catch((error) => setError(error));

    }, []);  // ในที่นี้ให้เรียกในที่ render แรกเท่านั้น

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
            description: eventdescribtion
        };

        try {
            const response = await axios.post('http://localhost:1337/api/events', { data: newEventData }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
                }
            });
            console.log('Event added successfully:', response.data);

            // Reset state for both Form.Control and Form.Select
            setEventName('');
            setEventcouse('');
            setEventDateTime('');
            setEventDescribtion('');

        } catch (error) {
            console.error('Error adding event:', error);
        }
    };

    const choose = (event) => {
        const selectedCourseId = event.target.value;
        setEventcouse(selectedCourseId);
    }

    const upload = () => {
        navigate('/upload')
    }

    const handleGoBack = () => {
        navigate('/stuff');
    };

    const edit = () => {
        console.log(modal)
        setModal(true)
    }

    return (
        <div>
            {console.log(test)}
            <nav className="navbar navbar-light " style={{ display: "flex", justifyContent: "space-between", backgroundColor: "green" }}>
                <div style={{ display: "flex", alignItems: "center", marginRight: "20px", justifyContent: "center" ,color: "white"}}>
                    <a className="navbar-brand" style={{backgroundColor: "white", width: "160px", height: "40px", alignItems: "center", marginLeft: "20px", borderRadius: "10px"}}>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/7/7c/PSU_CoC_ENG.png" width="120" height="30" style={{ marginLeft: "20px" }} className="d-inline-block align-top" alt="" />
                    </a>
                    <a style={{ marginRight: "20px" }}>
                        <h4>ระบบประกาศคะแนน(admin)</h4>
                    </a>
                    <a style={{ marginRight: "20px" }}>
                        <h4>ดูคะแนน</h4>
                    </a>
                    <a style={{ marginRight: "20px", color: "yellow" }}>
                        <h4>เพิ่มอีเว้น</h4>
                    </a>
                    <a>
                        <h4>เพิ่มคะแนน</h4>
                    </a>
                </div>
                <div style={{ marginRight: "30px", fontSize: "20px" }}>
                    <button className="button" onClick={handleGoBack} style={{color: "white"}}>Back</button>
                </div>
            </nav>

            <Card style={{ margin: '20px' }}>
                <Form onSubmit={handleSubmit} style={{ display: "flex", margin: "15px", justifyContent: 'space-between' }}>

                    <Form.Group style={{ marginRight: "15px" }}>
                        <Form.Label>เพิ่มชื่ออีเว้น</Form.Label>
                        <Form.Control type="text" placeholder="เพิ่มอีเว้น" value={eventName}
                            onChange={(e) => setEventName(e.target.value)} style={{ width: '200px' }} />
                    </Form.Group>

                    <Form.Group style={{ marginRight: "15px" }}>
                        <Form.Label>เลือกวิชา</Form.Label>
                        <Form.Select onChange={choose} style={{ width: '250px' }}>
                            {test.map((item) => (
                                <option key={item.id} value={item.id}>{item.subject}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <FormGroup style={{ marginRight: "15px" }}>
                        <Form.Label>เพิ่มรายละเอียด</Form.Label>
                        <Form.Control type="text" placeholder="จะเพิ่มหรือไม่ก็ได้" value={eventdescribtion} rows={3} as="textarea"
                            onChange={(e) => setEventDescribtion(e.target.value)} style={{ width: '200px' }} />
                    </FormGroup>

                    <FormGroup style={{ marginRight: "15px" }}>
                        <Form.Label>เวลาประกาศ</Form.Label>
                        <Form.Control type="datetime-local" placeholder="เพิ่มอีเว้น" value={eventDateTime}
                            onChange={(e) => setEventDateTime(e.target.value)} style={{ width: '200px' }} />
                    </FormGroup>

                    <div>
                        <Button variant="success" type="submit">Add Event</Button>
                    </div>
                </Form>
            </Card>

            <div style={{
                display: "flex",
                alignItems: "center",
                margin: "20px",
                justifyContent: "space-between"
            }}>
                <h2 >Event</h2>
                <Button variant="success" onClick={() => upload()}>เพิ่มคะแนน</Button>
            </div>

            {data && data.map(({ id, attributes }) => (
                <Card key={id} style={{ margin: '20px' }} className='ol-md-4 mb-4'>
                    <Card.Body>
                        <Card.Title style={{ display: 'flex', justifyContent: 'space-between', alignItems: "center" }}>
                            <div>
                                <h3>{attributes.name}</h3>
                                {attributes.course.data.attributes.subject}<br />
                                {new Date(attributes.datetime).toLocaleString()}
                            </div>

                            <div style={{ display: 'flex', alignItems: "center" }}>
                                <div style={{ marginRight: '10px' }}>
                                    <Deleteevent id={id} />
                                </div>
                                <div>
                                    <StaticExample id={id} />
                                </div>
                            </div>

                        </Card.Title>
                    </Card.Body>
                </Card>
            ))}

        </div>
    );
};

export default AddEventForm;
