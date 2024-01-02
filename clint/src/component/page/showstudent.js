import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Showinfo = () => {
  const navigate = useNavigate();
  const token = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
    },
  }
  const [point, setPoint] = useState()

  //ย้อนกลับ
  const handleClick = () => {
    navigate("/student");
  };

  //ดึงข้อมูลคะแนน
  useEffect(() => {
    const information = async () => {
      try {
        const response = await axios.get("http://localhost:1337/api/users/me?populate=entries", token);
        setPoint(response.data.entries.map(item => ({
          id: item.id,
          result: item.result
        })))
      } catch (error) {
        console.error("Error fetching information:", error);
      }
    };

    information()
  }, [])

  console.log(point)

  return (
    <div>
      {console.log(point)}
      {point && (
        <ul>
          {point.map((item) => (
            <li key={item.id}>{item.result}</li>
          ))}
        </ul>
      )}
      <button onClick={handleClick}>back</button>
    </div>
  );
};

export default Showinfo;
