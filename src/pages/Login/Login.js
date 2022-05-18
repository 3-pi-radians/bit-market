import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from 'yup';
import Button from '@mui/material/Button';
import { Link, useParams, useNavigate } from "react-router-dom";
import MailIcon from '@mui/icons-material/Mail';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LoginIcon from '@mui/icons-material/Login';
import { useDispatch } from "react-redux";
import InputField from "../../components/InputField/InputField";
import { inputFieldTypes } from "../../utils/input-types";
import axios from "../../apis/backendApi";
import { setUser } from '../../redux/actions/user-actions';

import "./Login.css";
import { toast, ToastContainer } from "react-toastify";
import ProcessLoader from "../../components/ProcessLoader/ProcessLoader";

const Login = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

    const initialValues = {
        email: "",
        passwd: "",
    };
    const loginUser = async (values) => {
      setIsProcessing(true);
      try {
        let response = await axios({
            method: "post",
            url: "/auth/login",
            data: {
                password: values.passwd,
                email: values.email,
            }
        });
      
        if (response.data.status === "error") {
          toast.error(response.data.message)
          setIsProcessing(false);
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
        toast.error(error.message);
    }
    }

    const validate = Yup.object({
      email: Yup.string().email("Please provide Valid Email")
              .max(50).required("Email is Required"),
      passwd: Yup.string()
                  .max(15, "Password must be 6 to 15 Characters")
                  .min(6, "Password must be 6 to 15 Characters")
  });

    return(
        <div className="login">
          <div className="login--container">
            <Formik initialValues={initialValues} validationSchema={validate}  validateOnMount> 
              {
                formik => (
                  <div className='login--formbody'>
                    <h3 className="text-3xl font-semibold">Login Here</h3>
                    <Form>
                        <InputField field_type={inputFieldTypes.OPEN} label="Email" name="email" placeholder="Your email id" type="email" icon={<MailIcon />}/>		
                        <InputField field_type={inputFieldTypes.OPEN} label="Password" name="passwd" placeholder="Password" type="password" icon={<LockOpenIcon />}/>	
                        <Button type="submit" disabled={!formik.isValid || isProcessing}
                          onClick={() => loginUser(formik.values)}  
                            variant="contained" endIcon={<LoginIcon/>} >
                            Login
                        </Button>
                    </Form>
                    <p className = "login--formbody-login">
              OR <br />
              Not Registered yet? <Link to = "/register">Sign Up</Link> 
            </p>
                    </div>
                )
              }
            </Formik>
            <div className="login--welcome">
             <h1 className="login--welcomeback text-center sm:text-4xl md:text-5xl lg:text-7xl font-bold"> Welcome Back</h1>
             <h2 className="font-semibold md:text-lg lg:text-xl text-center">Login an continue your seamless Shopping!</h2>
            </div>
          </div>
          <ToastContainer />
          <ProcessLoader isProcessing={isProcessing} /> 
        </div>
    );
}

export default Login;