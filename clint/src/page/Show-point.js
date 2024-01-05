import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from "react";

const Showpoint = () => {
  const { courseName } = useParams()      //ชื่อวิชา
  const { entry } = useParams()           //ประเภท
  const user = localStorage.getItem('usern')          //ชื่อ user
  const [data, setData] = useState([])
  const [error, setError] = useState(null)
  const [response, setResponse] = useState()

  useEffect(() => {
    //เก็บข้อมูล jwt ที่ได้จากการ login
    const config = {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
        // สามารถเพิ่ม header อื่น ๆ ตามต้องการได้
      },
    };

    //เรียกข้อมูล
    axios.get(`http://localhost:1337/api/entries?populate[course][filters][subject][$eq]=${courseName}&populate[owner][filters][username]=${user}&populate[event][filters][name]=${entry}`, config)
      .then(({ data }) => setData(data.data))
      .catch((error) => setError(error));
  }, []);

  const filteredData = data.filter(item =>
    item.attributes.course.data !== null &&
    item.attributes.event.data !== null &&
    item.attributes.owner.data !== null
  );

  return (
    <div>
      <ul>
        {filteredData.map(({id,attributes}) => (
          <p key={id}>
            <li>{attributes.course.data.attributes.subject}</li>
            <li>{attributes.course.data.attributes.description}</li>
          </p>
        ))}
      </ul>
    </div>
  )
}

export default Showpoint;