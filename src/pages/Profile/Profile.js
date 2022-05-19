import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { Formik, Form } from "formik";
import * as Yup from 'yup';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SecurityIcon from '@mui/icons-material/Security';
import PersonIcon from '@mui/icons-material/Person';
import MailIcon from '@mui/icons-material/Mail';
import PhoneIcon from '@mui/icons-material/Phone';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LoginIcon from '@mui/icons-material/Login';

import { fieldComponents, inputFieldTypes } from '../../utils/input-types';
import { setUser } from '../../redux/actions/user-actions';
import AddressCard from '../../components/AddressCard/AddressCard';
import InputField from '../../components/InputField/InputField';
import NewAddressForm from '../../components/NewAddressForm/NewAddressForm';
import "./Profile.css";
import axios from '../../apis/backendApi';
import ProcessLoader from '../../components/ProcessLoader/ProcessLoader';
import { toast, ToastContainer } from 'react-toastify';

const Profile = () => {
    const ADDRESS = "ADDRESS";
    const SECURITY = "SECURITY"; 
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [navAction, setNavAction] = useState(SECURITY);
    const [addressFormOpen, setAddressFormOpen] = useState(false);
    const [editEmail, setEditEmail] = useState(false);
    const [editName, setEditName] = useState(false);
    const [editPhone, setEditPhone] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);    
    const [passwordFormOpen, setPasswordFormOpen] = useState(false);

    const phoneRegExp = /^[6-9]{1}\d{9}$/
    const { user } = useSelector(state => state.user);

    const userValues = {
        name: user?.name,
        email: user?.email,
        phone: user?.phone 
    }
    const personalInfoValidation = Yup.object({
        name: Yup.string()
                .required("Name is Required")
                .max(30, "Max limit is 30 characters"),
        email: Yup.string().email("Please provide Valid Email")
                .max(50).required("Email is Required"),
        phone: Yup.string().matches(phoneRegExp, "Enter a valid Phone number")
                    .required("Phone number is Required")
    });

    const passwordValidation = Yup.object({
        passwd: Yup.string()
            .max(15, "Password must be 6 to 15 Characters")
            .min(6, "Password must be 6 to 15 Characters")
            .required("Password is Required"),

        newPasswd: Yup.string()
        .max(15, "Password must be 6 to 15 Characters")
        .min(6, "Password must be 6 to 15 Characters"),

        confirmNewPasswd: Yup.string()
            .oneOf([Yup.ref("newPasswd"), null], "Passwords must match")
            .required("Required")
    })

    useEffect(() => {
        if (!user?.isLoggedIn) {
            navigate("/login");
        }
    }, [user.isLoggedIn]);

    const modifyUserDataApi = async (props) => {
        try {
            setIsProcessing(true);
            let response = await axios({
                method: "put",
                url: "/user/modify-details",
                data: {
                    id: user.id,
                    userData: {...props}
                }
            });
            
            if (response.data.status === "ok") {
                let userDetails = {...user, ...props};
                dispatch(setUser(userDetails));
                setIsProcessing(false);
            } else {
                toast.error(response.data.message);
                setIsProcessing(false);
            }
        } catch (error) {
            toast.error(error.message);
            setIsProcessing(false);
        }
    }
    const saveEditedField = (props) => {
        if (props.field === "email") {
            modifyUserDataApi({email: props.value})
            setEditEmail(false);
        } else if (props.field === "name") {
            modifyUserDataApi({name: props.value})
            setEditName(false);
        } else if (props.field === "phone") {
            modifyUserDataApi({phone: props.value})
            setEditPhone(false);
        }
    }

    const toggleNewAddressForm = (value) => {
        setAddressFormOpen(value);
    }

    const changePassword = async(values) => {
        try {
            setIsProcessing(true);
            let response = await axios({
                method: "put",
                url: "/user/modify-password",
                data: {
                    id: user.id,
                    ...values
                }
            });

            if (response.data.status === "ok") {
                toast.success(response.data.message);
                setIsProcessing(false);
                setPasswordFormOpen(false);
            } else {
                toast.error(response.data.message);
                setIsProcessing(false);
            }
            setIsProcessing(false);
        } catch (error) {
            console.log(error);
            setIsProcessing(false);
            toast.error(error.message);
        }
    }

    const initialPasswordValues = {
        passwd: "",
        newPasswd: "",
        confirmNewPasswd: ""
    };

    return (
        <div className='profile bg-white'>
            <div className='profile-top-nav'>
                <div 
                    className={`profile--top-nav-items profile-top-nav-security ${navAction===SECURITY && "profile--nav-active"}`}
                    onClick={() => setNavAction(SECURITY)}>
                        <SecurityIcon />
                        <p className='profile--top-nav-text'>Personal Info &amp; Security</p>
                </div>
                <div className={`profile--top-nav-items profile-top-nav-address ${navAction===ADDRESS && "profile--nav-active"}`}
                   onClick={() => setNavAction(ADDRESS)}>
                    <LocationOnIcon />
                    <p className='profile--top-nav-text'>Your Addresses</p> 
                </div>
            </div>
            <div className='profile-nav-details'>
                {
                    navAction === SECURITY && (
                        <div className='profile--security'>
                            {
                                <div className='profile--security-formcontainer'>
                                   <Formik
                                        initialValues={userValues} 
                                        validationSchema={personalInfoValidation} 
                                        enableReinitialize validateOnMount> 
                                    {  
                                        formik => (
                                        <div className='profile--security-form'>
                                            <Form className="profile--security-formik">
                                                <div className='text-4xl font-medium m-4 pl-6'>1. Personal Information</div><hr className='mb-8'></hr>
                                                <div className="profile--security-inputcontainer">
                                                    <InputField 
                                                        field_component={fieldComponents.INPUT}
                                                        field_type={inputFieldTypes.BOXED} 
                                                        name="email" disabled={!editEmail} 
                                                        label="Email" type="email" 
                                                        icon={<MailIcon />}/>
                                                    {editEmail===false ? 
                                                        <button type="button" className='profile--security-btn bg-[#F39C12]' onClick={() => setEditEmail(!editEmail)}>Edit</button> :
                                                        <button type="button" 
                                                            className={`profile--security-btn bg-[#28B463] ${!formik.isValid ? "cursor-not-allowed" : ""}`}
                                                            disabled={!formik.isValid || isProcessing}
                                                            onClick={() => saveEditedField({field: "email", value: formik.values.email})}>
                                                                Save
                                                        </button>
                                                    }
                                                </div>
                                                <div className="profile--security-inputcontainer"> 
                                                    <InputField 
                                                        field_component={fieldComponents.INPUT}
                                                        field_type={inputFieldTypes.BOXED} 
                                                        disabled={!editName} name="name" 
                                                        label="Name"  type="text" 
                                                        icon={<PersonIcon/>}/>	
                                                    {editName===false ? 
                                                        <button type="button" className='profile--security-btn bg-[#F39C12]' onClick={() => setEditName(true)}>Edit</button> :
                                                        <button type="button" 
                                                            className={`profile--security-btn bg-[#28B463] ${!formik.isValid ? "cursor-not-allowed" : ""}`}
                                                            disabled={!formik.isValid || isProcessing}
                                                            onClick={() => saveEditedField({field: "name", value: formik.values.name})}>
                                                                Save
                                                        </button>
                                                    }	
                                                </div>
                                                <div className="profile--security-inputcontainer">
                                                    <InputField  
                                                        field_component={fieldComponents.INPUT}
                                                        field_type={inputFieldTypes.BOXED} 
                                                        disabled={!editPhone} name="phone" 
                                                        label="Phone"  type="text" 
                                                        icon={<PhoneIcon />}/>
                                                    {editPhone===false ? 
                                                        <button type="button" className='profile--security-btn bg-[#F39C12]' onClick={() => setEditPhone(true)}>Edit</button> :
                                                        <button type="button" 
                                                        className={`profile--security-btn bg-[#28B463] ${!formik.isValid ? "cursor-not-allowed" : ""}`} 
                                                            disabled={!formik.isValid || isProcessing}
                                                            onClick={() => saveEditedField({field: "phone", value: formik.values.phone})}>
                                                            Save
                                                        </button>
                                                    }
                                                </div>
                                            </Form>
                                            </div>
                                        )
                                    }
                                    </Formik>
                                </div>
                            }
                            <div className='profile--security-form'>
                              <div className='profile--security-passwdcontainer'>
                                  <div className='text-4xl font-medium m-4 pl-6'>2. Manage Passwords</div>
                                  <div className='text-xl cursor-pointer font-medium text-[#2874f0] hover:text-[#2455f4]' onClick={() => setPasswordFormOpen(!passwordFormOpen)}>{!passwordFormOpen ? "Change Password" : "Cancel"}</div>
                              </div>
                            </div>
                            {
                                      passwordFormOpen && <div className='profile--changepasswd-container'>
                                          {
                                              <Formik initialValues={initialPasswordValues}  validationSchema={passwordValidation} validateOnMount>
                                                  {
                                                      formik => (
                                                          <Form>
                                                            <InputField  
                                                                field_component={fieldComponents.INPUT}
                                                                field_type={inputFieldTypes.BOXED} 
                                                                name="passwd" 
                                                                label="Current Password" type="password" 
                                                                icon={<LockOpenIcon />}
                                                            />
                                                            <InputField  
                                                                field_component={fieldComponents.INPUT}
                                                                field_type={inputFieldTypes.BOXED} 
                                                                name="newPasswd" 
                                                                label="New Password" type="password" 
                                                                icon={<LockOpenIcon />}
                                                            />
                                                            <InputField  
                                                                field_component={fieldComponents.INPUT}
                                                                field_type={inputFieldTypes.BOXED} 
                                                                name="confirmNewPasswd" 
                                                                label="Confirm New Password" type="password" 
                                                                icon={<LockOpenIcon />}
                                                            />
                                                            <div className='profile--password-btncontainer'>
                                                                <button type="button" 
                                                                    className={`profile--password-chng-btn bg-[#28B463] ${!formik.isValid ? "cursor-not-allowed" : ""}`} 
                                                                    disabled={!formik.isValid || isProcessing}
                                                                    onClick={() => changePassword(formik.values)}>
                                                                    Change Password
                                                                </button>
                                                            </div>

                                                          </Form>
                                                      )
                                                  }
                                              </Formik>
                                          }
                                      </div>
                              }
                        </div>
                    )
                }
                {
                    navAction === ADDRESS && (
                        <div className='profile--address'>
                            <p className='text-3xl text-center m-10 font-semibold'>{!addressFormOpen && "Your Addressses"}</p>
                            { 
                            !addressFormOpen ? <div className='profile--address-list grid gap-2 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4'>
                                <div className='profile--address-add profile--address-card' onClick={() => toggleNewAddressForm(true)}>
                                    <p className='text-7xl text-slate-400 font-bold'>+</p>
                                    <p className='text-3xl text-slate-400 font-bold'>Add Address</p>
                                </div> 
                                {
                                    user.addresses.map(address => <div key={address.id}>
                                    <AddressCard props={address}/>
                                    </div>)
                                }
                               </div> : <NewAddressForm toggleNewAddressForm={toggleNewAddressForm} />

                            }
                        </div>
                    )
                }
            </div>
            <ToastContainer />
            <ProcessLoader isProcessing={isProcessing} />
        </div>
    );
}

export default Profile;