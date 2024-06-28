import toast from "react-hot-toast";
import { backend_url } from "../Components/services";

export const checkAuth = async () => {
  try {
    const token = localStorage.getItem('nss-token');

    const response = await fetch(`${backend_url}/checkAuth`, {
      method: 'GET',
      // Include cookies for authentication
      // credentials: 'include', 
      headers: {
        // Include the token in the 'Authorization' header
        Authorization: `Bearer ${token}`
      }
    });

    if (response.ok) {
      const data = await response.json();

      // console.log(data.adminType);

      const list = [data.success, data.adminType, data.adminId];
      console.log("LIST: ", list);
      return list;
    }

    throw new Error('Authentication check failed');
  }
  catch (error) {
    console.error('Authentication check error:', error);
    return false;
  }
};

export async function sendOtp(email, navigate, isAdmin) {
  const toastId = toast.loading("Loading...");
  console.log("OTP Frontedn");
  try {
    const response = await fetch(`${backend_url}/sendotp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, isAdmin }),
    });

    if (!response.ok) {
      throw new Error("Failed to send OTP. Please try again later.");
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message);
    }

    console.log("OTP DATA", data);
    toast.success("OTP Sent Successfully");
    // TODO :: YHA TAK HUA HAI AAJ KL YHI SE RESUME KRENGE (isAdmin ko pass krna hai verify-email page pe... so stay tuned.....)
    navigate(`/verify-email/${isAdmin}`);
  } catch (error) {
    console.error("Error sending OTP:", error);
    toast.error("Failed to send OTP. Please try again later.");
  } finally {
    toast.dismiss(toastId);
  }
}

export async function checkOTP(email, otp, isAdmin) {
  const toastId = toast.loading("Loading...");
  try {
    const response = await fetch(`${backend_url}/checkOTP`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp, isAdmin }),
    });

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message);
    }


    toast.success("OTP matched Successfully...");
    localStorage.setItem("nss-token", data.token);
    return true;
  } catch (error) {
    console.error("Error checking OTP:", error);
    toast.error(error.message);
    return false;
  } finally {
    toast.dismiss(toastId);
  }
}
