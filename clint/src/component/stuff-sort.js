import axios from "axios";
import { useState, useEffect } from "react";
import { Card, Form, FormGroup } from "react-bootstrap";
import "../page/css/style.css"

function StuffpageSort() {
  const [error, setError] = useState(null);
  const [datacouse, setDatacouse] = useState([]);
  const [selectedValue, setSelectedValue] = useState('');
  const [dataevent, setDataevent] = useState([])
  const [selectedEvent, setSelectedEvent] = useState('');

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

  const test = () => {
    { console.log(selectedValue) }
    { console.log(selectedEvent) }
    { console.log(dataevent) }
  }


  return (
    <div>
      <div className="head">
        คะแนนทั้งหมด
      </div>

      <Card style={{ margin: '20px', display: 'flex' }}>
        <Form.Group style={{ display: 'flex'}}>

          <Form.Select aria-label="Default select example" style={{ width: '200px' , marginRight: '30px'  }} 
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
        <button onClick={() => test()} style={{ width: '3cm' }}>View</button>
      </div>
    </div>
  );
}

export default StuffpageSort;

