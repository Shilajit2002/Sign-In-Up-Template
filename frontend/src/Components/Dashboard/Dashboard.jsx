import React, { useState, useEffect } from 'react'
import "./Dashboard.css"
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import SignIn from '../SignIn/SignIn';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import defaultProfile from "./Assets/profile-person.jpg";
import PersonIcon from '@mui/icons-material/Person';
import MailIcon from '@mui/icons-material/Mail';
import PhoneIcon from '@mui/icons-material/Phone';
import FlagIcon from '@mui/icons-material/Flag';
import Loader from '../Loader/Loader';

const Dashboard = (props) => {
    // Import UseNavigate
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

    // Take the from Params
    const { id } = useParams();

    // Take the token and userid if it is not peresent redirect to SignIn page
    if (!(Cookies.get('token') && Cookies.get('userid'))) {
        Cookies.remove("token");
        Cookies.remove("userid");
        window.location.href = "/signin";
    }

    // User Details UseState
    const [userdetails, setuserDetails] = useState(null);
    // Image File Store UseState
    const [image, setImage] = useState(null);
    // Image File Alert UseState
    const [imgerror, setimgError] = useState(null);
    // User Image Url UseState
    const [imgurl, setimgUrl] = useState(null);

    // A chunk size
    const CHUNK_SIZE = 8192;

    // Convert Image Array Buffer to Base 64
    const arrayBufferToBase64 = (buffer) => {
        const chunks = [];
        const bytes = new Uint8Array(buffer);
        for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
            chunks.push(String.fromCharCode.apply(null, bytes.slice(i, i + CHUNK_SIZE)));
        }
        return btoa(chunks.join(''));
    }

    // UseEffect for Get all the Details of the User
    useEffect(() => {
        // Take the Token and Userid
        const token = Cookies.get('token');
        const userid = Cookies.get('userid');
        props.loading.setLoading(true);
        // If token and userid present
        if (token && userid) {
            // If userid and params id match
            if (userid === id) {
                axios.get(`http://localhost:8000/api/users/user/${userid}`, {
                    headers: {
                        'Authorization': `${token}`
                    }
                }).then((res) => {
                    // Set the Details of the User
                    const details = res.data[0];
                    setuserDetails(details);

                    // Check if the Image array is null or not
                    if (res.data.length === 2 && res.data[1] !== null) {
                        // If not then convert Array Buffer Image to Base64String
                        const base64String = arrayBufferToBase64(res.data[1].image.data.data);
                        // Create the Image Url
                        const imageUrl = `data:${res.data[1].image.contentType};base64,${base64String}`;
                        // Set the Image Url for Showing
                        setimgUrl(imageUrl);
                    }
                    props.loading.setLoading(false);
                }).catch((err) => {
                    Swal.fire({
                        icon: 'warning',
                        title: `You are not authenticated !!`,
                        confirmButtonText: 'Ok',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            Cookies.remove("token");
                            Cookies.remove("userid");
                            window.location.href = `/signin`;
                        } else {
                            Cookies.remove("token");
                            Cookies.remove("userid");
                            window.location.href = `/signin`;
                        }
                    })
                })
            }
            // If userid and params id not match 
            else {
                Swal.fire({
                    icon: 'warning',
                    title: `You can only view your own account !!`,
                    confirmButtonText: 'Ok',
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = `/dashboard/${userid}`;
                    } else {
                        window.location.href = `/dashboard/${userid}`;
                    }
                })
            }
        }
    }, [id])

    // Handle Image Change Func
    const handleImageChange = (e) => {
        // Check the uploaded file is image or not
        if (e.target.files[0].type.match(/image\/*/) == null) {
            // If not then Set Image Url null
            setimgUrl(null);
            // Set Image File Error
            setimgError("Only Images are supported !!");
            return;
        }
        // If is it Image File
        else {
            // Set Image File Error null
            setimgError(null);
        }

        // Set Image File
        setImage(e.target.files[0]);

        //  Preview that Image File before uploading
        const reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = (event) => {
            setimgUrl(event.target.result);
        }
    }

    // Image Upload Submit Func
    const handleImageSubmit = async (event) => {
        event.preventDefault();

        // If the image is choosen and there have nor image error then upload the image
        if (image !== null && imgerror === null) {
            const formData = new FormData();
            formData.append('profileImage', image);

            axios.post(`http://localhost:8000/api/profiles/upload/${id}`, formData, {
                headers: {
                    'Authorization': `${Cookies.get('token')}`
                }
            }).then((res) => {
                // console.log(res.data);
                window.location.reload();
            }).catch((err) => {
                console.error(err);
            })
        }
        // Other Wise Error
        else {
            Swal.fire({
                icon: 'warning',
                title: 'Please upload an image !!',
                confirmButtonText: 'Ok',
            })
        }
    };

    // Alert UseState
    const [alert, setAlert] = useState({
        mailAlert: "",
        phoneAlert: ""
    })

    // Handle User Change Func
    const handleUserChange = (e) => {
        const { name, value } = e.target;
        setuserDetails({
            ...userdetails,
            [name]: value,
        })
    }

    // UseEffect for Set the Country using by Country Code
    useEffect(() => {
        if (userdetails) {
            setuserDetails({
                ...userdetails,
                country: countrycode.filter(c => c.code === userdetails.code.substring(2)).map(country => country.country)[0]
            });
        }
    }, [countrycode, userdetails]);

    const handleUserSubmit = () => {
        // Check the Condition if the form is fill then got backend
        if (userdetails
            .firstname !== "" && userdetails
                .lastname !== "" && userdetails
                    .email !== "" && alert.mailAlert === "" && userdetails
                        .phone !== "" && alert.phoneAlert === "" && userdetails
                            .code !== "" && userdetails
                                .country !== "" && userdetails
                                    .firstname.trim(" ") && userdetails
                                        .lastname.trim(" ")) {
            // Send to the Backend of form data
            axios.patch(`http://localhost:8000/api/users/user/${id}`, userdetails, {
                headers: {
                    'Authorization': `${Cookies.get('token')}`
                }
            }).then((res) => {
                // console.log(res.data);
                // If the image is choosen and there have nor image error then upload the image
                if (image !== null && imgerror === null) {
                    const formData = new FormData();
                    formData.append('profileImage', image);

                    axios.post(`http://localhost:8000/api/profiles/upload/${id}`, formData, {
                        headers: {
                            'Authorization': `${Cookies.get('token')}`
                        }
                    }).then((res) => {
                        // console.log(res.data);
                        window.location.reload();
                    }).catch((err) => {
                        console.error(err);
                    })
                }
                // Other Wise Error
                else {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Please upload an image !!',
                        confirmButtonText: 'Ok',
                    })
                }
            }).catch((err) => {
                Swal.fire({
                    icon: 'warning',
                    title: 'You can not add another person details !!',
                    confirmButtonText: 'Ok',
                })
            })
        }
        // Other Wise Error
        else {
            Swal.fire({
                icon: 'warning',
                title: 'Invalid profile details !!',
                confirmButtonText: 'Ok',
            })
        }
    }

    const deleteUser = () => {
        axios.delete(`http://localhost:8000/api/users/user/${id}`, {
            headers: {
                'Authorization': `${Cookies.get('token')}`
            }
        }).then((res) => {
            // console.log(res.data);
            window.location.reload();
        }).catch((err) => {
            Swal.fire({
                icon: 'warning',
                title: 'You can not delete another person details !!',
                confirmButtonText: 'Ok',
            })
        })
    }

    return (
        <>
            {/* If Token and UserId present then open dashboard */}
            {Cookies.get('token') && Cookies.get('userid') ? <>
                <Loader loading={props.loading.loading} />
                <div className="dashboard">
                    <div className="left">
                        <img src={imgurl ? imgurl : defaultProfile} alt="" style={{ backgroundColor: imgurl ? '' : 'aliceblue' }} />
                        <p>
                            <input type="file" id="file" onChange={handleImageChange} />
                            <label htmlFor="file"
                            >
                                <AddAPhotoIcon id="picicon" />
                            </label>
                        </p>
                        <h4 style={{ textAlign: 'center' }}>{imgerror}</h4>
                        {
                            userdetails && <>
                                <h3>{userdetails.firstname} {userdetails.lastname}</h3>
                            </>
                        }
                        <button onClick={handleImageSubmit}>Save</button>
                    </div>
                    <div className="right">
                        {
                            userdetails && <>
                                <table>
                                    <tbody>
                                        <tr>
                                            <td><PersonIcon style={{ color: "white", margin: '0px 10px' }} /> First Name</td>
                                            <td>
                                                <input type="text" name="firstname" id="" value={userdetails.firstname} onChange={handleUserChange} />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><PersonIcon style={{ color: "white", margin: '0px 10px' }} /> Last Name</td>
                                            <td>
                                                <input type="text" name="lastname" id="" value={userdetails.lastname} onChange={handleUserChange} />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><MailIcon style={{ color: "white", margin: '0px 10px' }} /> Email ID</td>
                                            <td>
                                                <input type="email" name="email" id="" placeholder='Enter Email Id' value={userdetails.email} onChange={handleUserChange} onBlur={() => {
                                                    if (!/^([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/.test(userdetails.email)) {
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
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ visibility: 'hidden' }}></td>
                                            <td style={{ color: 'red' }}>{alert.mailAlert}</td>
                                        </tr>
                                        <tr>
                                            <td><PhoneIcon style={{ color: "white", margin: '0px 10px' }} /> Phone No.</td>
                                            <td>
                                                <div className="co">
                                                    {/* Country Code Select Option */}
                                                    <select name="code" id="" value={userdetails.code} onChange={handleUserChange}>
                                                        <option value="" disabled={true}>Select</option>
                                                        {countrycode.map((val, index) => {
                                                            return <option key={index} >
                                                                + {val.code}
                                                            </option>
                                                        })}
                                                    </select>
                                                    <input type="phone" name="phone" id="" placeholder='Enter Phone no.' value={userdetails.phone} onChange={handleUserChange} onBlur={() => {
                                                        if (!/^([+]?[0-9]{1,4}[ -]?)?([0-9]{10})$/.test(userdetails.phone)) {
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

                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ visibility: 'hidden' }}></td>
                                            <td style={{ color: 'red' }}>{alert.phoneAlert}</td>
                                        </tr>
                                        <tr>
                                            <td><FlagIcon style={{ color: "white", margin: '0px 10px' }} />
                                                Country</td>
                                            <td><input type="text" name="country" id="" value={userdetails.country} readOnly /></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </>
                        }
                        <button onClick={handleUserSubmit}>Save Details</button>
                        <button onClick={deleteUser}>Delete Your Account</button>
                    </div>
                </div>
            </> : (
                // Other Wise Open Sign In Page
                <SignIn />
            )}
        </>
    );
}

export default Dashboard
