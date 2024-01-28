import Button from 'react-bootstrap/Button';
import { useState, useEffect } from "react";
import axios from 'axios';
import { Form, FormGroup, Modal, Image} from "react-bootstrap";

function StaticExample({ id }) {
    const [modal, setModal] = useState(false);
    const [datacouse, setDatacouse] = useState({});
    const [eventName, setEventName] = useState('');
    const [eventDateTime, setEventDateTime] = useState('');
    const [eventdescribtion, setEventDescribtion] = useState('');

    useEffect(() => {
        axios.get(`http://localhost:1337/api/events/${id}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
            },
        }).then(({ data }) => {
            setDatacouse(data.data);
            setEventName(data.data?.attributes?.name || '');
            setEventDateTime(data.data?.attributes?.datetime);
            setEventDescribtion(data.data?.attributes?.description || '');
        }).catch((error) => console.log(error));

    }, [id]);

    const handleSaveChanges = async () => {
        try {
            const response = await axios.put(
                `http://localhost:1337/api/events/${id}`,
                {
                    data: {
                        name: eventName || datacouse?.attributes?.name,
                        datetime: eventDateTime || datacouse?.attributes?.datetime,
                        description: eventdescribtion || datacouse?.attributes?.description,
                    },
                },
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
                    },
                }
            );

            console.log('Event updated successfully:', response.data);
            setModal(false); // ปิด Modal หลังจากทำการแก้ไข
            window.location.reload();
        } catch (error) {
            console.error('Error updating event:', error);
        }
    };

    return (
        <div>
            <Button onClick={() => setModal(true)} style={{borderRadius: "100px", backgroundColor: "#365486"}}>
                <Image src={"whitegear.png"} style={{width: "30px", height: "30px"}}/>
            </Button>

            <Modal show={modal} onHide={() => setModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>แก้ไขข้อมูลอีเว้น</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>
                        <FormGroup>
                            <Form.Label>ชื่อ</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder={datacouse?.attributes?.name}
                                onChange={(e) => setEventName(e.target.value)}
                                style={{ width: '200px' }}
                                value={eventName}
                            />
                        </FormGroup>

                        <FormGroup>
                            <Form.Label>เวลา(หากต้องการเวลาเดิม ไม่ต้องเลือก)</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                value={eventDateTime}
                                onChange={(e) => setEventDateTime(e.target.value)}
                                style={{ width: '200px' }}
                            />
                        </FormGroup>

                        <FormGroup>
                            <Form.Label>รายละเอียด</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder={datacouse?.attributes?.description || 'จะเขียนอะไรก็ได้'}
                                value={eventdescribtion}
                                rows={3}
                                as="textarea"
                                onChange={(e) => setEventDescribtion(e.target.value)}
                                style={{ width: '200px' }}
                            />
                        </FormGroup>
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSaveChanges}>
                        Save changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default StaticExample;
