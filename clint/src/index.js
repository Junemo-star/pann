import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import { createBrowserRouter, RouterProvider, } from "react-router-dom";
import StudentPage from './page/Studentpage';
import Stuffpage from './page/Stuffpage';
import 'bootstrap/dist/css/bootstrap.min.css';
import Showinfo from './page/Show';
import AddEventForm from './component/additem';
import UploadFile from './component/point';
import { AuthProvider } from './component/AuthContext';

/////////////---test---//////////////////
import test from './page/Testcode';
/////////////---test---//////////////////

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },

  {
    path: "/student",
    element: <StudentPage />,
  },

  {
    path: "/stuff",
    element: <Stuffpage />,
  },

  {
    path: "/student/:courseName",
    element: <Showinfo />,
  },

  // หากต้องการเทสให้ import ฟังชั่นเข้ามา พร้อมลิ้งที่ element
  {
    path: "/test",
    element: <test></test>
  },

  {
    path: "/add",
    element: <AddEventForm />
  },

  {
    path: "/upload",
    element: <UploadFile />
  }

]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>

      <RouterProvider router={router} />
    
    </AuthProvider>
  </React.StrictMode>

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

