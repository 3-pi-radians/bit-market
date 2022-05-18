import React from 'react';
import { Breadcrumbs, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <div className='navbar'>
            <Breadcrumbs separator=">" aria-label="breadcrumb">
                <Link to={"/"} underline="hover" color="inherit">
                    MUI
                </Link>
                <Link to={"/profile"}
                    underline="hover"
                    color="inherit"
                 >
                    Core
                </Link>
                <Typography color="text.primary">Breadcrumbs</Typography>
            </Breadcrumbs>
        </div>
    );
}

export default Navbar;