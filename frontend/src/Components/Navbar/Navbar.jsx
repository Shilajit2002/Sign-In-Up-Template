import React, { useState, useEffect } from 'react'
import "./Navbar.css"
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie';
import axios from 'axios';

const Navbar = () => {
  const navigate = useNavigate();

  const [username, setuserName] = useState(null);

  useEffect(() => {
    const token = Cookies.get('token');
    const userid = Cookies.get('userid');
    if (token && userid) {
      axios.get(`http://localhost:8000/api/users/user/${userid}`, {
        headers: {
          'Authorization': `${token}`
        }
      }).then((res) => {
        // console.log(res);
        const firstname = res.data[0].firstname;
        setuserName(firstname);
      }).catch((err) => {
        // console.log(err)
        Cookies.remove("token");
        Cookies.remove("userid");
      })
    }
  })

  return (
    <>
      <div className="navbar">
        <ul>
          <li onClick={() => { navigate("/") }}>Home</li>
          {
            Cookies.get('token') && Cookies.get('userid') ?
              <>
                <li onClick={() => {
                  navigate(`/dashboard/${Cookies.get('userid')}`);
                }}>Hey, {username}</li>
                <li onClick={() => {
                  Cookies.remove("token");
                  Cookies.remove("userid");
                  navigate("/signin");
                }}>LogOut</li>
              </> :
              <></>
          }
        </ul>
      </div>
    </>
  )
}

export default Navbar
