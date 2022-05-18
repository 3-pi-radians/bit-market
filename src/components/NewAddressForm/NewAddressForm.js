import React, { useEffect, useState } from 'react';
import { Formik, Form } from "formik";
import { v4 as uuidv4 } from 'uuid';
import * as Yup from 'yup';
import {useSelector, useDispatch } from 'react-redux';

import { inputFieldTypes, fieldComponents } from '../../utils/input-types';
import { getCountryList, getStateList } from '../../apis/stateCityApi';
import { addUserAddress, updateUserAddress } from '../../redux/actions/user-actions';
import InputField from '../../components/InputField/InputField';
import axios from '../../apis/backendApi';

import "./NewAddressForm.css";
import ProcessLoader from '../ProcessLoader/ProcessLoader';
import { toast, ToastContainer } from 'react-toastify';

const NewAddressForm = ({toggleNewAddressForm, initialAddressValue=null}) => {
    const [countryList, setCountryList] = useState([]);
    const [stateList, setStateList] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const phoneRegExp = /^[6-9]{1}\d{9}$/
    const pinRegExp = /^[1-9]{1}\d{5}$/
    const { user } = useSelector(state => state.user);
    const dispatch = useDispatch();

    useEffect(() => {
      const getCountryOptions = async () => {
        let country = await getCountryList();
        setCountryList(country?.map(item => ({key: item, value: item})));
      }

      getCountryOptions();
    }, []);

    useEffect(() => {
        const getStateOptions =  () => {
            let states = getStateList(selectedCountry);
            setStateList(states?.map(item => ({key: item, value: item})));
        }
        
        getStateOptions();
    }, [selectedCountry]);
    
    const addressValidation = Yup.object({
        fullName: Yup.string()
                .required("Required")
                .max(50, "Max limit is 50 characters"),
        city: Yup.string().max(50).required("Required"),
        mobileNumber: Yup.string().matches(phoneRegExp, "Enter a valid Phone number")
                    .required("Required"),
        pinCode: Yup.string().matches(pinRegExp, "Enter a valid Pin Code")
                .required("Required"),
        house: Yup.string()
                .required("Required")
                .max(50, "Max limit is 50 characters"),
        area: Yup.string()
                .required("Required")
                .max(50, "Max limit is 50 characters"),
        state: Yup.string()
                .required("Required")
                .max(30, "Max limit is 30 characters")
    });

    const saveNewAddress = async (values) => {
        try {
            setIsProcessing(true);
            const address = {
                fullName: values.fullName,
                mobileNumber: values.mobileNumber,
                pinCode: values.pinCode,
                house: values.house,
                area: values.area,
                city: values.city,
                state: values.state,
                country: values.country,
                id: initialAddressValue?.id || uuidv4()
            } 
            const URL = initialAddressValue ? "/user/edit-user-address" : "/user/save-user-address";
            let response = await axios({
                method: "post",
                url: URL,
                data: {
                    id: user.id,
                    address: address
                }
            });

            if (response.data.status === "error") {
                alert(response.data.message);
                setIsProcessing(false);
            } else {
                setIsProcessing(false);
                initialAddressValue ? dispatch(updateUserAddress(address)) : dispatch(addUserAddress(address));
                toggleNewAddressForm(false);
            }
        } catch (error) {
            console.log(error);
            setIsProcessing(false);
            toast.error(error.message);
        }
    }

    return (
        <div className='newaddressform'>
            <div className='newaddressform--addresses-form'>
            <Formik  initialValues={initialAddressValue || {
                fullName: "",
                mobileNumber: "",
                pinCode: "",
                house: "",
                area: "",
                city: "",
                state: "",
                country: ""
            }} validationSchema={addressValidation} validateOnMount> 
            {
                formik => (
                <div className=''>
                    <h3 className='text-center text-3xl font-semibold mb-4'>Fill your address details</h3>
                    <Form>
                        <div className='newaddressform--adderss-forminput'>
                            <InputField 
                                field_component={fieldComponents.INPUT} disabled={false} field_type={inputFieldTypes.BOXED} 
                                label="Name" name="fullName" placeholder="Full Name" type="text" />
                        </div>
                        <div className='newaddressform--adderss-forminput'>
                            <InputField 
                                field_component={fieldComponents.INPUT} field_type={inputFieldTypes.BOXED} disabled={false} 
                                label="Mobile number" name="mobileNumber" placeholder="Your Phone Number" type="text" />	
                        </div>
                            <div className='newaddressform--adderss-forminput'>
                            <InputField 
                                field_component={fieldComponents.INPUT} field_type={inputFieldTypes.BOXED} disabled={false}
                                label="Pin Code" name="pinCode" placeholder="6 digit Pin Code" type="text" />
                        </div>
                        <div className='newaddressform--adderss-forminput'>
                            <InputField 
                                field_component={fieldComponents.INPUT} field_type={inputFieldTypes.BOXED} disabled={false}
                                label="Flat, House no., Building," name="house" placeholder="eg. House no-12" type="text"/>	
                        </div>
                        <div className='newaddressform--adderss-forminput'>
                            <InputField 
                                field_type={inputFieldTypes.BOXED} field_component={fieldComponents.INPUT}disabled={false}
                                label="Area, Locality" name="area" placeholder="" type="text" />	
                        </div>
                        <div className='newaddressform--adderss-forminput'>
                            <InputField 
                                field_type={inputFieldTypes.BOXED} field_component={fieldComponents.INPUT} disabled={false}
                                label="City" name="city" placeholder="" type="text"/>
                        </div>
                        <div className='newaddressform--adderss-forminput'>
                            <InputField 
                                field_type={inputFieldTypes.BOXED} field_component={fieldComponents.SELECT} 
                                options={countryList} disabled={false}
                                label="Country" name="country" placeholder="" type="text"/>
                                {formik.values.country !== selectedCountry ? setSelectedCountry(formik.values.country) : null}                                               
                        </div> 
                        <div className='newaddressform--adderss-forminput'>
                            <InputField 
                                field_type={inputFieldTypes.BOXED} field_component={fieldComponents.SELECT} 
                                options={stateList}  disabled={false} 
                                label="State" name="state" placeholder="" type="text"/>	
                        </div>
                        <div className='newaddressform--address-btncontainer flex justify-around'>
                        <button type="button" className={`newaddressform--address-btn bg-[#1E8449] ${!formik.isValid && "cursor-not-allowed"}`} disabled={!formik.isValid || isProcessing} onClick={() => saveNewAddress(formik.values)}>Save</button>
                        <button type="button" className='newaddressform--address-btn bg-[#F39C12]' onClick={() => toggleNewAddressForm(false)}>Cancel</button>
                        </div>      
                    </Form>
                    </div>
                )
            }
            </Formik>
            </div>
            <ToastContainer />
            <ProcessLoader isProcessing={isProcessing} />
        </div>
    );
}

export default NewAddressForm;