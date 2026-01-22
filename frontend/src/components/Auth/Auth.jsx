/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { useLogin } from '../../hooks/useLogin'
import { useSignup } from '../../hooks/useSignup'

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('')
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState([]);
  const [signinBtn, setSigninBtn] = useState('Sign in')
  const [signupBtn, setSignupBtn] = useState('Sign up')
  const { login, loginError, isLoading } = useLogin();
  const { signup, signupError, signupIsLoading } = useSignup();
  const [success, setSuccess] = useState(null)
  const [isOtpSent, setIsOtpSent] = useState(false)

  useEffect(() => {
    if (loginError) {
      setErrors(prevErrors => [...prevErrors.slice(-3), loginError]);
      setTimeout(() => {
        setErrors(prevErrors => prevErrors.slice(1));
      }, 3000);
    }
  }, [loginError]);

  useEffect(() => {
    if (signupError) {
      setErrors(prevErrors => [...prevErrors.slice(-3), signupError]);
      setTimeout(() => {
        setErrors(prevErrors => prevErrors.slice(1));
      }, 3000);
    }
  }, [signupError]);

  const handleSwap = () => {
    setIsSignUp(!isSignUp);
    setName('');
    setEmail('');
    setPassword('');
    setOtp('');
    setShowPassword(false);
    setErrors([]);
    setIsOtpSent(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setSigninBtn('Signing in');
    await login(email.toLowerCase(), password);
    setSigninBtn('Sign In');
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (!isOtpSent) {
      setErrors(['Please send OTP first']);
      return;
    }
    
    setSignupBtn('Signing up');
    await signup(name, email.toLowerCase(), password, otp);
    setSignupBtn('Sign Up');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const hanleGenOtp = async (event) => {
    event.preventDefault();

    if (!email) {
      setErrors(['Please enter email first']);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/otp/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.toLowerCase() })
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrors(prevErrors => [...prevErrors.slice(-3), errorData.error || 'Failed to send OTP']);
        setTimeout(() => {
          setErrors(prevErrors => prevErrors.slice(1));
        }, 3000);
      } else {
        setSuccess('OTP sent successfully! Check your email.');
        setIsOtpSent(true);
        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      }
    } catch (error) {
      setErrors(prevErrors => [...prevErrors.slice(-3), 'Network error. Please try again.']);
      setTimeout(() => {
        setErrors(prevErrors => prevErrors.slice(1));
      }, 3000);
    }
  }

  return (
    <div className="container-fluid bg-light min-vh-100 d-flex justify-content-center align-items-center py-5">
      <div className="row w-100 justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
            <div className="card-body p-4 p-md-5">

              {/* SIGN UP FORM */}
              {isSignUp && (
                <form onSubmit={handleSignup}>
                  <h2 className="text-center mb-4 fw-bold">Create Account</h2>

                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                    className="form-control mb-3"
                    required
                  />

                  <div className="input-group mb-3">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email"
                      className="form-control"
                      required
                    />
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={hanleGenOtp}
                      disabled={isOtpSent}
                    >
                      {isOtpSent ? 'Sent' : 'Send OTP'}
                    </button>
                  </div>

                  <div className="input-group mb-3">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      className="form-control"
                      required
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? (
                        <i className="fa fa-eye-slash"></i>
                      ) : (
                        <i className="fa fa-eye"></i>
                      )}
                    </button>
                  </div>

                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                    className="form-control mb-3"
                    required
                    disabled={!isOtpSent}
                  />

                  <button
                    type="submit"
                    className="btn btn-success w-100 py-2 mt-2"
                    disabled={signupIsLoading || !isOtpSent}
                  >
                    {signupBtn}
                  </button>

                  <p className="text-center mt-3">
                    Already have an account?{" "}
                    <span className="text-primary fw-bold" style={{ cursor: "pointer" }}
                      onClick={handleSwap}>
                      Sign In
                    </span>
                  </p>
                </form>
              )}

              {/* SIGN IN FORM */}
              {!isSignUp && (
                <form onSubmit={handleLogin}>
                  <h2 className="text-center mb-4 fw-bold">Sign In</h2>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="form-control mb-3"
                    required
                  />

                  <div className="input-group mb-3">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      className="form-control"
                      required
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? (
                        <i className="fa fa-eye-slash"></i>
                      ) : (
                        <i className="fa fa-eye"></i>
                      )}
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-2"
                    disabled={isLoading}
                  >
                    {signinBtn}
                  </button>

                  <p className="text-center mt-3">
                    Don't have an account?{" "}
                    <span className="text-success fw-bold" style={{ cursor: "pointer" }}
                      onClick={handleSwap}>
                      Sign Up
                    </span>
                  </p>
                </form>
              )}
            </div>
          </div>

          {/* ERRORS / SUCCESS */}
          <div className="mt-4">
            {errors.map((error, index) => (
              <div key={index} className="alert alert-danger py-2">
                {error}
              </div>
            ))}

            {success && (
              <div className="alert alert-success py-2">{success}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;