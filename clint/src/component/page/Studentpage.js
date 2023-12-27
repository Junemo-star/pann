import axios from "axios";
import { useState, useEffect } from "react";

function StudentPage() {
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);

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

  const check_data_user = (id) =>{
    const dataid = data.find(entry => entry.id === id)   //นำไอดีที่ได้ไปหาใน Arrey 
    console.log(dataid)
  }
 
  return (
    <div>
      <h1>ประกาศคะแนน</h1>
      <ul>
          {data.map(({ id, attributes }) => (      //แสดงผลข้อมูล
            <button key={id} onClick={() => check_data_user(id)}>{attributes.name}</button> //แก้วิชาให้เป็นปุ่มเพื่อจะกดดูข้อมูลด้านใน
          ))}
      </ul>
    </div>
  );
}

export default StudentPage;

