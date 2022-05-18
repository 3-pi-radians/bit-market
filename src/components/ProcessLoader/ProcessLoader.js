import { CircularProgress } from '@mui/material';
import React from 'react';
import './ProcessLoader.css';

const ProcessLoader = ({isProcessing}) => {
    return (
        <div className={ isProcessing ? 'processloader--bg-disable' : 'hidden'} width="100%">
            <div className='processloader--overlay'>
                <CircularProgress color="secondary" />
            </div>
        </div>

    );
}

export default ProcessLoader;