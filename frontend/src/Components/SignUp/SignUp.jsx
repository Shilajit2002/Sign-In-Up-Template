import React, { useState, useEffect } from 'react'
import "./SignUp.css"
import profile_person from "./Assets/profile-person.jpg"
import PersonIcon from '@mui/icons-material/Person';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import MailIcon from '@mui/icons-material/Mail';
import PasswordIcon from '@mui/icons-material/Password';
import PhoneIcon from '@mui/icons-material/Phone';
import axios from 'axios';
import { SvgIcon } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const SignUp = () => {
    // UseNavigate
    const navigate = useNavigate();

    // CountryCode UseState for Storing the Country Details with Code
    const [countrycode, setcountryCode] = useState([]);

    // UseEffect for store the Country Details from Backend Database
    useEffect(() => {
        axios.get("http://localhost:8000/api/codes/allcountrycode").then((res) => {
            setcountryCode(res.data);
            // console.log(res.data)
        }).catch((err) => {
            console.log(err);
        })
    }, [])

    // User UseState
    const [user
        , setUser] = useState({
            firstname: "",
            lastname: "",
            email: "",
            password: "",
            confirmpassword: "",
            country: "",
            code: "",
            phone: ""
        })

    // Alert UseState
    const [alert, setAlert] = useState({
        mailAlert: "",
        passAlert: "",
        conpassAlert: "",
        phoneAlert: ""
    })

    // Handle User Change Func
    const handleUserChange = (e) => {
        const { name, value } = e.target;
        setUser({
            ...user
            ,
            [name]: value,
        })
    }

    // UseEffect for Set the Country using by Country Code
    useEffect(() => {
        setUser(prevState => {
            return {
                ...prevState,
                country: countrycode.filter(c => c.code === user
                    .code.substring(2)).map(country => country.country)[0]
            }
        });
    }, [user.code, countrycode]);

    // Password Show,Hide UseState
    const [hidePass, setHidePass] = useState({
        type: "password",
        flag: true
    });

    // Confirm Password Show,Hide UseState
    const [hideconPass, setHideConPass] = useState({
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

    // Confirm Password See & Hide Func
    const conpasswordFunc = () => {
        hideconPass.flag ? setHideConPass({
            type: "text",
            flag: false
        }) : setHideConPass({
            type: "password",
            flag: true
        })
    }

    const [enterhit, setEnterHit] = useState(true);

    //  Sign Up Form Submit Func
    const handleSignUpSubmit = () => {
        // Check the Condition if the form is fill then got backend
        if (user
            .firstname !== "" && user
                .lastname !== "" && user
                    .email !== "" && alert.mailAlert === "" && user
                        .password !== "" && alert.passAlert === "" && user
                            .confirmpassword !== "" && alert.conpassAlert === "" && user
                                .phone !== "" && alert.phoneAlert === "" && user
                                    .code !== "" && user
                                        .country !== "" && user
                                            .firstname.trim(" ") && user
                                                .lastname.trim(" ")) {
            // Send to the Backend of form data
            axios.post("http://localhost:8000/api/users/register", user
            ).then((req) => {
                // If Success then Set Form Null
                setUser({
                    firstname: "",
                    lastname: "",
                    email: "",
                    password: "",
                    confirmpassword: "",
                    country: "",
                    code: "",
                    phone: ""
                })
                // console.log(req);

                // Success Result
                Swal.fire({
                    icon: 'success',
                    title: '** You are Registered 😎 **',
                    confirmButtonText: 'Ok',
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate("/signin");
                    } else {
                        navigate("/signin");
                    }
                })
            }).catch((err) => {
                // console.log(err);

                // If Error then show the error message
                if (err.response.data === "User Already Registered !!") {
                    Swal.fire({
                        icon: 'warning',
                        title: 'You have already Registered !!',
                        html: 'Please SignIn ...',
                        confirmButtonText: 'Ok',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            navigate("/signin");
                        } else {
                            navigate("/signin");
                        }
                    })
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Server Error !!',
                        confirmButtonText: 'Ok'
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
            handleSignUpSubmit();
        }
    }, [enterhit]);

    const detectKeyDown = (e) => {
        if (e.key === 'Enter' && enterhit) {
            setEnterHit(false, () => {
                handleSignUpSubmit();
            });
        }
    }

    useEffect(() => {
        document.addEventListener('keypress', detectKeyDown, true);
    })

    return (
        <>
            <div className="signup">
                <div className="signUpForm">
                    <h1>~ SIGN UP ~</h1>
                    <img src={profile_person} alt="" />

                    {/* First Name */}
                    <div className="outerDivForm">
                        <PersonIcon style={{ color: "white" }} />
                        <input type="text" name="firstname" id="" placeholder='Enter First Name' value={user
                            .firstname} onChange={handleUserChange} />
                    </div>

                    {/* Last Name */}
                    <div className="outerDivForm">
                        <PersonIcon style={{ color: "white" }} />
                        <input type="text" name="lastname" id="" placeholder='Enter Last Name' value={user
                            .lastname} onChange={handleUserChange} />
                    </div>

                    {/* Email ID */}
                    <div className="outerDivForm">
                        <MailIcon style={{ color: "white" }} />
                        <input type="email" name="email" id="" placeholder='Enter Email Id' value={user
                            .email} onChange={handleUserChange} onBlur={() => {
                                if (!/^([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/.test(user
                                    .email)) {
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
                        <input type={hidePass.type} name="password" id="" placeholder='Enter Password' value={user
                            .password} onChange={handleUserChange} onBlur={() => {
                                if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+-=,./<>?;:'"[\]{}|~`])(?=.{8,})/
                                    .test(user
                                        .password)) {
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

                    {/* Confirm Password */}
                    <div className="outerDivForm">
                        <PasswordIcon style={{ color: "white" }} />
                        <input type={hideconPass.type} name="confirmpassword" id="" placeholder='Re-Enter Password' value={user
                            .confirmpassword} onChange={handleUserChange} onBlur={() => {
                                if (user
                                    .password !== user
                                        .confirmpassword) {
                                    setAlert({
                                        ...alert,
                                        conpassAlert: "Password not match !!"
                                    });
                                } else {
                                    setAlert({
                                        ...alert,
                                        conpassAlert: ""
                                    });
                                }
                            }}
                        />
                        {/* Confirm Password Eye Button Show Hide Logic */}
                        <SvgIcon
                            component={hideconPass.flag ? VisibilityOffIcon : VisibilityIcon}
                            onClick={conpasswordFunc}
                            style={{ cursor: 'pointer', color: 'white' }}
                        />
                    </div>
                    {/* Show Confirm Password Alert */}
                    <p>{alert.conpassAlert}</p>

                    {/* Phone No. */}
                    <div className="outerDivForm">
                        <PhoneIcon style={{ color: "white" }} />
                        {/* Country Code Select Option */}
                        <select name="code" id="" value={user
                            .code} onChange={handleUserChange}>
                            <option value="" disabled={true}>Select</option>
                            {countrycode.map((val, index) => {
                                return <option key={index} >
                                    + {val.code}
                                </option>
                            })}
                        </select>
                        <input type="phone" name="phone" id="" placeholder='Enter Phone no.' value={user
                            .phone} onChange={handleUserChange} onBlur={() => {
                                if (!/^([+]?[0-9]{1,4}[ -]?)?([0-9]{10})$/.test(user
                                    .phone)) {
                                    setAlert({
                                        ...alert,
                                        phoneAlert: "Invalid phone no."
                                    });
                                } else {
                                    setAlert({
                                        ...alert,
                                        phoneAlert: ""
                                    });
                                }
                            }} />
                    </div>
                    {/* Show Phone Alert */}
                    <p>{alert.phoneAlert}</p>

                    {/* Sign Up Submit Button */}
                    <button className="signupup" onClick={handleSignUpSubmit}>Sign Up</button>

                    <p style={{ textAlign: 'center', margin: '5px 0' }}>OR</p>
                    <p style={{ textAlign: 'center', margin: '5px 0' }}>Already have an account?</p>

                    {/* Sign In Button */}
                    <button className="signupin" onClick={() => { navigate("/signin") }}>Sign In</button>
                </div>
            </div>
        </>
    )
}

export default SignUp
