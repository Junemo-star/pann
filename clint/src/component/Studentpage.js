import axios from "axios";
import { useState, useEffect } from "react";

function StudentPage() {
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);

  //เรียกข้อมูลจาก Strapi ผ่าน API โดยใช้ axios.defaults.headers.common ที่ Login
  //แก้บัค refresh หน้าจอแล้ว Token หาย **************************************************************
  useEffect(() => {
    axios.get("http://localhost:1337/api/events")
      .then(({ data }) => setData(data.data))
      .catch((error) => setError(error));
  }, []);

  if (error) {
    // Print errors if any
    return <div>An error occured: {error.message}</div>;
  }


  return (
    <div>
      <ul>
        {data.map(({ id, attributes }) => (      //แสดงผลข้อมูล
          <li key={id}>{attributes.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default StudentPage;

