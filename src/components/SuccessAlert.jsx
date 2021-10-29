import { React, useState } from 'react';

import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';


export default function SuccessAlert (props) {
  const {isOpen, setIsOpen, message, severity} = props

  return (
    <Collapse in={isOpen}>
      <Alert
        severity={severity}
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={() => {
              setIsOpen(false);
            }}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
        sx={{ mb: 2 }}
      >
        { message }
      </Alert>
    </Collapse>
  );
}
