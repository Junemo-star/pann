// SimpleLoginForm.js
import React, { useState } from 'react';
import { Form, Container } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/button.css'
import { useAuth } from '../component/AuthContext';

const LoginForm = () => {
    const navigate = useNavigate()
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const [submitEnabled, setSubmitEnabled] = useState(true);
    const { setRole } = useAuth();

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitEnabled(false);

        try {
            let result = await axios.post('http://localhost:1337/api/auth/local', {
                identifier: username,
                password: password
            })

            //เก็บ jwt ในฟังก์ชั่นเพื่อเรียกใช้งานในหน้า component อื่น
            const saveTokenToLocalStorage = (token) => {
                localStorage.setItem('jwtToken', token);        //เก็บ jwt token
            }
            saveTokenToLocalStorage(result.data.jwt)

            localStorage.setItem('usern', username);           //เก็บชื่อ username

            const config = {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
                },
            };

            //เช็ค role
            result = await axios.get('http://localhost:1337/api/users/me?populate=role', config)

            if (result.data.role) {
                
                localStorage.setItem('userRole', result.data.role.name)
                
                setRole(localStorage.getItem('userRole'));

                if (result.data.role.name === 'student') {
                    navigate('/student');
                }
                if (result.data.role.name === 'stuff') {
                    navigate('/stuff');
                }
            }

            console.log(result)

        } catch (e) {
            console.log(e)
            console.log('wrong username & password')
            setSubmitEnabled(true);
        }
    };

    return (
        <Container>
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formBasicUsername">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter username"
                            value={username}
                            onChange={handleUsernameChange}
                            required //จำเป็นต้องกรอก
                        />
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Label style={{marginTop: "10px"}}>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={handlePasswordChange}
                            required
                        />
                    </Form.Group>

                    <button className="custom-button">
                        <div className="svg-wrapper-1">
                            <div className="svg-wrapper">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    width="24"
                                    height="24"
                                >
                                    <path fill="none" d="M0 0h24v24H0z"></path>
                                    <path
                                        fill="currentColor"
                                        d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
                                    ></path>
                                </svg>
                            </div>
                        </div>
                        <span>Send</span>
                    </button>

                    {/* <Button variant="primary" type="submit" >
                        Submit
                    </Button> */}
                </Form>
            </div>
        </Container>

    );
};

export default LoginForm

