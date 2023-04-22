import React from 'react'
import './Home.css'

import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    return (
        <>
            <div className="homeContainer">
                <h1>~ WELCOME ~</h1>
                <div className="buttonDiv">
                    <button className="signUp" onClick={() => { navigate("/signup") }}>Sign Up</button>
                    <button className="signIn" onClick={() => { navigate("/signin") }}>Sign In</button>
                </div>
            </div>
        </>
    )
}

export default Home
