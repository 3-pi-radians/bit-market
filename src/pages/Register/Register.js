import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from 'yup';
import Button from '@mui/material/Button';
import PersonIcon from '@mui/icons-material/Person';
import MailIcon from '@mui/icons-material/Mail';
import PhoneIcon from '@mui/icons-material/Phone';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LoginIcon from '@mui/icons-material/Login';
import { useDispatch } from "react-redux";

import InputField from "../../components/InputField/InputField";
import { inputFieldTypes, fieldComponents } from "../../utils/input-types";
import axios from "../../apis/backendApi";
import { setUser } from '../../redux/actions/user-actions';
import "./Register.css";
import { toast, ToastContainer } from "react-toastify";
import ProcessLoader from "../../components/ProcessLoader/ProcessLoader";

const Register = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const phoneRegExp = /^[6-9]{1}\d{9}$/
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const validate = Yup.object({
        name: Yup.string()
                .required("Name is Required")
                .max(30, "Max limit is 30 characters"),
        email: Yup.string().email("Please provide Valid Email")
                .max(50).required("Email is Required"),
        phone: Yup.string().matches(phoneRegExp, "Enter a valid Phone number")
                    .required("Phone number is Required"),
        passwd: Yup.string()
                    .max(15, "Password must be 6 to 15 Characters")
                    .min(6, "Password must be 6 to 15 Characters")
                    .required("Password is Required"),
        confirmpasswd: Yup.string()
                        .oneOf([Yup.ref("passwd"), null], "Passwords must match")
                        .required("Required")
    });
    
    const initialValues = {
        name: "",
        email: "",
        phone: "",
        passwd: "",
        confirmpasswd: ""
    };

    const registerUser = async (values) => {
        setIsProcessing(true);
        try {
            let response = await axios({
                method: "post",
                url: "/auth/register",
                data: {
                    name: values.name,
                    password: values.passwd,
                    email: values.email,
                    phone: values.phone
                }
            });
             
            if (response.data.status === "error") {
                setIsProcessing(false);
                toast.error(response.data.message)
            } else if (response.data.status === "ok") {
                const {id, name, email, addresses, phone} = response.data.payload;
                let payload = {
                    isLoggedIn: true,
                    name,
                    email,
                    id,
                    addresses,
                    phone
                }
                setIsProcessing(false);
                dispatch(setUser(payload));
                navigate("/");
            }
        } catch (error) {
            console.log(error);
            setIsProcessing(false);
            toast.error(error.message)
        }
    }

    return(
        <div className="register">
            <div className="register--container">
                <Formik initialValues={initialValues} validationSchema={validate} validateOnMount> 
                {
                    formik => (
                    <div className='register--formbody'>
                        <h3 className='text-3xl font-semibold'>Register Here</h3>
                        <Form>
                            <InputField field_component={fieldComponents.INPUT} field_type={inputFieldTypes.OPEN} label="Email" name="email" placeholder="Your email id" type="email" icon={<MailIcon />}/>
                            <InputField field_component={fieldComponents.INPUT} field_type={inputFieldTypes.OPEN} label="Name" name="name" placeholder="Your full name" type="text" icon={<PersonIcon/>}/>		
                            <InputField field_component={fieldComponents.INPUT} field_type={inputFieldTypes.OPEN} label="Phone" name="phone" placeholder="Your Phone Number" type="text" icon={<PhoneIcon />}/>	
                            <InputField field_component={fieldComponents.INPUT} field_type={inputFieldTypes.OPEN} label="Password" name="passwd" placeholder="Password" type="password" icon={<LockOpenIcon />}/>	
                            <InputField field_component={fieldComponents.INPUT} field_type={inputFieldTypes.OPEN} label="Confirm Password" name="confirmpasswd" placeholder="Confirm Your Password" type="password" icon={<LockOpenIcon />}/>	
                            <Button type="button" disabled={!formik.isValid || isProcessing}
                                onClick={() => registerUser(formik.values)}
                                variant="contained" endIcon={<LoginIcon/>} >
                                Register your account
                            </Button>
                        </Form>
                        <p className = "register--formbody-login">
                            OR <br />
                            Already a User? <Link to = "/login">Log in</Link> 
                        </p>
                    </div>
                    )
                }
            </Formik>
                <div className="register--welcome">
                    <h1 className="login--welcomeback text-center sm:text-4xl md:text-5xl lg:text-7xl font-bold">Welcome to BitMarket</h1>
                    <h2 className="font-semibold md:text-lg lg:text-xl text-center">Welcome to India's No.1 Ecommerce platform</h2>
                </div>
            </div>
            <ToastContainer />
            <ProcessLoader isProcessing={isProcessing} />
        </div>
    );
};

export default Register;