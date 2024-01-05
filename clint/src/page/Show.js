import axios from "axios";
import { useState , useEffect } from "react";
import { useNavigate , useParams} from 'react-router-dom';

const Showinfo = () => {
  const [data, setData] = useState([])
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const { courseName } = useParams()
  const subject = courseName

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
  
  const showpoint = (entryname) => {
    try{
      navigate(`/student/${subject}/${entryname}`)
      console.log(courseName)
    }catch (e) {
      console.log(e)
    }
  }

  return (
    <div>
      {console.log(data)}
      <ul>
          {data.map(({ id, attributes }) => (      //แสดงผลข้อมูล
            <button key={id} onClick={() => showpoint(attributes.name)}>
              {attributes.name}
            </button>
          ))}
      </ul>
    </div>
  );
};

export default Showinfo;
