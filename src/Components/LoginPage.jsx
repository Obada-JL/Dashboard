import { useState } from "react";
import Logo from "../assets/homelogo.png";
// import "../../styles/login.css";
// import "../../styles/login_responsive.css";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleLogin = (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setLoading(true); // Show loading state

    fetch("http://localhost:5000/api/users/signIn", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => {
        if (!res.ok) {
          // Handle HTTP errors
          throw new Error("Invalid email or password");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Login successful:", data);

        // Save token to localStorage
        localStorage.setItem("token", data.data.token);

        // Redirect to Dashboard
        window.location.href = "/";
      })
      .catch((err) => {
        console.error("Login error:", err);
        setError(err.message || "Failed to login");
      })
      .finally(() => {
        setLoading(false); // Hide loading state
      });
  };
  return (
    <div class="super_container">
      <link rel="stylesheet" href="/styles/login.css"></link>
      <link rel="stylesheet" href="/styles/login_responsive.css"></link>
      <div class="page_gradient grad_dark">
        <div class="container">
          <div class="row">
            <div class="col">
              <div class="outer_container d-flex flex-column align-items-center justify-content-center">
                <div class="content_container d-flex flex-column align-items-center justify-content-center">
                  <div class="content_container_inner d-flex flex-column align-items-center justify-content-center">
                    {/* <!-- Logo --> */}
                    <div class="logo_container">
                      <a href="index.html">
                        <div class="d-flex flex-row align-items-center justify-content-start">
                          <div class="logo">
                            <img
                              src={Logo}
                              width={100}
                              alt="Coursette Logo png w36px h36px"
                            />
                          </div>
                        </div>
                      </a>
                    </div>
                    {/* <div class="page_options d-flex flex-row align-items-center">
                      <div class="button_fill login_button trans_200">
                        <a href="#.html">
                          <div class="d-flex flex-row align-items-center">
                            <span>Log in</span>
                          </div>
                        </a>
                      </div>
                      <div class="button_outline signup_button trans_200">
                        <a href="#.html">
                          <div class="d-flex flex-row align-items-center">
                            <span>Sign up</span>
                          </div>
                        </a>
                      </div>
                    </div> */}
                    <div class="page_title">
                      <h1>Welcome back!</h1>
                    </div>
                    <p class="page_subtitle">Please enter your details</p>
                    <form
                      onSubmit={handleLogin}
                      id="login_form"
                      class="login_form"
                    >
                      {error && (
                        <div
                          class="alert alert-danger d-flex align-items-center gap-3"
                          role="alert"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            class="bi bi-exclamation-triangle"
                            viewBox="0 0 16 16"
                          >
                            <path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.15.15 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.2.2 0 0 1-.054.06.1.1 0 0 1-.066.017H1.146a.1.1 0 0 1-.066-.017.2.2 0 0 1-.054-.06.18.18 0 0 1 .002-.183L7.884 2.073a.15.15 0 0 1 .054-.057m1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767z" />
                            <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z" />
                          </svg>
                          <div>{error}</div>
                        </div>
                      )}
                      <div>
                        <input
                          type="text"
                          class="login_input"
                          id="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Email or username"
                        />
                      </div>
                      <div>
                        <button class="show_password_button" type="button">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 -960 960 960"
                            class="trans_200"
                          >
                            <path d="M480.09-336.92q67.99 0 115.49-47.59t47.5-115.58q0-67.99-47.59-115.49t-115.58-47.5q-67.99 0-115.49 47.59t-47.5 115.58q0 67.99 47.59 115.49t115.58 47.5ZM480-392q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm.05 172q-137.97 0-251.43-76.12Q115.16-372.23 61.54-500q53.62-127.77 167.02-203.88Q341.97-780 479.95-780q137.97 0 251.43 76.12Q844.84-627.77 898.46-500q-53.62 127.77-167.02 203.88Q618.03-220 480.05-220ZM480-500Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z" />
                          </svg>
                        </button>
                        <input
                          type="text"
                          class="login_input"
                          id="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          placeholder="Password"
                        />
                        <button
                          class="form_button trans_200"
                          form="login_form"
                          type="submit"
                          disabled={loading}
                        >
                          {loading ? "Logging in..." : "Login"}
                        </button>
                      </div>

                      {error && <p className="error-message"></p>}
                      {/* <button type="submit" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                      </button> */}
                    </form>
                    {/* <div class="forgot_pass">
                      <a href="#">Forgot password?</a>
                    </div>
                    <div class="separator_container d-flex flex-row align-items-center justify-content-center">
                      <hr class="line" />
                      <p class="separator">Or</p>
                      <hr class="line" />
                    </div>
                    <div class="login_options">
                      <div class="login_google">
                        <div class="option_button d-flex flex-row align-items-center justify-content-center">
                          <a href="#"></a>
                          <svg viewBox="0 0 24 24">
                            <g fill="none">
                              <path
                                fill="#4285F4"
                                d="M23.49,12.27 C23.49,11.48 23.42,10.73 23.3,10 L12,10 L12,14.51 L18.47,14.51 C18.18,15.99 17.33,17.24 16.07,18.09 L16.07,21.09 L19.93,21.09 C22.19,19 23.49,15.92 23.49,12.27 Z"
                              ></path>
                              <path
                                fill="#34A853"
                                d="M12,24 C15.24,24 17.95,22.92 19.93,21.09 L16.07,18.09 C14.99,18.81 13.62,19.25 12,19.25 C8.87,19.25 6.22,17.14 5.27,14.29 L1.29,14.29 L1.29,17.38 C3.26,21.3 7.31,24 12,24 Z"
                              ></path>
                              <path
                                fill="#FBBC05"
                                d="M5.27,14.29 C5.02,13.57 4.89,12.8 4.89,12 C4.89,11.2 5.03,10.43 5.27,9.71 L5.27,6.62 L1.29,6.62 C0.47,8.24 0,10.06 0,12 C0,13.94 0.47,15.76 1.29,17.38 L5.27,14.29 Z"
                              ></path>
                              <path
                                fill="#EA4335"
                                d="M12,4.75 C13.77,4.75 15.35,5.36 16.6,6.55 L20.02,3.13 C17.95,1.19 15.24,0 12,0 C7.31,0 3.26,2.7 1.29,6.62 L5.27,9.71 C6.22,6.86 8.87,4.75 12,4.75 Z"
                              ></path>
                            </g>
                          </svg>
                          <span>Continue with Google</span>
                        </div>
                      </div>
                      <div class="login_facebook">
                        <div class="option_button d-flex flex-row align-items-center justify-content-center">
                          <a href="#"></a>
                          <svg viewBox="0 0 24 24">
                            <g fill="none" fill-rule="evenodd">
                              <path
                                fill="#1877F2"
                                d="M24,12 C24,5.37257812 18.6274219,0 12,0 C5.37257813,0 0,5.37257812 0,12 C0,17.9895469 4.38822656,22.9539844 10.125,23.8541719 L10.125,15.46875 L7.078125,15.46875 L7.078125,12 L10.125,12 L10.125,9.35625 C10.125,6.34875 11.9165391,4.6875 14.6575547,4.6875 C15.9705,4.6875 17.34375,4.921875 17.34375,4.921875 L17.34375,7.875 L15.8305547,7.875 C14.3398828,7.875 13.875,8.80000781 13.875,9.74899219 L13.875,12 L17.203125,12 L16.6710937,15.46875 L13.875,15.46875 L13.875,23.8541719 C19.6117734,22.9539844 24,17.9895469 24,12"
                              ></path>
                              <path
                                fill="#FFF"
                                d="M16.6710938,15.46875 L17.203125,12 L13.875,12 L13.875,9.74899219 C13.875,8.80000781 14.3398828,7.875 15.8305547,7.875 L17.34375,7.875 L17.34375,4.921875 C17.34375,4.921875 15.9705,4.6875 14.6575547,4.6875 C11.9165391,4.6875 10.125,6.34875 10.125,9.35625 L10.125,12 L7.078125,12 L7.078125,15.46875 L10.125,15.46875 L10.125,23.8541719 C10.7359453,23.9500312 11.362125,24 12,24 C12.637875,24 13.2640547,23.9500312 13.875,23.8541719 L13.875,15.46875 L16.6710938,15.46875 Z"
                              ></path>
                            </g>
                          </svg>
                          <span>Continue with Facebook</span>
                        </div>
                      </div>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
