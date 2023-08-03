import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form';

import useAuth from "utils/auth";

import Card from '@mui/material/Card';
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { TextFieldElement } from 'components/TextFieldElement';
import Cookies from 'js-cookie';


const defaultValues = {
    username: '',
    password: '',
  }

export default function Login() {
    let navigate = useNavigate();
    const auth = useAuth();
    const { handleSubmit, control } = useForm({ defaultValues });

    const onSubmitLogin = (data) => {
        auth.login(data).then((response) => {
            if (response == 200) {
                navigate('/');
            }
        });
    }

    return (
        <Box px={1} width="100%" height="100vh" mx="auto">
            <Grid container spacing={1} justifyContent="center" alignItems="center" height="100%">
                <Grid item xs={11} sm={9} md={5} lg={4} xl={3}>
                    <Card>
                        <Box p={3}>
                            <Typography variant="h4" fontWeight="medium" pb={3}>
                                Sign in
                            </Typography>
                            <form onSubmit={handleSubmit(onSubmitLogin)} noValidate>
                                <Box mb={2}>
                                    <TextFieldElement
                                        label="Username"
                                        name="username"
                                        control={control}
                                        required
                                        size={"small"}
                                        fullWidth
                                    />
                                </Box>
                                <Box mb={2}>
                                    <TextFieldElement
                                        type="password"
                                        label="Passowrd"
                                        name="password"
                                        control={control}
                                        required
                                        size={"small"}
                                        fullWidth
                                    />
                                </Box>
                                <Box mt={3} mb={1}>
                                    <Button variant="gradient" type="submit" color="info" fullWidth>
                                        sign in
                                    </Button>
                                </Box>
                            </form>
                        </Box>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    )
}