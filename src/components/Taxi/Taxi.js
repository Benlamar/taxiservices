import React from "react";
import { useState } from "react";
import TaxiNavbar from "../Navbar/TaxiNavbar";
import { taxi_list } from "../../data/taxis";
import axios from "axios";
import { getCurrentTime } from "../helper";
import Alert from "react-bootstrap/Alert";
import { useNavigate } from "react-router-dom";
import Footer from "../Footer/Footer.js";

const Taxi = () => {
  const [response, setResponse] = useState("");
  const [alert, setAlert] = useState(false);
  const navigate = useNavigate();

  const goToPanel = (taxi_list) => {
    setAlert(false);
    navigate("/taxipanel", { state: taxi_list });
  };

  const Register = () => {
    for (let i in taxi_list) {
      taxi_list[i]["timestamp"] = getCurrentTime();
      taxi_list[i]["status"] = "Available";
    }

    axios({
      url: "http://3.83.144.254:80/register/taxis",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      data: JSON.stringify(taxi_list),
    })
      .then((res) => {
        setResponse(JSON.stringify(res.data["msg"]));
        setAlert(true);
        setTimeout(() => goToPanel(taxi_list), 2000);
      })
      .catch((err) => {
        setResponse(JSON.stringify(err["message"]));
        setAlert(true);
        setTimeout(() => setAlert(false), 2000);
      });
  };

  return (
    <div>
      <TaxiNavbar />
      {alert ? (
        <Alert
          className="fixed-top"
          style={{ top: "65px" }}
          key="secondary"
          variant="secondary"
        >
          {response}
        </Alert>
      ) : null}
      <h1 className="text-center mt-3">Taxi Registration</h1>

      <div className="list-container">
        {taxi_list.map((taxi) => (
          <div className="item">
            <img src="./image/taxi2.png" alt="" />
            <div className="id">
              <span className="bold-text">ID : </span>
              {taxi["id"]}
            </div>
            <div className="name">
              <span className="bold-text">Name : </span>
              {taxi["name"]}
            </div>
            <div className="status">
              <span className="bold-text">Status : </span>Registration
            </div>
          </div>
        ))}
      </div>
      <div className="container d-flex justify-content-center m-5">
        <button className="btn btn-size btn-primary" onClick={Register}>
          Register
        </button>
      </div>

      <Footer />
    </div>
  );
};

export default Taxi;
