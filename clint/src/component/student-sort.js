//student-sort.js
import axios from "axios";
import { useState, useEffect } from "react";
import Stack from 'react-bootstrap/Stack';    //เอาไว้ตกแต่ง
import { useNavigate, Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/style.css'
import { Container, Row, Col, CardGroup } from "react-bootstrap";
import { useAuth } from "./AuthContext";

function StudentSort() {   //ชื่อฟังก์ชั่นควรเป็นตัวใหญ่
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [dataname, setDataname] = useState([])
  const [hoverr, setHoverr] = useState(null)
  const navigate = useNavigate()      //N a v i g a t e 

  const { userRole, setRole } = useAuth();

  useEffect(() => {
    
  // ตรวจสอบว่า userRole เป็น 'student' หรือไม่
  if (userRole !== 'student') {
    navigate("/");
  }

    //เก็บข้อมูล jwt ที่ได้จากการ login
    const config = {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
        // สามารถเพิ่ม header อื่น ๆ ตามต้องการได้
      },
    };

    //เรียกข้อมูล
    axios.get("http://localhost:1337/api/courses", config)
      .then(({ data }) => setData(data.data))
      .catch((error) => setError(error));

    axios.get("http://localhost:1337/api/users/me", config)
      .then(({ data }) => setDataname(data))
      .catch((error) => console.log(error));

  }, [userRole]);

  

  if (error) {
    // Print errors if any
    return <div>An error occured: {error.message}</div>;
  }

  const check_data_user = (subject) => {        //เมื่อกดหัวข้อคะแนนจะทำการแสดงรายระเอียดคะแนนของเราในหัวข้อนั้นๆ
    try {
      navigate(`/student/${subject}`)
    } catch (e) {
      console.log(e)
    }
  }

  const handleLogout = () => {
    // Remove JWT Token from Local Storage
    window.localStorage.removeItem("jwtToken");
    // Clear Authorization Header in Axios Defaults
    axios.defaults.headers.common.Authorization = "";
    // Navigate to the "/" path (adjust this if using a different routing library)
    navigate("/");
  }

  return (
    <div>
      <div className="head" >
        <div style={{ margin: "60px" }}>
          รายวิชา
        </div>
        <button className="button" onClick={handleLogout} style={{ margin: "60px" }}>
          Logout
        </button>
      </div>

      <div className="cards-container" style={{ margin: '20px' }}>
        {data.map(({ id, attributes }) => (      //แสดงผลข้อมูล
          <Link className="no-underline" onClick={() => check_data_user(attributes.subject)}>
            <Card
              className="item"
              onMouseOver={() => setHoverr(id)}
              onMouseOut={() => setHoverr(null)}
              style={{
                transition: "background-color 0.3s",
                backgroundColor:
                  hoverr === id
                    ? "rgba(0, 60, 113, 0.2)"
                    : "rgba(0, 60, 113, 0.05)",
                cursor: "pointer",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Card.Body>
                <Card.Title>
                  <div>
                    <h2>{attributes.subject}</h2>
                    <h5>{attributes.teach}</h5>
                  </div>
                </Card.Title>
              </Card.Body>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default StudentSort;

