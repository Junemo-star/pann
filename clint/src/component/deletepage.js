import Button from 'react-bootstrap/Button';
import { useState, useEffect } from "react";
import axios from 'axios';
import { Form, FormGroup, Modal } from "react-bootstrap";

function Deleteevent({ id }) {
    const [modal, setModal] = useState(false);

    const handleSaveChanges = async () => {
        try {
            const response = await axios.delete(`http://localhost:1337/api/events/${id}`,{
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
            <Button variant="danger" onClick={() => setModal(true)}>ลบ</Button>

            <Modal show={modal} onHide={() => setModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>ลบอีเว้น</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Modal.Title>คุณแน่ใจที่จะลบใช่หรือไม่</Modal.Title>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setModal(false)}>
                        ไม่
                    </Button>
                    <Button variant="primary" onClick={handleSaveChanges}>
                        ใช่
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Deleteevent;
