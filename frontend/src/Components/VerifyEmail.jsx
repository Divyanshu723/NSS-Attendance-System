import React, { useEffect, useState } from 'react'
import OtpInput from 'react-otp-input';
import { useNavigate } from 'react-router-dom';
import { RxCountdownTimer } from "react-icons/rx";
import { BiArrowBack } from 'react-icons/bi'
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { checkOTP, sendOtp } from '../API/api';



const VerifyEmail = ({ userEmail, setIsAuthenticated }) => {
    const [otp, setOtp] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        toast.error("Don't refresh the page...")
        if (!userEmail) {
            navigate('/login');
        }
    }, [])

    const handleOnSubmit = async (e) => {
        e.preventDefault();
        console.log("OTP", otp);

        const responce = await checkOTP(userEmail, otp)

        if (responce) {
            setIsAuthenticated(true)
            navigate('/')
        }

        
    }

    // return (

    //         <div className="min-h-[calc(100vh-3.5rem)] grid place-items-center">
    //             {
    // (
    //                         <div className="max-w-[500px] p-4 lg:p-8">
    //                             <h1 className="text-richblack-5 font-semibold text-[1.875rem] leading-[2.375rem]">Verify Email</h1>
    //                             <p className="text-[1.125rem] leading-[1.625rem] my-4 text-richblack-100">A verification code has been sent to you. Enter the code below</p>
    //                             <form >
    //                                 <OtpInput
    //                                     value={otp}
    //                                     onChange={setOtp}
    //                                     numInputs={6}
    //                                     renderSeparator={<span>-</span>}
    //                                     renderInput={(props) => (
    //                                         <input
    //                                             {...props}
    //                                             placeholder="-"
    //                                             style={{
    //                                                 boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
    //                                             }}
    //                                             className="w-[48px] lg:w-[60px] border-0 bg-richblack-800 rounded-[0.5rem] text-richblack-5 aspect-square text-center focus:border-0 focus:outline-2 focus:outline-yellow-50"

    //                                             />
    //                                     )}
    //                                     containerStyle={{
    //                                         justifyContent: "space-between",
    //                                         gap: "0 6px",
    //                                     }}
    //                                 />
    //                                 <button
    //                                     type='submit'
    //                                     className="w-full bg-yellow-50 py-[12px] px-[12px] rounded-[8px] mt-6 font-medium text-richblack-900"
    //                                 >
    //                                     Verify Email
    //                                 </button>
    //                             </form>

    //                                 <div className="mt-6 flex items-center justify-between">
    //                                     <Link to="/signup" >
    //                                         <p className="text-richblack-5 flex items-center gap-x-2">
    //                                             <BiArrowBack /> Back To Signup
    //                                         </p>
    //                                     </Link>

    //                                 <button
    //                                     className="flex items-center text-blue-100 gap-x-2"
    //                                     // onClick={() => dispatch(sendOtp(signupData.email, navigate))}
    //                                 >
    //                                     <RxCountdownTimer />
    //                                     Resend it
    //                                 </button>
    //                             </div>
    //                         </div>
    //                 )
    //             }
    //         </div>
    // )

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