import axios from "axios";
import { generateRandomLocation, getCurrentTime } from "../helper";

import TaxiNavbar from "../Navbar/TaxiNavbar";
import Footer from "../Footer/Footer";

import React, { useState, useEffect } from "react";
import { Button, Spinner, Form, Alert } from "react-bootstrap";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

import * as L from "leaflet";

const Panel = () => {
  const [data_list, setDataList] = useState([]);
  const [alert, setAlert] = useState(false);
  const [response, setResponse] = useState("");
  const [destinationList, setDestinationList] = useState({});
  const [startPoint, setStartPoint] = useState("");
  const [destinationPoint, setDestinationPoint] = useState("");
  const [taxisPoint, setTaxisPoint] = useState([]);
  const [taxiType, setTaxiType] = useState('')
  const [user, setUser] = useState(null)

  let type = {}; //to store the type of taxi the users are requesting
  let destination = {};
  //making api request to the server to get the registered users
  const getData = () => {
    axios({
      url: "http://3.83.144.254:80/update/customers",
      method: "GET",
      headers: {"Access-Control-Allow-Origin": "*"} 
    }).then((res) => {
      let serialData = Array(5)     
      for(let d in res.data){
        serialData[res.data[d]['id']-1] = res.data[d]
      }
      setDataList(serialData);
      // console.log("Serial data",serialData)
    });
  };

  const getTaxis = () =>{
    if (user !== null){
      axios({
        url: "http://3.83.144.254:80/tripupdate/"+user,
        method: "GET",
        headers: {"Access-Control-Allow-Origin": "*"} 
      }).then((res) => {
        console.log(user,"<--user")
        setTaxisPoint(res.data['msg']);
      });
    }else{
      console.log('Hello user is empty')
    }
  }

  //this is required to render the data initially by calling the getData() method
  useEffect(() => {
    getData();
  }, []);

  // 3. Create out useEffect function
  useEffect(() => {
    const interval = setInterval(() => {
      console.log("getting customer");
      getData();

    }, 5000);
    return () => clearInterval(interval);
  }, [data_list]);

  useEffect(() => {
    const interval = setInterval(() => {
      getTaxis();
    }, 5000);
    return () => clearInterval(interval);
  }, [user]);

  const handleBooking = (e, id) => {
    setAlert(false);
    e.preventDefault();
    if (type !== ''){
      let request_booking = {};
      for (let key in data_list[id]) {
        request_booking[key] = data_list[id][key];
      }
      request_booking["timestamp"] = getCurrentTime();
      request_booking["type"] = taxiType;
      request_booking["destination"] = {
        type: "Point",
        coordinates: destinationPoint,
      };
      axios({
        url: "http://3.83.144.254:80/findtaxi",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        data: JSON.stringify(request_booking),
      })
        .then((res) => {
          setTaxisPoint(res.data["msg"]);
          setUser(data_list[id]['id']);
        })
        .catch((err) => {
          console.log(err);
          setResponse(err);
          setAlert(true);
        });
    } else {
      setResponse("Select your type of car and destination.");
      setAlert(true);
    }
  };

  const handleType = (e, key) => {
    if (
      e.target.value === "Basic" ||
      e.target.value === "Deluxe" ||
      e.target.value === "Luxury"
    ) {
      type[data_list[key]['id']] = e.target.value;
      setTaxiType(e.target.value)
    } else {
      delete type[key];
    }
  };

  const handelDestination = (e, key) => {
    e.preventDefault();
    
    destination[data_list[key]['id']] = generateRandomLocation();
    setDestinationPoint(destination[data_list[key]['id']])
    setDestinationList(destination);
    setStartPoint(data_list[key]['location']['coordinates'])
  };

  useEffect(() => {
    // console.log(destinationList, user)
  }, [
    destinationList,
    startPoint,
    destinationPoint,
    taxisPoint,
  ]);

  const LeafIcon = L.Icon.extend({
    options: {},
  });
  const greenIcon = new LeafIcon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  });
  const redIcon = new LeafIcon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  });

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

      <h1 style={{ textAlign: "center" }}>Customer Panel</h1>
      <div className="container-fluid d-flex panel-container px-4">
        <div className="left border border-dark" style={{ flex: "5" }}>
          <div className="map-container">
            <MapContainer
              center={[28.65195, 77.23149]}
              zoom={12}
              scrollWheelZoom={true}
              b
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {startPoint.length !== 0? (
                <Marker position={startPoint} icon={redIcon}>
                  <Popup>Start {" - " + startPoint}</Popup>
                </Marker>
              ) : null}

              {destinationPoint.length !== 0 ? (
                <Marker position={destinationPoint} icon={greenIcon}>
                  <Popup>Stop {" - " + destinationPoint}</Popup>
                </Marker>
              ) : null}

              {taxisPoint.length !== 0
                ? taxisPoint.map((value) => (
                    <Marker position={value["location"]["coordinates"]}>
                      <Popup>
                        <span className="bold-text">Name:</span>
                        {" " + value["name"]}
                        <br />
                        <span className="bold-text">Type:</span>
                        {" " + value["type"]}
                      </Popup>
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
              <div className="data-items">
                {Object.entries(data).map(([key, value]) => (
                  <div>
                    <span className="bold-text">{key + " "}</span>
                    {key === "location"
                      ? JSON.stringify(value["coordinates"])
                      : value}
                  </div>
                ))}

                <div className="d-flex justify-content-between align-items-center flex-wrap">
                  <div>
                    <span className="bold-text">destination </span>
                    <span>
                      {data_list[key]['id'] in destinationList
                        ? JSON.stringify(destinationList[data_list[key]['id']])
                        : ""}
                    </span>
                  </div>

                  <Button
                    className="btn-primary"
                    style={{ height: "30px", padding: "4px" }}
                    onClick={(e) => handelDestination(e, key)}
                  >
                    Destination
                  </Button>
                </div>

                <div className="d-flex mt-1 justify-content-between flex-wrap">
                  <Form.Select
                    value={
                      type[
                        Object.keys(type).filter((key) => {
                          return key;
                        })
                      ]
                    }
                    style={{ height: "40px", width: "160px" }}
                    onChange={(e) => {
                      handleType(e, key);
                    }}
                  >
                    <option value="">Select option</option>
                    <option value="Basic">Basic</option>
                    <option value="Deluxe">Deluxe</option>
                    <option value="Luxury">Luxury</option>
                  </Form.Select>

                  <Button
                    className="btn-warning"
                    onClick={(e) => handleBooking(e, key)}
                  >
                    Book Taxi
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Panel;
