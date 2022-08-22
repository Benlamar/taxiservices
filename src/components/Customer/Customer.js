import React, { useState } from "react";
import { customer_list } from "../../data/customers.js";
import TaxiNavbar from "../Navbar/TaxiNavbar";
import axios from "axios";
import { getCurrentTime } from "../helper";
import Alert from "react-bootstrap/Alert";
import { useNavigate } from "react-router-dom";


const Customer = () => {
  const [response, setResponse] = useState("");
  const [alert, setAlert] = useState(false);

  const navigate = useNavigate();

  const goToPanel = (customer_list) => {
    setAlert(false);
    navigate("/panel", { state: customer_list});
  };

  const Register = () => {
    for (let i in customer_list) {
      customer_list[i]["timestamp"] = getCurrentTime();
      customer_list[i]["status"] = "Available";
    }
    // axios(
    //   { url:"http://34.207.158.105/",
    //     method:"POST",
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     data:JSON.stringify(customer_list),
    //   }).then((res)=>{
    //     setResponse(JSON.stringify(res.data['msg']))
    //     setAlert(true)
    //     setTimeout(()=>setAlert(false), 2000)
    //    })

    axios({
      url: "http://127.0.0.1:8080/register/customers",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(customer_list),
    }).then((res) => {
      setResponse(JSON.stringify(res.data["msg"]));
      setAlert(true);
      setTimeout(() => goToPanel(customer_list), 2000);
    }).catch((err) => {
      setResponse(JSON.stringify(err["message"]));
      setAlert(true);
      setTimeout(()=>setAlert(false), 2000)
    });

    // let res2 = fetch( "http://127.0.0.1:8080/search",{
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ title: 'React POST Request Example' })
    // })
    // .then((response)=>response.json())
    // .then((data)=> console.log(JSON.stringify(data)))
    // console.log(res2)
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

      <h1 className="text-center mt-3">Customer Registration</h1>
      <div className="list-container">
        {customer_list.map((customer, key) => (
          <div className="item" key={key}>
            <img src="./image/man.png" alt="" />
            <div className="id">
              <span className="bold-text">ID : </span>
              {customer["id"]}
            </div>
            <div className="name">
              <span className="bold-text">Name : </span>
              {customer["name"]}
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
    </div>
  );
};

export default Customer;
