import React from 'react'
import "./NotFound.css"
import { useNavigate } from 'react-router-dom';

const NotFound = () => {

    const navigate = useNavigate();

    return (
        <>
            <div className="notfound">
                <h1>Oops!</h1>
                <h4>404 - PAGE NOT FOUND</h4>
                <p>The page you are looking for might have been removed had its name changed or is temporarily unavailable.</p>
                <button className="homepagebtn" onClick={() => {
                    navigate("/")
                }}>GO TO HOMEPAGE</button>
            </div>
        </>
    )
}

export default NotFound
