import axios from "axios";
import { useState, useEffect } from "react";
import Stack from 'react-bootstrap/Stack';    //เอาไว้ตกแต่ง
import { useNavigate } from 'react-router-dom';
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';

function StudentSort() {   //ชื่อฟังก์ชั่นควรเป็นตัวใหญ่
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const navigate = useNavigate()      //N a v i g a t e 

  useEffect(() => {
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
  }, []);

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

  return (
    <div>
      <div className="head">
        รายชื่อวิชา
      </div>
      <div className="cards-container">
        {data.map(({ id, attributes }) => (      //แสดงผลข้อมูล
          <Card key={id} className="item">
            <p>
            <Card.Body>
              <Card.Title>
                <div  >
                  {attributes.subject}
                </div>
              </Card.Title>
              <button onClick={() => check_data_user(attributes.subject)}>View</button>
            </Card.Body>
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default StudentSort;

