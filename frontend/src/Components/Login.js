import React, { useEffect, useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { backend_url } from "./services";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { sendOtp } from '../API/api';
// import BgImage from '../assets/academic.jpg'

// var sectionStyle = {
//   backgroundImage: `url(${BgImage})`,
//   height: '100vh',
//   width:'100vw'
// }

function Login({ setIsPartialAuthenticated, setUserEmail, isAdmin, setIsAdmin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleRoleChange = (e) => {
    setIsAdmin(e.target.value === "admin");
  };

  useEffect(() => {
    console.log("Loading->>>>>>>>>>>", loading);
  },[loading])

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)

    try {
      // First check if any user already logged in or not
      const token = localStorage.getItem("nss-token");
      console.log("Token: ", token);
      if (token !== null) {
        console.log("Not Empty", token, typeof token);
        alert("First Logout current User then try to login");
        return;
      }

      const response = await fetch(`${backend_url}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, isAdmin }),
      });
      const data = await response.json();
      console.log(data);
      if (data.success) {
        console.log("1st part of Login successful")
        setUserEmail(email);
        setIsPartialAuthenticated(true);
        sendOtp(email, navigate, isAdmin);
      } else {
        toast.error(data.message);
      }
      setLoading(false)
    } catch (error) {
      toast.error("Error while logging in...");
      console.error("Error:", error);
    }
  };

  const divStyle = {
    padding: "2rem",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    borderRadius: "10px",
    backgroundColor: "#fff",
    marginTop: "2rem"
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col xs={12} md={6}>
          <div style={divStyle}>
            <h2 className="text-center">Login</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={handleEmailChange}
                  style={{ width: "100%" }}
                />
              </Form.Group>

              <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={handlePasswordChange}
                  style={{ width: "100%" }}
                />
              </Form.Group>

              <Form.Group controlId="formBasicRole">
                <Form.Label>Role</Form.Label>
                <div>
                  <Form.Check
                    inline
                    label="Student"
                    type="radio"
                    name="role"
                    value="student"
                    checked={!isAdmin}
                    onChange={handleRoleChange}
                  />
                  <Form.Check
                    inline
                    label="Admin"
                    type="radio"
                    name="role"
                    value="admin"
                    checked={isAdmin}
                    onChange={handleRoleChange}
                  />
                </div>
              </Form.Group>

              <Button variant="primary" type="submit" disabled={loading} block>
                Submit
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
