import React, { useEffect, useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import moment from "moment-timezone";
import { backend_url } from "../services";
import toast from 'react-hot-toast';

const NewEventForm = () => {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedAdmin, setSelectedAdmin] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [formError, setFormError] = useState("");
  const [admins2, setAdmins2] = useState([]);

  useEffect(() => {
    const fetchAdmins = async () => {
      const response = await fetch(`${backend_url}/showAdmins`);
      const responseData = await response.json();
      const admin2 = responseData.filter((admin) => admin.adminType === "Admin2");
      setAdmins2(admin2);
    };
    fetchAdmins();
  }, []);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const handleAdminChange = (e) => {
    console.log("Admin ", e.target.value);
    setSelectedAdmin(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !startDate || !endDate || !selectedAdmin) {
      setFormError("Please fill all fields.");
      return;
    }

    const indiaTimeZone = "Asia/Kolkata";
    const format = "YYYY-MM-DDTHH:mm";
    const convertedStartDate = moment
      .tz(startDate, format, indiaTimeZone)
      .format();
    const convertedEndDate = moment.tz(endDate, format, indiaTimeZone).format();

    const today = moment().tz(format, indiaTimeZone).format();

    if (convertedStartDate < today) {
      toast.error("Start date must be after current date");
      setStartDate("");
      setEndDate("");
      return;
    }

    if (!(convertedStartDate < convertedEndDate)) {
      toast.error("Start date must be before end date");
      setStartDate("");
      setEndDate("");
      return;
    }
    console.log(
      "date time : " + convertedStartDate + " to " + convertedEndDate
    );

    try {
      const response = await fetch(`${backend_url}/addEvent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          startDate: convertedStartDate,
          endDate: convertedEndDate,
          admin2Id: selectedAdmin,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  if (isLoggedIn) {
    window.location.href = "/";
  }

  return (
    <Container>
      <Row className="justify-content-center">
        <Col xs={12} md={6}>
          <h2 className="text-center">New Event Form</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={handleNameChange}
              />
            </Form.Group>

            <Form.Group controlId="formBasicStartDate">
              <Form.Label>Start Date and Time</Form.Label>
              <Form.Control
                type="datetime-local"
                value={startDate}
                onChange={handleStartDateChange}
              />
            </Form.Group>

            <Form.Group controlId="formBasicEndDate">
              <Form.Label>End Date and Time</Form.Label>
              <Form.Control
                type="datetime-local"
                value={endDate}
                onChange={handleEndDateChange}
              />
            </Form.Group>

            <Form.Group controlId="formBasicAdmin">
              <Form.Label>Assigned to:</Form.Label>
              <Form.Select value={selectedAdmin} onChange={handleAdminChange}>
                <option value="">Select Name</option>
                {admins2.map((admin) => (
                  <option key={admin._id} value={admin._id}>
                    {admin.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {formError && <p className="text-danger">{formError}</p>}

            <Button variant="primary" type="submit" style={{ marginTop: '20px' }} >
              Create Event
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default NewEventForm;
