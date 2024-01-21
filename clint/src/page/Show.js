import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from 'react-router-dom';
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
  const [hoverr, setHoverr] = useState(null)
  const { courseName } = useParams()

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
    axios.get(`http://localhost:1337/api/events?populate[course][filters][subject][$eq]=${courseName}`, config)
      .then(({ data }) => {
        const filteredData = data.data.filter(item =>
          item.attributes.course.data !== null
        )
        setData(filteredData)
      })
      .catch((error) => setError(error));
  }, []);

  if (error) {
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
        {console.log(data)}
      </div>

      <div className="cards-container">
        {data.length === 0 ? (
          <Card className="item" style={{
            height: "3cm",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}>
            <h1>ไม่มีข้อมูล</h1>
          </Card>
        ) : (
          data.map(({ id, attributes }) => (
            <Link
              className="no-underline"
              onClick={() => {
                // ตรวจสอบว่าเป็นไปตามเงื่อนไขหรือไม่
                if (new Date() >= new Date(attributes.datetime)) {
                  showpoint(attributes.name);
                } else {
                  // แสดงข้อความหรือทำอย่างอื่นที่คุณต้องการเมื่อไม่สามารถกดได้
                  console.log("Cannot click yet. Not reached the scheduled time.");
                }
              }}>
              <Card
                key={id}
                className="item"
                onMouseOver={() => setHoverr(id)}
                onMouseOut={() => setHoverr(null)}
                style={{
                  transition: "background-color 0.3s",
                  marginTop: "px",
                  backgroundColor: hoverr === id && new Date() >= new Date(attributes.datetime) ? "rgba(0, 60, 113, 0.2)" : "rgba(0, 60, 113, 0.05)",
                  cursor: "pointer",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Card.Body>
                  <Card.Title>
                    {console.log(attributes)}
                    <div><h3>{attributes.name}</h3></div>
                    <div style={{ marginBottom: "8px" }}>{new Date(attributes.datetime).toLocaleString()}</div>
                    <div>
                      <h5>
                        {attributes.description !== null ? (
                          attributes.description.split('\n').map((line, index) => (
                            <span key={index}>{line}<br /></span>
                          ))
                        ) : (
                          null
                        )}
                      </h5>
                    </div>
                  </Card.Title>
                </Card.Body>
              </Card>
            </Link>
          ))
        )}


        <div className="backposition" style={{ width: '30cm' }}>
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
          {console.log(data)}
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
          ? (
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
