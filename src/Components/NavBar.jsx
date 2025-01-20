import Logo from "../assets/homelogo.png";
import Swal from "sweetalert2"; // Add this import

export default function NavBar() {
  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of your account",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        // Perform logout actions
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        Swal.fire(
          "Logged Out!",
          "You have been successfully logged out.",
          "success"
        ).then(() => {
          // Redirect to login page after showing success message
          window.location.href = "/login";
        });
      }
    });
  };

  return (
    <header className="header">
      <div className="d-flex flex-row align-items-center justify-content-start">
        <div className="logo_container">
          <a href="/">
            <div className="d-flex flex-row align-items-center justify-content-start">
              <div className="logo">
                <img src={Logo} alt="Coursette Logo" width={100} height={100} />
              </div>
              {/* <div className="logo_text">Coursette</div> */}
            </div>
          </a>
        </div>
        <nav className="main_nav">
          <ul className="d-flex flex-row align-items-center">
            <li>
              <a href="/students">Students</a>
            </li>
            <li>
              <a href="/courses">Courses</a>
            </li>
            <li>
              <a href="/products">Products</a>
            </li>
            <li>
              <a href="/messages">Messages</a>
            </li>
            {/* <li className="dropdown">
                <a href="#" className="d-flex flex-row align-items-end">
                  <span>Pages</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 -960 960 960"
                  >
                    <path d="M480-346.85 253.85-573 291-610.15l189 189 189-189L706.15-573 480-346.85Z" />
                  </svg>
                </a>
                <div className="dropdown_panel_outer">
                  <ul className="dropdown_panel trans_200">
                    <li>
                      <a href="/">Home</a>
                    </li>
                    <li>
                      <a href="about.html">About</a>
                    </li>
                    <li>
                      <a href="courses.html">Courses</a>
                    </li>
                    <li>
                      <a href="course.html">Course Details</a>
                    </li>
                    <li>
                      <a href="blog.html">Blog</a>
                    </li>
                    <li>
                      <a href="blog_single.html">Blog Details</a>
                    </li>
                    <li>
                      <a href="contact.html">Contact</a>
                    </li>
                    <li>
                      <a href="login.html">Sign in</a>
                    </li>
                  </ul>
                </div>
              </li> */}
            <li>
              <a href="/users">Users</a>
            </li>
          </ul>
        </nav>
        <div className="header_right d-flex flex-row align-items-center justify-content-end">
          {/* <div className="header_search_container">
            <form className="header_search_form" action="#">
              <div>
                <input
                  id="header_search_input"
                  className="search_input"
                  type="text"
                  placeholder="What would you like to learn?"
                />
                <button className="header_search_btn" type="button"></button>
                <div className="header_search_suggestions_container search_suggestions_container trans_200">
                  <div>
                    <p>Recently visited</p>
                    <div className="recent_search_items">
                      <div className="recent_search_item d-flex flex-row align-items-center">
                        <a href="course.html"></a>
                        <div className="recent_search_item_pic"></div>
                        <p>Project Management Course</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p>Top searches</p>
                    <div className="top_searches">
                      <div className="top_search d-flex flex-row align-items-center">
                        <a href="course.html">Robotics course</a>
                      </div>
                      <div className="top_search d-flex flex-row align-items-center">
                        <a href="course.html">Generative AI</a>
                      </div>
                      <div className="top_search d-flex flex-row align-items-center">
                        <a href="course.html">Machine Learning</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div> */}
          <div className="header_controls d-flex flex-row align-items-center">
            {/* // <!-- Fav Button --> */}
            {/* <div className="header_controls_btn header_favs trans_200">
                <a
                  className="d-flex flex-row align-items-center justify-content-center"
                  href="courses.html"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    viewBox="0 0 24 24"
                  >
                    <path
                      className="st0"
                      d="M12,20.78l-0.84-0.76c-1.81-1.66-3.31-3.07-4.5-4.25c-1.19-1.18-2.12-2.22-2.81-3.12 c-0.69-0.9-1.17-1.72-1.44-2.45C2.14,9.47,2,8.74,2,8c0-1.41,0.48-2.6,1.44-3.56C4.4,3.48,5.59,3,7,3c0.98,0,1.89,0.25,2.75,0.75 S11.36,4.98,12,5.93c0.64-0.95,1.39-1.68,2.25-2.18S16.02,3,17,3c1.41,0,2.6,0.48,3.56,1.44C21.52,5.4,22,6.59,22,8 c0,0.74-0.14,1.47-0.41,2.2c-0.27,0.73-0.75,1.54-1.44,2.45c-0.69,0.9-1.62,1.94-2.8,3.12c-1.18,1.18-2.68,2.6-4.51,4.25L12,20.78z M12,19.28c1.78-1.61,3.24-2.98,4.39-4.13c1.15-1.15,2.06-2.14,2.72-2.98c0.67-0.84,1.13-1.59,1.39-2.24 c0.26-0.65,0.39-1.29,0.39-1.93c0-1.11-0.37-2.04-1.11-2.78C19.04,4.48,18.11,4.11,17,4.11c-0.88,0-1.7,0.25-2.45,0.76 c-0.75,0.51-1.42,1.27-2.01,2.28h-1.09c-0.61-1.03-1.28-1.79-2.02-2.29C8.7,4.36,7.88,4.11,7,4.11c-1.1,0-2.02,0.37-2.77,1.11 C3.49,5.96,3.11,6.89,3.11,8c0,0.63,0.13,1.28,0.39,1.93c0.26,0.65,0.72,1.4,1.39,2.24S6.46,14,7.61,15.14S10.22,17.66,12,19.28z"
                    />
                  </svg>
                </a>
              </div> */}
            {/* // <!-- Cart Button --> */}
            {/* <div className="header_controls_btn header_cart trans_200">
                <a
                  className="d-flex flex-row align-items-center justify-content-center"
                  href="courses.html"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    viewBox="0 0 24 24"
                  >
                    <path
                      className="st0"
                      d="M8.04,22c-0.48,0-0.89-0.16-1.21-0.47c-0.33-0.31-0.49-0.69-0.49-1.15c0-0.45,0.16-0.84,0.49-1.15 c0.33-0.31,0.73-0.47,1.21-0.47s0.88,0.16,1.21,0.47c0.33,0.31,0.49,0.69,0.49,1.15c0,0.45-0.16,0.83-0.49,1.15 C8.93,21.84,8.52,22,8.04,22z M18.73,22c-0.48,0-0.88-0.16-1.21-0.47c-0.33-0.31-0.49-0.69-0.49-1.15c0-0.45,0.16-0.84,0.49-1.15 c0.33-0.31,0.73-0.47,1.21-0.47s0.89,0.16,1.21,0.47c0.33,0.31,0.49,0.69,0.49,1.15c0,0.45-0.16,0.83-0.49,1.15 C19.61,21.84,19.21,22,18.73,22z M6.42,5.22l3.04,6.03h7.55c0.13,0,0.25-0.03,0.35-0.09c0.1-0.06,0.19-0.15,0.26-0.26l2.98-5.1 c0.09-0.15,0.09-0.29,0.02-0.4c-0.07-0.12-0.2-0.18-0.37-0.18C20.25,5.22,6.42,5.22,6.42,5.22z M5.86,4.15h14.82 c0.49,0,0.87,0.19,1.12,0.57c0.25,0.38,0.26,0.77,0.04,1.18l-3.25,5.59c-0.16,0.26-0.38,0.47-0.64,0.62 c-0.26,0.15-0.55,0.22-0.87,0.22H8.95l-1.38,2.4c-0.12,0.17-0.12,0.34-0.01,0.54c0.11,0.19,0.27,0.29,0.49,0.29h12.39v1.07H8.04 c-0.66,0-1.16-0.26-1.49-0.79s-0.34-1.06-0.02-1.59l1.71-2.88L4.06,3.07H2V2h2.78L5.86,4.15z M9.46,11.26h7.97H9.46z"
                    />
                  </svg>
                </a>
                <div className="header_cart_count_container">
                  <span>2</span>
                </div>*/}
            {/* <!-- Shopping Cart Hover --> */}
            {/* <div className="cart_hover_panel">
                  <div></div>
                  <div>
                    <p>Your Shopping Cart</p>
                    <div className="hover_cart_list"> */}
            {/* <!-- Hover cart item --> */}
            {/* <div className="hover_cart_item d-flex flex-row align-items-center">
                        <div className="hover_card_item_pic"> */}
            {/* <img src="https://placehold.co/64x64" alt="" /> */}
            {/* </div>
                        <div className="hover_card_item_content">
                          <a href="course.html">Python For Data Science</a>
                          <p>by Coursette</p>
                          <p>$123,00</p>
                        </div>
                      </div>  */}
            {/* // <!-- Hover cart item --> */}
            {/* <div className="hover_cart_item d-flex flex-row align-items-center">
                        <div className="hover_card_item_pic"> */}
            {/* <img src="https://placehold.co/64x64" alt="" /> */}
            {/* </div>
                        <div className="hover_card_item_content">
                          <a href="course.html">Poetry Course</a>
                          <p>by Coursette</p>
                          <p>$237,00</p>
                        </div>
                      </div>
                    </div>
                    <div className="hover_cart_total">
                      <p>
                        Total: <span>$360,00</span>
                      </p>
                    </div>
                    <div className="hover_cart_button_container">
                      <div className="button_fill hover_cart_button trans_200">
                        <a href="courses.html">
                          <div className="d-flex flex-row align-items-center justify-content-center">
                            <span>Go to cart</span>
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}
            {/* // <!-- User Button --> */}
            <div className="header_controls_btn header_user trans_200">
              <a
                className="d-flex flex-row align-items-center justify-content-center"
                // href="/login"
                onClick={handleLogout}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  viewBox="0 0 24 24"
                >
                  <path
                    className="st0"
                    d="M12,10.77c-1.11,0-2.06-0.41-2.85-1.22C8.36,8.75,7.97,7.77,7.97,6.64s0.39-2.11,1.18-2.92C9.94,2.91,10.89,2.5,12,2.5s2.06,0.41,2.85,1.22c0.79,0.81,1.18,1.78,1.18,2.92s-0.39,2.11-1.18,2.92 C14.06,10.37,13.11,10.77,12,10.77z M2,21.5v-1.99c0-0.56,0.17-1.09,0.5-1.59s0.79-0.89,1.36-1.17c1.37-0.66,2.73-1.16,4.09-1.49 c1.36-0.33,2.71-0.5,4.05-0.5s2.69,0.17,4.05,0.5c1.36,0.33,2.72,0.83,4.09,1.49c0.57,0.28,1.03,0.67,1.36,1.17s0.5,1.03,0.5,1.59 v1.99H2z M3.04,20.43h17.91v-0.92c0-0.36-0.12-0.7-0.35-1.02c-0.24-0.32-0.57-0.59-0.99-0.82c-1.19-0.59-2.43-1.04-3.72-1.36 c-1.29-0.32-2.58-0.48-3.89-0.48s-2.61,0.16-3.89,0.48c-1.29,0.32-2.53,0.77-3.72,1.36c-0.42,0.23-0.75,0.5-0.99,0.82 c-0.24,0.32-0.35,0.66-0.35,1.02V20.43z M12,9.7c0.82,0,1.52-0.3,2.11-0.9c0.58-0.6,0.88-1.32,0.88-2.16s-0.29-1.56-0.88-2.16 c-0.58-0.6-1.29-0.9-2.11-0.9s-1.52,0.3-2.11,0.9S9.01,5.79,9.01,6.64S9.31,8.2,9.89,8.8C10.48,9.4,11.18,9.7,12,9.7z"
                  />
                </svg>
              </a>
            </div>
            {/* // <!-- Hamburger --> */}
            <div className="header_controls_btn header_hamburger trans_200 d-flex flex-row align-items-center justify-content-center">
              <svg
                version="1.1"
                id="menu_icon"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                x="0px"
                y="0px"
                viewBox="0 0 20 16"
                style={{ enableBackground: "new 0 0 20 16" }}
                xmlSpace="preserve"
              >
                <g>
                  <rect x="0.5" y="0.5" className="st0" width="19" height="1" />
                  <polygon points="20,0 0,0 0,2 20,2 20,0" />
                </g>
                <g>
                  <rect x="0.5" y="7.5" className="st0" width="19" height="1" />
                  <polygon points="20,7 0,7 0,9 20,9 20,7" />
                </g>
                <g>
                  <rect
                    x="0.5"
                    y="14.5"
                    className="st0"
                    width="19"
                    height="1"
                  />
                  <polygon points="20,14 0,14 0,16 20,16 20,14" />
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
