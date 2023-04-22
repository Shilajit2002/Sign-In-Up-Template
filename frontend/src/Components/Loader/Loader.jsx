import React from 'react'
import './Loader.css'
import { CircularProgress } from '@mui/material';

const Loader = (props) => {
    return (
        <>
            {
                props.loading ?
                    <div className="loader">
                        <CircularProgress color="secondary" />
                    </div>
                    : <></>
            }
        </>
    )
}

export default Loader
