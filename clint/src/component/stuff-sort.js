import axios from "axios";
import { useState, useEffect } from "react";
import { Card, Form, FormControl, Button } from "react-bootstrap";
import "../css/style.css"
import "../css/table.css"
import { useNavigate } from 'react-router-dom'
import { Spin } from 'antd';

function StuffpageSort() {
  const navigate = useNavigate()
  const [error, setError] = useState(null);
  const [datacouse, setDatacouse] = useState([]);
  const [selectedValue, setSelectedValue] = useState('');
  const [dataevent, setDataevent] = useState([])
  const [selectedEvent, setSelectedEvent] = useState('');
  const [show, setShow] = useState()
  const [showyet, setShowyet] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState('');
  const [ShowAddModal, setShowAddModal] = useState(false);
  const [search, setSearch] = useState('')

  const [isspin, setIsspin] = useState(true)

  console.log(search)

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

    if (selectedSubject !== '') {
      axios.get(`http://localhost:1337/api/events?populate[course][filters][subject][$eq]=${selectedSubject}`, config)
        .then(({ data }) => setDataevent(data.data))
        .catch((error) => setError(error));
    }

    setIsspin(false)
  }, [selectedSubject]);

  if (error) {
    // Print errors if any
    return <div>An error occured: {error.message}</div>;
  }

  //รับค่าวิชาเข้าไปเก็บใน Datacouse ------- COUSE -------
  const handleSelectChange_COUSE = (event) => {
    if (event.target.value !== "เลือกวิชา") {
      setSelectedValue(event.target.value);
      setSelectedSubject(event.target.value);
      setSelectedEvent(''); // รีเซ็ตค่าที่เกี่ยวข้องกับอีเว้น
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
          item.attributes.event.data !== null
        );
        setShow(filteredData);
        //console.log(filteredData);  // ให้ใช้ console.log ที่นี้
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
    
  }

/*   const up = () => {
    navigate('/upload')
  } */

  const add = () => {
    navigate('/add')
  }

  const handleLogout = () => {
    // Remove JWT Token from Local Storage
    window.localStorage.removeItem("jwtToken");
    // Clear Authorization Header in Axios Defaults
    axios.defaults.headers.common.Authorization = "";
    // Navigate to the "/" path (adjust this if using a different routing library)
    navigate("/");
  }

  const deleted = (itemId) => {
    console.log(itemId)

    const updatedData = show.filter(item => item.id !== itemId);
    setShow(updatedData)
    
    axios.delete(`http://localhost:1337/api/entries/${itemId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
      }
    }).then(console.log("Success")).catch((error) => console.log(error))

  }

  return (
    <Spin spinning={isspin}>
      <div className="head">
        <div style={{margin: "20px"}}>
          ระบบประกาศคะแนน(Admin)
        </div>
        <button className="button" onClick={handleLogout} style={{margin: "60px"}}>
          Logout
        </button>
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
            {dataevent.filter(item => item.attributes.course.data !== null).map(({ id, attributes }) => (
              <option key={id} value={attributes.name}>{attributes.name}</option>
            ))}
          </Form.Select>

        </Form.Group>
      </Card>

      <div className="backposition" style={{ margin: '20px' }}>
        <Button variant="success" onClick={() => add()}>เพิ่มข้อมูล</Button>
        <Button variant="success" onClick={() => showpointstudent()} style={{ width: '3cm' }}>View</Button>
      </div>
      
      <div>
        <Card style={{ margin: '20px' }}>
          {showyet && show && show.length > 0 ? (
            <FormControl onChange={(e) => setSearch(e.target.value)} placeholder="ค้นหาชื่อที่ต้องการ" />
          ) : (
            null
          )}
        </Card>

        <Card style={{ margin: '20px' }}>
          {showyet && show && show.length > 0 ? (
            <div>

              <table>

                <thead>
                  <tr>
                    <th>ชื่อ</th>
                    <th>คะแนน</th>
                    <th>คอมเม้น</th>
                    <th>ดูคะแนนแล้วหรือยัง</th>
                    <th>ตั้งค่า</th>
                  </tr>
                </thead>

                <tbody>
                  {show.filter(({ id, attributes }) => {
                    return search === '' 
                      ? attributes 
                      : attributes.owner.data.attributes.username.includes(search);
                  })
                  .map(({ id, attributes }) => (
                    <tr key={id}>
                      <td>{attributes.owner.data.attributes.username}</td>
                      <td>{attributes.result}</td>
                      <td>{attributes.comment}</td>
                      <td>{attributes.seedata}</td>
                      <td><Button variant="danger" onClick={() => deleted(id)}>ลบ</Button></td>
                    </tr>
                  ))}
                </tbody>

              </table>

            </div>
          ) : (
            <h2 style={{ margin: "20px", textAlign: "center" }}>
              ไม่มีข้อมูล
            </h2>
          )}
        </Card>
      </div>

    </Spin>
  );
}

export default StuffpageSort;