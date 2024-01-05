// SimpleLoginForm.js
import React, { useEffect, useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import axios from 'axios';
import axiosConfig from '../component/axios-interceptor';
import { useNavigate } from 'react-router-dom';


const LoginForm = () => {
    const navigate = useNavigate()
    const [username, setUsername] = useState('223');
    const [password, setPassword] = useState('123456');
    const [submitEnabled, setSubmitEnabled] = useState(true);


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
                localStorage.setItem('jwtToken', token);
            }
            localStorage.setItem('usern', username);
            saveTokenToLocalStorage(result.data.jwt)
            axios.defaults.headers.common = {
                Authorization: `Bearer &{result.data.jwt}`
            }

            axiosConfig.jwt = result.data.jwt

            //เช็ค role
            result = await axios.get('http://localhost:1337/api/users/me?populate=role')

            if (result.data.role) {
                if (result.data.role.name == 'student') {
                    navigate('/student');
                }
                if (result.data.role.name == 'stuff') {
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
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={handlePasswordChange}
                            required
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit" >
                        Submit
                    </Button>
                </Form>
            </div>
        </Container>

    );
};

export default LoginForm

