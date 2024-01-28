import React, { useState, useEffect } from 'react';

import axios from 'axios';
import * as XLSX from 'xlsx';

import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardBody, Form, FormGroup, Button } from "react-bootstrap";
import { useAuth } from './AuthContext';

const UploadFile = () => {
  const [excelData, setExcelData] = useState(null);
  const [stdid, setStdid] = useState([]);
  const [postSuccess, setPostSuccess] = useState(false); // Track post status
  const navigate = useNavigate();

  const [error, setError] = useState(null);
  const [datacouse, setDatacouse] = useState([]);
  const [eventcouse, setEventcouse] = useState('');

  const { userRole } = useAuth();

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];

    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        // Assuming the first sheet is the one you want to read
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const parsedData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        console.log('Excel Data:', parsedData);
        setExcelData(parsedData);
      } catch (error) {
        console.error('Error reading Excel file:', error);
      }
    };

    reader.readAsArrayBuffer(selectedFile);
  };

  const postToStrapi = async () => {
    try {
      const checkid = await axios.get('http://localhost:1337/api/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
        }
      });

      const filteredEmails = checkid.data.filter((item) =>
        item.email.match(/^\d{2}/)
      );
      console.log(filteredEmails);
      const filteredstdid = filteredEmails.map((item) => ({
        id: item.id,
        email: item.email,
      }));
      setStdid(filteredstdid);

      const entriesInEvent = await axios.get(`http://localhost:1337/api/events/${eventcouse}?populate=entries`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
        },
      });

      console.log(entriesInEvent);

      // ถ้ามี entries ในอีเว้นที่ถูกเลือก
      if (entriesInEvent.data.data.attributes.entries.data.length > 0) {
        const confirmDelete = window.confirm('อีเว้นนี้มีข้อมูลคะแนนอยู่แล้ว คุณต้องการลบข้อมูลเดิมทั้งหมดหรือไม่?');
        if (confirmDelete) {
          // ลบ entries ทั้งหมดในอีเว้น
          for (const entry of entriesInEvent.data.data.attributes.entries.data) {
            await axios.delete(`http://localhost:1337/api/entries/${entry.id}`, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
              },
            });
          }
        } else {
          // ถ้าผู้ใช้ไม่ต้องการลบข้อมูล ให้ยกเลิก Post
          return;
        }
      }

      for (const excelRow of excelData) {
        const studentId = excelRow[0];

        const matchedUser = filteredEmails.find(
          (item) => item.email.slice(0, 3) === studentId.toString()
        );

        if (matchedUser) {
          const userId = matchedUser.id;

          const response = await axios.post('http://localhost:1337/api/entries',
            {
              data: {
                result: `${excelRow[1]}`,   //คะแนน
                comment: `${excelRow[2]}`,   //คอมเม้น
                owner: parseInt(userId),     //เลขประจำตัวนักศึกษา (3 ตัว)
                event: eventcouse,
              },
            },
            {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
              }
            }
          );

          console.log('Post to Strapi successful:', response.data);
          setPostSuccess(true);
        }
      }
      window.location.reload();
    } catch (error) {
      console.error('Error posting to Strapi:', error);
    }
  };

  /////////////////////////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {

    if (userRole !== 'stuff') {
      // Remove JWT Token from Local Storage
      window.localStorage.removeItem("jwtToken");
      // Clear Authorization Header in Axios Defaults
      axios.defaults.headers.common.Authorization = "";
      // Navigate to the "/" path (adjust this if using a different routing library)
      navigate("/");
    }

    if (postSuccess) {
      setPostSuccess(false);
      //window.location.reload();
    }

    axios.get("http://localhost:1337/api/users/me?populate[course][populate]=events", {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
      },
    })
      .then((response) => { setDatacouse(response.data.course.events) })
      .catch((error) => setError(error));

  }, [postSuccess]);

  if (error) {
    // Print errors if any
    return <div>An error occured: {error.message}</div>;
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////////////// 

  const choose = async (event) => {
    const selectedCourseId = event.target.value;
    setEventcouse(selectedCourseId);

  }

  const handleGoBack = () => {
    navigate('/add');
  };

  return (
    <div>
      {console.log(datacouse)}

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
          <a style={{ marginRight: "20px" }}>
            <h4>เพิ่มอีเว้น</h4>
          </a>
          <a style={{ marginRight: "20px", color: "black" }}>
            <h4>เพิ่มคะแนน</h4>
          </a>
        </div>
        <div style={{ marginRight: "30px", fontSize: "20px" }}>
          <button onClick={handleGoBack} className='button'
            style={{ backgroundColor: "white", width: "100px", height: "40px", alignItems: "center", marginLeft: "20px", borderRadius: "10px" }}>
            Back
          </button>
        </div>
      </nav>

      <Card style={{ margin: '20px', display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Form style={{ margin: '20px', display: "flex" }}>

          <Form.Group style={{ width: "400px" }}>
            <Form.Label>เลือกอีเว้น</Form.Label>
            <Form.Select onChange={choose} style={{ width: '250px' }}>
              <option>......</option>
              {datacouse && datacouse?.map((course) => (
                <option key={course.id} value={course.id}>{course.name}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group controlId="formFile" style={{ width: "400px" }}>
            <Form.Label>Default file input example</Form.Label>
            <Form.Control type="file" onChange={handleFileChange} disabled={!eventcouse} />
          </Form.Group>

        </Form>

        <Button variant="success" onClick={postToStrapi} disabled={!excelData} style={{ width: "400px", margin: "20px", backgroundColor: "#365486" }}>
          ยืนยัน
        </Button>
      </Card >

      <Card style={{ margin: '20px', display: "flex", justifyContent: "center", alignItems: "center" }}>
        <img src="up.png" style={{width: "auto", height: "450px"}}/>
      </Card>
    </div>
  );
};

export default UploadFile;
