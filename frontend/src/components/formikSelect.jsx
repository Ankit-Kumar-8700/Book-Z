import React from 'react';
import { useField } from 'formik';
import { TextField, MenuItem } from '@mui/material';

const FormikSelect = ({ label, options, disabled, ...props }) => {
    const [field, meta] = useField(props);

    return (
        <TextField
            select
            label={label}
            {...field}
            {...props}
            disabled={disabled}
            error={meta.touched && Boolean(meta.error)}
            helperText={meta.touched && meta.error}
        >
            {options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                    {option.label}
                </MenuItem>
            ))}
        </TextField>
    );
};

export default FormikSelect;
