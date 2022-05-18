import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Modal, Box, Typography } from '@mui/material';
import { removeUserAddress } from '../../redux/actions/user-actions';
import NewAddressForm from '../NewAddressForm/NewAddressForm';
import axios from '../../apis/backendApi';
import "./AddressCard.css";

const AddressCard = ({props}) => {
    const { user } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const [openNewAddressForm, setOpenNewAddressForm] = useState(false);
    const [openModal, setOpenModal] = useState(false);

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: "88%",
        height: "80%",
        bgcolor: '#fff',
        boxShadow: 24,
        p: 4,
        outline: "none",
        borderRadius: 3,
        overflow:'scroll',
      };
        
    const toggleNewAddressForm = (value) => {
        setOpenNewAddressForm(value);
        setOpenModal(value);
    }
    const enableAddressForm = () => {
        setOpenNewAddressForm(true);
        setOpenModal(true);
    }
    const removeAddress = async () => {
        try {
            let response = await axios({
                method: "post",
                url: "/user/remove-user-address",
                data: {
                    userId: user.id,
                    addressId: props.id
                }
            });
            if (response.data.status === "ok") {
                 dispatch(removeUserAddress(props.id));
            } else if (response.data.status ===  "error") {
                alert(response.data.message);
            }
        } catch(error) {
            console.log(error);
        }
    }

    return (
        <div className="addresscard">
            {
                openNewAddressForm ?
                <div className='addresscard-newform-modal'>
                    <Modal
                        open={openModal}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style}>
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                <p className='text-4xl tex-center text-[#3498DB] font-semibold'>Edit Address Details</p>
                            </Typography>
                            <NewAddressForm toggleNewAddressForm={toggleNewAddressForm} initialAddressValue={props}/>
                        </Box>
                    </Modal>
                </div>
                  :
                <div className="addresscard-details">
                    <div className='text-2xl font-semibold'>{props.fullName}</div>
                        <div className='text-xl font-medium'>{props.house}</div>
                        <div className='text-xl font-medium'>{props.area}</div>
                        <div className='text-xl font-medium'>{props.city}, {props.state}, {props.pinCode}</div>
                        <div className='text-xl font-medium'>{props.country}</div>
                        <div className='text-xl font-medium'>Mobile: {props.mobileNumber}</div>
                        <div className='addresscard--bottom mt-4 flex'>
                        <div
                           className='text-xl font-semibold hover:underline cursor-pointer text-[#007185] hover:text-[#EC7063] w-10'
                            onClick={enableAddressForm}>
                            Edit
                        </div>
                        &nbsp;&nbsp;&nbsp;
                        <div 
                        className='text-xl font-semibold hover:underline cursor-pointer text-[#007185] hover:text-[#EC7063] w-10'
                        onClick={removeAddress}>
                            Remove
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}

export default AddressCard;