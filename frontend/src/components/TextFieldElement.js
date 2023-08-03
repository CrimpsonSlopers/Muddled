import React, { useState } from "react";
import TextField from '@mui/material/TextField';
import { Controller } from 'react-hook-form';


export function TextFieldElement({
  validation = {},
  parseError,
  type,
  name,
  control,
  required,
  ...rest
}) {

  if (required && !validation.required) {
    validation.required = 'This field is required'
  }

  if (type === 'email' && !validation.pattern) {
    validation.pattern = {
      value: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      message: 'Please enter a valid email address'
    }
  }

  return ( 
    <Controller
      render={({
        field: { onChange, onBlur, value, ref },
        fieldState: { error }
      }) => (
        <TextField
          {...rest}
          name={name}
          value={value || ""}
          onChange={onChange}
          onBlur={onBlur}
          required={required}
          fullWidth
          error={!!error}
          type={type}
          helperText={error ? (typeof parseError === 'function' ? parseError(error) : error.message) : rest.helperText}
        />
      )}
      name={name}
      control={control}
      rules={validation}
    />
  );
}