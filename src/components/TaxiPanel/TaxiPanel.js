import axios from "axios";

import TaxiNavbar from "../Navbar/TaxiNavbar";
import Footer from "../Footer/Footer";

import "./panel.css";

import React, { useEffect, useState } from "react";
import { Button, Badge, Spinner, Modal } from "react-bootstrap";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Pane,
  Rectangle,
} from "react-leaflet";


const TaxiPanel = () => {
  const [data_list, setDataList] = useState([]);
  const [notification, setNotification] = useState("");
  const [booking, setBooking] = useState("");
  //The following state are for modal provided by bootstrap
  const [show, setShow] = useState(false);
  const handleClose = () => {setShow(false); setTrip("")};
  const handleShow = () => setShow(true);
  const [trip, setTrip] = useState("")
  
  const bounds = [
    [28.5, 77.1],
    [28.8, 77.4],
  ];

  const getData = () => {
    axios({
      url: "http://3.83.144.254:80/update/taxis",
      method: "GET",
      headers: { "Access-Control-Allow-Origin": "*" },
    }).then((res) => {
      let serialData = Array(50)     
      for(let d in res.data){
        serialData[res.data[d]['id']-1] = res.data[d]
      }
      setDataList(serialData);
    });
  };

  const checkNotification = (e, id) => {
    e.preventDefault();
    handleShow();
    // console.log(data_list[id])
    axios({
      url: "http://3.83.144.254:80/notification/" + data_list[id]['id'],
      method: "GET",
      headers: { "Access-Control-Allow-Origin": "*" },
    }).then((res) => {
      setNotification(res.data);
      setBooking(res.data["booking_id"]);
      handleShow();
    });
  };

  //Load data initially
  useEffect(() => {
    getData();
  }, []);

  // 3. Create out useEffect function
  useEffect(() => {
    const interval = setInterval(() => {
      // checkNotification();
      console.log("getting data");
      getData();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleStartTrip = (e) => {
    e.preventDefault();
    axios({
      url: "http://3.83.144.254:80/starttrip",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      data: JSON.stringify({ booking_id: booking }),
    }).then((res) => {
        setTrip(res.data);
    });
  };

  const handleRequest = (e) =>{
    e.preventDefault();
    axios({
      url: "http://3.83.144.254:80/accept",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      data: JSON.stringify({ booking_id: booking }),
    }).then((res) => {
      setTrip(res.data);
    });
  }

  return (
    <div>
      <TaxiNavbar />

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Booking Request</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {Object.keys(notification).length === 0
            ? "Sorry, no booking right now. Try again later"
            : Object.entries(notification).map(([key, value]) => (
                <div>
                  <span class="bold-text">{key + " "}</span>
                  {key === "source"
                    ? JSON.stringify(value["coordinates"])
                    : key === "destination"
                    ? JSON.stringify(value["coordinates"])
                    : key === "taxi_location"
                    ? JSON.stringify(value["coordinates"])
                    :value}
                </div>
              ))}
        </Modal.Body>
        <Modal.Footer>
          <p className="bold-text">{trip}</p>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>

          <Button
            variant="primary"
            disabled={Object.keys(notification).length === 0 ? true : false}
            onClick={(e) => handleRequest(e)}
          >
            AcceptRequest
          </Button>

          <Button
            variant="primary"
            disabled={Object.keys(notification).length === 0 ? true : false}
            onClick={(e) => handleStartTrip(e)}
          >
            Start trip
          </Button>
        </Modal.Footer>
      </Modal>

      <h1 style={{ textAlign: "center" }}>Taxi Panel</h1>
      <div className="container-fluid d-flex panel-container px-4">
        <div className="left border border-dark" style={{ flex: "5" }}>
          <div className="map-container">
            <MapContainer
              center={[28.65195, 77.23149]}
              zoom={10}
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <Pane name="yellow-rectangle" style={{ zIndex: 499 }}>
                <Rectangle bounds={bounds} pathOptions={{ color: "yellow" }} />
              </Pane>

              {data_list.length !== 0
                ? data_list.map((value) => (
                    <Marker position={value["location"]["coordinates"]}>
                      <Popup>{value["name"]}</Popup>
                    </Marker>
                  ))
                : null}
            </MapContainer>
          </div>
        </div>

        <div
          className="right bg-dark border border-dark overflow-scroll"
          style={{ flex: "2" }}
        >
          {data_list.length === 0 ? (
            <Spinner animation="border" role="status"></Spinner>
          ) : (
            data_list.map((data, key) => (
              <div className="data-items" id={key}>
                {Object.entries(data).map(([key, value]) => (
                  <div id={key}>
                    <span class="bold-text">{key + " "}</span>
                    {key === "location" ? (
                      JSON.stringify(value["coordinates"])
                    ) : key === "status" ? (
                      value === "Pending" ? (
                        <Badge bg="danger">Booking</Badge>
                      ) : (
                        <Badge bg="success">{value}</Badge>
                      )
                    ) : (
                      value
                    )}
                  </div>
                ))}
                <Button
                  className="btn-primary mt-1 mb-1"
                  onClick={(e) => checkNotification(e, key)}
                >
                  Check Notification
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TaxiPanel;
