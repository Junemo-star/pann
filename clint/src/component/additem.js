import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Form, FormGroup, FormControl, Button } from "react-bootstrap";
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

    const [datacouse, setDatacouse] = useState();

    const [data, setData] = useState('');
    const [modal, setModal] = useState(false)
    const [test, setTest] = useState([])

    const [search, setSearch] = useState('')

    const { userRole } = useAuth();
    const { yourcourse } = useAuth();

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

        axios.get("http://localhost:1337/api/events?populate=course", config)
            .then(({ data }) => setData(data.data))
            .catch((error) => setError(error));

        axios.get("http://localhost:1337/api/users/me?populate=courses", config)
            .then(({ data }) => (setTest(data.courses)))
            .catch((error) => setError(error));

        //แสดงอีเว้นตามวิชาที่มีทั้งหมด
        axios.get("http://localhost:1337/api/users/me?populate[courses][populate][events]=*", config)
            .then(({ data }) => setDatacouse(data.courses))
            .catch((error) => setError(error))

    }, []);  // ในที่นี้ให้เรียกในที่ render แรกเท่านั้น

    if (error) {
        // Print errors if any
        return <div>An error occured: {error.message}</div>;
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const newEventData = {
                name: eventName,
                datetime: eventDateTime,
                course: eventcouse,
                description: eventdescribtion
            };

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

            window.location.reload()

        } catch (error) {
            console.error('Error adding event:', error);
        }
    };

    const upload = () => {
        navigate('/upload')
    }

    const handleGoBack = () => {
        navigate('/stuff');
    };

    const edit = () => {
        setModal(true)
    }

    return (
        <div>
            <nav className="navbar navbar-light " style={{ display: "flex", justifyContent: "space-between", backgroundColor: "#80BCBD", height: "90px" }}>
                <div style={{ display: "flex", alignItems: "center", marginRight: "20px", justifyContent: "center", color: "white" }}>
                    <a className="navbar-brand" style={{ backgroundColor: "white", width: "160px", height: "40px", alignItems: "center", marginLeft: "20px", borderRadius: "10px" }}>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/7/7c/PSU_CoC_ENG.png" width="120" height="30" style={{ marginLeft: "20px" }} className="d-inline-block align-top" alt="" />
                    </a>
                    <a style={{ marginRight: "20px" }}>
                        <h4>ระบบประกาศคะแนน(admin)</h4>
                    </a>
                    <a style={{ marginRight: "20px" }}>
                        <h4>ดูคะแนน</h4>
                    </a>
                    <a style={{ marginRight: "20px", color: "black" }}>
                        <h4>เพิ่มอีเว้น</h4>
                    </a>
                    <a>
                        <h4>เพิ่มคะแนน</h4>
                    </a>
                </div>
                <div style={{ marginRight: "30px", fontSize: "20px", display: "flex", alignItems: "center" }}>
                    <button className="button" onClick={handleGoBack}
                        style={{ backgroundColor: "white", width: "100px", height: "40px", alignItems: "center", marginLeft: "20px", borderRadius: "10px" }}>
                        Back
                    </button>
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
                        <Form.Select aria-label="Default select example" style={{ width: '200px', marginRight: '30px' }}
                        onChange={(e) => setEventcouse(e.target.value)} >
                        <option>เลือกวิชา</option>
                        {test.map(({id , subject}) => (
                            <option key={id} value={id}>{subject}</option>
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
                        <Button style={{ backgroundColor: "#365486" }} type="submit">Add Event</Button>
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
                <Button style={{ backgroundColor: "#365486" }} onClick={() => upload()}>เพิ่มคะแนน</Button>
            </div>

            <Card style={{ margin: '20px' }}>
                <FormControl onChange={(e) => setSearch(e.target.value)} placeholder="ค้นหาชื่อที่ต้องการ" />
            </Card>

            {datacouse && datacouse.map(({ events }) => (events.filter((item) => {
                return search.toLowerCase() === ''
                    ? item
                    : item.name.toLowerCase().includes(search);
            }).map((item) => (
                <Card key={item.id} style={{ margin: '20px' }} className='ol-md-4 mb-4'>
                    <Card.Body>
                        <Card.Title style={{ display: 'flex', justifyContent: 'space-between', alignItems: "center" }}>
                            <div>
                                <h3>{item.name}</h3><br />
                                {new Date(item.datetime).toLocaleString()}
                            </div>

                            <div style={{ display: 'flex', alignItems: "center" }}>
                                <div style={{ marginRight: '10px' }}>
                                    <StaticExample id={item.id} />
                                </div>
                                <div>
                                    <Deleteevent id={item.id} />
                                </div>
                            </div>

                        </Card.Title>
                    </Card.Body>
                </Card>
            ))))}

        </div>
    );
};

export default AddEventForm;