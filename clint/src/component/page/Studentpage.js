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


  return (
    <div>
      <h1>ประกาศคะแนน</h1>
      <ul>
        {data.map(({ id, attributes }) => (      //แสดงผลข้อมูล
          <li key={id}>{attributes.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default StudentPage;

