import axios from "axios";
import { useNavigate } from "react-router-dom";

const Showinfo = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/student");
  };

  //ต้องแก้ Hello world เพื่อทำให้แสดงข้อมูลตาม id ที่กดเข้ามา
  return (
    <div>
      Hello world
      <button onClick={handleClick}>back</button>
    </div>
  );
};

export default Showinfo;
