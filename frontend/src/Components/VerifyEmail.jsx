import React, { useEffect, useState } from 'react'
import OtpInput from 'react-otp-input';
import { useNavigate, useParams } from 'react-router-dom';
import { RxCountdownTimer } from "react-icons/rx";
import { BiArrowBack } from 'react-icons/bi'
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { checkOTP, sendOtp } from '../API/api';



const VerifyEmail = ({ userEmail, setIsAuthenticated }) => {
    const [otp, setOtp] = useState("");
    const navigate = useNavigate();
    const {isAdmin} = useParams();
    console.log("ADMIN IS: ", isAdmin);

    useEffect(() => {
        toast.error("Don't refresh the page...")
        if (!userEmail) {
            navigate('/login');
        }
    }, [])

    const handleOnSubmit = async (e) => {
        e.preventDefault();
        console.log("OTP", otp);

        const responce = await checkOTP(userEmail, otp, isAdmin)

        if (responce) {
            setIsAuthenticated(true)
            isAdmin ? navigate('/') : navigate('/dashboard');
        }

        
    }

    return (

        <Container className="custom-height d-flex justify-content-center align-items-center">
            <Row className="justify-content-center w-75">
                <Col lg={6}>
                    <h1 className="text-richblack-5 font-semibold text-[1.875rem] leading-[2.375rem]">Verify Email to Login</h1>
                    <p className="text-[1.125rem] leading-[1.625rem] my-2 text-richblack-100">
                        A verification code has been sent to
                        <span style={{ fontWeight: 'bold' }}>{` ${userEmail} `}</span>
                        Enter the code below
                    </p>
                    <Form onSubmit={handleOnSubmit}>
                        <Form.Group controlId="formOtp">
                            <OtpInput
                                value={otp}
                                onChange={setOtp}
                                numInputs={6}
                                separator={<span>-</span>}
                                containerStyle={{ justifyContent: 'space-between', gap: '0 6px' }}
                                renderInput={(props) => (
                                    <input
                                        {...props}
                                        placeholder="-"
                                        style={{
                                            width: '48px',
                                            height: '48px',
                                            borderColor: '#333',
                                            color: '#333',
                                            borderRadius: '0.5rem',
                                            textAlign: 'center',
                                        }}


                                    />
                                )}
                            />
                        </Form.Group>
                        <Button type="submit" variant="secondary" className="w-100 mt-4">
                            Verify Email
                        </Button>
                    </Form>
                    <div className="mt-10 d-flex justify-content-between align-items-center">
                        <Button variant='link' className="text-decoration-none d-flex align-items-center gap-x-2 mb-0"
                            style={{ color: '#333' }}
                            onClick={() => navigate('/login')}
                        >
                            <BiArrowBack /> Back To Signup
                        </Button>
                        <Button variant="link" className="text-decoration-none text-blue-100 d-flex align-items-center " style={{ gap: "2px" }} onClick={() => {
                            sendOtp(userEmail, navigate)
                        }}>
                            <RxCountdownTimer />
                            Resend it
                        </Button>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default VerifyEmail