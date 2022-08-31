import React from "react";

const Footer = () => {
  return (
    <div id='footer' className="container-fluid p-4 w-100 bg-dark d-flex text-light">
      <div
        className="left"
        style={{ flex: "1", "borderRight": "3px dashed white" }}
      >
        <h1 id="brand-title">Taxi Co-Op Booking Cloud Project</h1>
        <span className="text-secondary">
          &copy; Group-5 - S21
          <span className="fst-italic"> [ACSE,Sept-21 GreatLearning]</span>
        </span>
      </div>
      <div className="right " style={{ flex: "1" }}>
        <ul>
          <li>
            <a
              href="https://www.flaticon.com/free-icons/taxi"
              title="taxi icons"
            >
              Taxi icons created by bearicons - Flaticon
            </a>
          </li>
          <li>
            <a
              href="https://www.flaticon.com/free-icons/user"
              title="user icons"
            >
              User icons created by Freepik - Flaticon
            </a>
          </li>
          <li>
            <a href="https://www.pexels.com/photo/trendy-young-lady-catching-cab-on-city-street-6440616/">
              Photo by Dario Fernandez Ruz
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Footer;
