import { useState, useEffect } from "react";
import { Auth, Hub } from "aws-amplify";
import Alert from "../components/Alert";
// import { useHistory } from "react-router-dom";

export default function OtpComponent(props) {
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const [alert, setAlert] = useState({
    status: "error",
    message: "",
  });
  const [auth, setAuth] = useState(false)
  const [accountCreated, setAccountCreated] = useState(false);
  const [dots, setDots] = useState(1);

  useEffect(() => {
    Hub.listen('auth', ({ payload }) => {
      console.log("AutoSigned IN")
      const { event } = payload;
      if (event === 'autoSignIn') {
        const user = payload.data;
        // assign user
      } else if (event === 'autoSignIn_failure') {
        // redirect to sign in page
      }
    })
  }, [auth])

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) => (prevDots % 3) + 1);
    }, 500);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (alert.message !== "") {
      const timeout = setTimeout(() => {
        console.log("I am handling alert");
        setAlert({ status: "", message: "" });
      }, 3000);
      console.log("I am effect");
      return () => clearTimeout(timeout); // Clear the timeout if the component unmounts or alert changes
    }
  }, [alert]);

  const handleInputChange = (index, value) => {
    const newOtpValues = [...otpValues];
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);

    if (value && index < otpValues.length - 1) {
      const nextInput = document.getElementById(`input-${index + 1}`);
      nextInput.focus();
    }
  };

  const handleBackspace = (index, event) => {
    if (event.key === "Backspace" && !otpValues[index]) {
      const previousInput = document.getElementById(`input-${index - 1}`);
      if (previousInput) {
        previousInput.focus();
      }
    }
  };

  //   const history = useHistory();

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleOtpSubmit = async (e) => {
    var code = "";

    for (let i = 0; i < otpValues.length; i++) {
      code += otpValues[i];
    }

    // if (otp === "123456") {
    //   // Valid OTP, redirect to the login page
    //   history.push("/login");
    // } else {
    //   // Invalid OTP, trigger alert
    //   setAlert("Invalid OTP");
    // }
    e.preventDefault();
    try {
      await Auth.confirmSignUp(props.username, code).then(() => {
        console.log("done");
        setAccountCreated(true);
        setAuth(true);
      });
    } catch (error) {
      console.log("error confirming sign up", error);
      setAlert({
        status: "error",
        message: `${error.message}`
      })
    }
  };

  async function handleResendOTP() {
    try {
      await Auth.resendSignUp(props.username);
      console.log("code resent successfully");
    } catch (err) {
      console.log("error resending code: ", err);
      setAlert({
        status: "error",
        message: `${err.message}`
      })
    }
  }

  const handleEditEmail = () => {
    // Logic to edit email address
    console.log("Edit email");
  };

  return (
    <div
      className="relative z-10"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-gray-50/90  py-12">
          {!accountCreated ? (
            <div className="relative bg-white px-6 pt-10 pb-9 shadow-xl mx-auto max-w-xs  rounded-2xl">
              <div className="mx-auto flex w-full max-w-xs flex-col space-y-16">
                <>
                  <div className="flex flex-col items-center justify-center text-center space-y-2">
                    <div className="font-semibold text-3xl">
                      <p>Email Verification</p>
                    </div>
                    <div className="flex flex-row text-sm font-medium text-gray-400">
                      <p>We have sent a code to your email {props.email}</p>
                    </div>
                  </div>
                  <div>
                    <form action="" method="post">
                      <div className="flex flex-col space-y-16">
                        <div className="flex flex-row gap-2 items-center justify-between mx-auto w-full max-w-[250pxf]">
                          {otpValues.map((value, index) => (
                            <div className="w-10 h-16" key={index}>
                              <input
                                id={`input-${index}`}
                                className="w-full h-full flex flex-col items-center justify-center text-center px-2 outline-none border-b-2 border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
                                type="text"
                                name=""
                                maxLength="1"
                                value={value}
                                onChange={(e) =>
                                  handleInputChange(index, e.target.value)
                                }
                                onKeyDown={(e) => handleBackspace(index, e)}
                              />
                            </div>
                          ))}
                        </div>

                        <div className="flex flex-col space-y-5">
                          <div>
                            <button
                              className="flex flex-row items-center justify-center text-center w-full border rounded-xl outline-none py-5 bg-banana-yellow border-none text-white text-sm shadow-sm"
                              onClick={handleOtpSubmit}
                            >
                              Verify Account
                            </button>
                          </div>

                          <div className="flex flex-row items-center justify-center text-center text-sm font-medium space-x-1 text-gray-500">
                            <p>Didn't recieve code?</p>{" "}
                            <button
                              className="flex flex-row items-center text-banana-yellow"
                              href="http://"
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={handleResendOTP}
                            >
                              Resend
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </>
              </div>
            </div>
          ) : (
            <div className="mx-5 py-12 rounded-md bg-white shadow-xl">
              <p>You're Successfully Verified</p>
              <p className="mt-5 w-24 mx-auto block">
                Redirecting{Array(dots).fill(".").join("")}
              </p>
            </div>
          )}
        </div>
      </div>
      {alert.message !== "" && (
        <Alert
          className="mx-auto mb-20 w-4/5 fixed left-0 right-0 bottom-0 z-10"
          status={alert.status}
          message={alert.message}
        />
      )}
      <Alert status="error" message="Invalid code" />
    </div>
  );
}
