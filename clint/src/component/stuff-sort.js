import axios from "axios";
import { useState, useEffect } from "react";
import { Card, Form } from "react-bootstrap";
import "../css/style.css"
import "../css/table.css"
import { useNavigate } from 'react-router-dom'

function StuffpageSort() {
  const navigate = useNavigate()
  const [error, setError] = useState(null);
  const [datacouse, setDatacouse] = useState([]);
  const [selectedValue, setSelectedValue] = useState('');
  const [dataevent, setDataevent] = useState([])
  const [selectedEvent, setSelectedEvent] = useState('');
  const [show, setShow] = useState()
  const [showyet, setShowyet] = useState(false)

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
      .then(({ data }) => setDatacouse(data.data))
      .catch((error) => setError(error));

    axios.get("http://localhost:1337/api/events", config)
      .then(({ data }) => setDataevent(data.data))
      .catch((error) => setError(error));

  }, []);
  if (error) {
    // Print errors if any
    return <div>An error occured: {error.message}</div>;
  }

  //รับค่าวิชาเข้าไปเก็บใน Datacouse ------- COUSE -------
  const handleSelectChange_COUSE = (event) => {
    if (event.target.value !== "เลือกวิชา") {
      setSelectedValue(event.target.value);
    }
  };

  //รับค่าวิชาเข้าไปเก็บใน Dataevent ------- EVENT -------
  const handleSelectChange_EVENT = (event) => {
    if (event.target.value !== "เลือกอีเว้น") {
      setSelectedEvent(event.target.value);
    }
  };

  const showpointstudent = () => {
    setShowyet(true)
    axios.get(`http://localhost:1337/api/entries?populate[course][filters][subject][$eq]=${
      selectedValue}&populate[owner]=*&populate[event][filters][name]=${selectedEvent}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
      }
    })
      .then(({ data }) => {
        const filteredData = data.data.filter(item =>
          item.attributes.course.data !== null &&
          item.attributes.event.data !== null
        );
        setShow(filteredData);
        //console.log(filteredData);  // ให้ใช้ console.log ที่นี้
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }

  const up = () => {
    navigate('/upload')
  }

  return (
    <div>
      <div className="head">
        คะแนนทั้งหมด
      </div>

      <Card style={{ margin: '20px', display: 'flex' }}>
        <Form.Group style={{ display: 'flex' }}>

          <Form.Select aria-label="Default select example" style={{ width: '200px', marginRight: '30px' }}
            onChange={handleSelectChange_COUSE} value={selectedValue}>
            <option>เลือกวิชา</option>
            {datacouse.map(({ id, attributes }) => (
              <option key={id} value={attributes.subject}>{attributes.subject}</option>
            ))}
          </Form.Select>

          <Form.Select aria-label="Default select example" style={{ width: '200px' }}
            onChange={handleSelectChange_EVENT} value={selectedEvent}>
            <option>เลือกอีเว้น</option>
            {dataevent.map(({ id, attributes }) => (
              <option key={id} value={attributes.name}>{attributes.name}</option>
            ))}
          </Form.Select>

        </Form.Group>
      </Card>

      <div className="backposition" style={{ margin: '20px' }}>
        <button onClick={() => showpointstudent()} style={{ width: '3cm' }}>View</button>
      </div>

      <div>
        <Card style={{ margin: '20px' }}>
          {showyet && show && show.length > 0 ? (
            <div>

              <table>

                <thead>
                  <tr>
                    <th>ชื่อ</th>
                    <th>คะแนน</th>
                    <th>ดูคะแนนแล้วหรือยัง</th>
                  </tr>
                </thead>

                <tbody>
                  {show.map(({ id, attributes }) => (
                    <tr key={id}>
                      <td>{attributes.owner.data.attributes.username}</td>
                      <td>{attributes.result}</td>
                      <td>{attributes.seedata}</td>
                    </tr>
                  ))}
                </tbody>

              </table>

            </div>
          ) : (
            <h2 style={{margin: "20px", textAlign: "center"}}>
              ไม่มีข้อมูล
            </h2>
          )}
          {console.log(show)}
        </Card>
      </div>

    </div>
  );
}

export default StuffpageSort;