import React, { useState, useEffect } from 'react'
import "./SignIn.css"
import profile_person from "./Assets/profile-person.jpg"
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import MailIcon from '@mui/icons-material/Mail';
import PasswordIcon from '@mui/icons-material/Password';
import axios from 'axios';
import { SvgIcon } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';

const SignIn = () => {
    // UseNavigate
    const navigate = useNavigate();

    // User UseState
    const [loguser, setlogUser] = useState({
        email: "",
        password: "",
    })

    // Alert UseState
    const [alert, setAlert] = useState({
        mailAlert: "",
        passAlert: "",
    })

    // Handle User Change Func
    const handleLogUserChange = (e) => {
        const { name, value } = e.target;
        setlogUser({
            ...loguser,
            [name]: value,
        })
    }

    // Password Show,Hide UseState
    const [hidePass, setHidePass] = useState({
        type: "password",
        flag: true
    });

    // Password See & Hide Func
    const passwordFunc = () => {
        hidePass.flag ? setHidePass({
            type: "text",
            flag: false
        }) : setHidePass({
            type: "password",
            flag: true
        })
    }

    const [enterhit, setEnterHit] = useState(true);

    //  Sign In Form Submit Func
    const handleSignInSubmit = () => {
        // Check the Condition if the form is fill then got backend
        if (loguser.email !== "" && alert.mailAlert === "" && loguser.password !== "" && alert.passAlert === "") {
            // Send to the Backend of form data
            axios.post("http://localhost:8000/api/users/login", loguser).then((req) => {
                // If Success then Set Form Null
                setlogUser({
                    email: "",
                    password: "",
                })
                // console.log(req);
                Cookies.set("token", req.data.token);
                Cookies.set("userid", req.data.userid);
                // console.log(JSON.parse(Cookies.get('user')));
                navigate(`/dashboard/${req.data.userid}`);

            }).catch((err) => {
                // console.log(err);

                // If Error then show the error message
                if (err.response.data === "User Not Registered !!") {
                    Swal.fire({
                        icon: 'warning',
                        title: `${err.response.data}`,
                        html: 'Please SignUp ...',
                        confirmButtonText: 'Ok',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            navigate("/signup");
                        } else {
                            navigate("/signup");
                        }
                    })
                } else if (err.response.data === "Password is Incorrect !!") {
                    Swal.fire({
                        icon: 'warning',
                        title: `${err.response.data}`,
                        html: '`~` Please enter correct password `~`',
                        confirmButtonText: 'Ok',
                    })
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Server Error !!',
                        confirmButtonText: 'Ok',
                    }).then(() => {
                        setEnterHit(true);
                    })
                }
            })
        }
        // Else show fill the form
        else {
            Swal.fire({
                icon: 'warning',
                title: 'Please fill the form !!',
                confirmButtonText: 'Ok',
            }).then(() => {
                setEnterHit(true);
            })
        }
    }

    useEffect(() => {
        if (!enterhit) {
            handleSignInSubmit();
        }
    }, [enterhit]);

    const detectKeyDown = (e) => {
        if (e.key === 'Enter' && enterhit) {
            setEnterHit(false, () => {
                handleSignInSubmit();
            });
        }
    }

    useEffect(() => {
        document.addEventListener('keypress', detectKeyDown, true);
    })

    return (
        <>
            <div className="signin">
                <div className="signInForm">
                    <h1>~ SIGN IN ~</h1>
                    <img src={profile_person} alt="" />

                    {/* Email ID */}
                    <div className="outerDivForm">
                        <MailIcon style={{ color: "white" }} />
                        <input type="email" name="email" id="" placeholder='Enter Email Id' value={loguser.email} onChange={handleLogUserChange} onBlur={() => {
                            if (!/^([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/.test(loguser.email)) {
                                setAlert({
                                    ...alert,
                                    mailAlert: "Invalid email address !!"
                                });
                            } else {
                                setAlert({
                                    ...alert,
                                    mailAlert: ""
                                });
                            }
                        }} />
                    </div>
                    {/* Show Email Alert */}
                    <p>{alert.mailAlert}</p>

                    {/* Password */}
                    <div className="outerDivForm">
                        <PasswordIcon style={{ color: "white" }} />
                        <input type={hidePass.type} name="password" id="" placeholder='Enter Password' value={loguser.password} onChange={handleLogUserChange} onBlur={() => {
                            if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+-=,./<>?;:'"[\]{}|~`])(?=.{8,})/
                                .test(loguser.password)) {
                                setAlert({
                                    ...alert,
                                    passAlert: "at least 8 characters and contain at least one lowercase letter, one uppercase letter, one number, and one special character"
                                });
                            } else {
                                setAlert({
                                    ...alert,
                                    passAlert: ""
                                });
                            }
                        }} />
                        {/* Password Eye Button Show Hide Logic */}
                        <SvgIcon
                            component={hidePass.flag ? VisibilityOffIcon : VisibilityIcon}
                            onClick={passwordFunc}
                            style={{ cursor: 'pointer', color: 'white' }}
                        />
                    </div>
                    {/* Show Password Alert */}
                    <p>{alert.passAlert}</p>

                    {/* Sign In Submit Button */}
                    <button className="signupin" onClick={handleSignInSubmit}>Sign In</button>

                    <p style={{ textAlign: 'center', margin: '5px 0' }}>OR</p>
                    <p style={{ textAlign: 'center', margin: '5px 0' }}>Not have an account?</p>

                    {/* Sign Up Button */}
                    <button className="signupup" onClick={() => { navigate("/signup") }}>Sign Up</button>
                </div>
            </div>
        </>
    )
}

export default SignIn
