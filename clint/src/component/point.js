import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { useParams, useNavigate } from 'react-router-dom';

const UploadFile = () => {
  const [excelData, setExcelData] = useState(null);
  const [stdid, setStdid] = useState([]);
  const [postSuccess, setPostSuccess] = useState(false); // Track post status
  const navigate = useNavigate();

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];

    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        // Assuming the first sheet is the one you want to read
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const parsedData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        console.log('Excel Data:', parsedData);
        setExcelData(parsedData);
      } catch (error) {
        console.error('Error reading Excel file:', error);
      }
    };

    reader.readAsArrayBuffer(selectedFile);
  };

  const postToStrapi = async () => {
    try {
      const checkid = await axios.get('http://localhost:1337/api/users', {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
        }
      });
      console.log(checkid);

      const filteredEmails = checkid.data.filter((item) =>
        item.email.match(/^\d{2}/)
      );
      console.log(filteredEmails);
      const filteredstdid = filteredEmails.map((item) => ({
        id: item.id,
        email: item.email,
      }));
      setStdid(filteredstdid);
      console.log(filteredstdid);

      for (const excelRow of excelData) {
        const studentId = excelRow[2];

        const matchedUser = filteredEmails.find(
          (item) => item.email.slice(0, 3) === studentId.toString()
        );

        if (matchedUser) {
          const userId = matchedUser.id;

          const response = await axios.post('http://localhost:1337/api/entries',
            {
              data: {
                result: `${excelRow[0]}`,   //คะแนน
                comment: `${excelRow[1]}`,   //คอมเม้น
                owner: parseInt(userId),     //เลขประจำตัวนักศึกษา (3 ตัว)
                event: 15,
              },
            },
            {
              headers: {
                  'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
              }
            }
          );

          console.log('Post to Strapi successful:', response.data);
          setPostSuccess(true);
        }
      }
    } catch (error) {
      console.error('Error posting to Strapi:', error);
    }
  };

  useEffect(() => {
    if (postSuccess) {
      setPostSuccess(false);
      window.location.reload();
    }
  }, [postSuccess]);

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={postToStrapi} disabled={!excelData}>
        Post to Strapi
      </button>
    </div>
  );
};

export default UploadFile;
