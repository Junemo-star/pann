import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import Card from 'react-bootstrap/Card'
import '../css/style.css'
import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const Showinfo = () => {
  const navigate = useNavigate()
  const [modalShow, setModalShow] = React.useState(false);

  const [data, setData] = useState([])
  const [error, setError] = useState(null)

  const [des, setDes] = useState()

  const handleGoBack = () => {
    navigate('/student');
  };

  //////////////////////////////////////////////////////
  useEffect(() => {
    //เก็บข้อมูล jwt ที่ได้จากการ login
    const config = {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
        // สามารถเพิ่ม header อื่น ๆ ตามต้องการได้
      },
    };

    //เรียกข้อมูล
    axios.get("http://localhost:1337/api/events", config)
      .then(({ data }) => setData(data.data))
      .catch((error) => setError(error));
  }, []);
  if (error) {
    // Print errors if any
    return <div>An error occured: {error.message}</div>;
  }
  //////////////////////////////////////////////////////

  const showpoint = (entryname) => {
    try {
      setDes(entryname)
      setModalShow(true)
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div>
      <div class="head">
        ประกาศคะแนน
      </div>
      <div className="cards-container">
        {data.map(({ id, attributes }) => (      //แสดงผลข้อมูล
          <Card key={id} className="item">
            <Card.Body>
              <Card.Title>
                  <div>
                    {attributes.name}
                  </div>
                  <div style={{ margin: '10px' }}>
                    <button onClick={() => showpoint(attributes.name)}>View</button>
                  </div>
              </Card.Title>
            </Card.Body>
          </Card>
        ))}

        <div className="backposition" style={{width: '30cm'}}>
          <button onClick={handleGoBack}>Go back</button>
        </div>
 
        <MyVerticallyCenteredModal
          show={modalShow}
          onHide={() => setModalShow(false)}
          describ={des}
        />
      </div>
    </div>
  );
};

function MyVerticallyCenteredModal(props) {
  const { courseName } = useParams()      //ชื่อวิชา
  const user = localStorage.getItem('usern')          //ชื่อ user
  const [error, setError] = useState(null)
  const entry = props.describ
  const [data, setData] = useState(() => {
    // พยายามดึงข้อมูลจาก localStorage
    const storedData = localStorage.getItem('myData');
    return storedData ? JSON.parse(storedData) : [];
  });

  //////////////////////////////////////////////////////
  useEffect(() => {
    const config = {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
      },
    };

    axios.get(`http://localhost:1337/api/entries?populate[course][filters][subject][$eq]=${
      courseName}&populate[owner][filters][username]=${user}&populate[event][filters][name]=${entry}`, config)
      .then(({ data }) => {
        const filteredData = data.data.filter(item =>
          item.attributes.course.data !== null &&
          item.attributes.event.data !== null &&
          item.attributes.owner.data !== null
        );
        setData(filteredData);

        // บันทึกข้อมูลใน localStorage
        localStorage.setItem('myData', JSON.stringify(filteredData));
      })
      .catch((error) => setError(error));
  }, [courseName, user, entry]);
  if (error) {
    // Print errors if any
    return <div>An error occured: {error.message}</div>;
  }
  //////////////////////////////////////////////////////

  const see = (id) => {
    axios.get(`http://localhost:1337/api/entries/${id}/seedata`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
      }
    })
    .then(() => {
      console.log(id);
      window.location.reload(); // รีเฟรชหน้าเว็บ
    })
    .catch((error) => console.error(error));
  }

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {courseName}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <h4>{entry}</h4>
        {data.length === 0
          ? <h5>ไม่มีคะแนน</h5>
          : <div>
              {data.map(({ id, attributes }) => (
                <p key={id}>
                  {attributes.result}
                </p>
              ))}
          </div>
        }
        
      </Modal.Body>

      <Modal.Footer>
        {data.length > 0 && data[0].attributes && data[0].attributes.seedata === null
        ?(
          <Button onClick={() => see(data[0].id)}>รับทราบ</Button>
        ) : (
          <Button onClick={() => see(data[0].id)} disabled>รับทราบ</Button>
        )}
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default Showinfo;
