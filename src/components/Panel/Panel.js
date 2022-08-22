import React, { useState } from "react";
import TaxiNavbar from "../Navbar/TaxiNavbar";
import { useLocation } from "react-router-dom";
import './panel.css'
import {Button} from "react-bootstrap";

const Panel = () => {
  const { state } = useLocation();
  const data_list = state;
  return (
    <div>
      <TaxiNavbar />
      
      <div className="container-fluid d-flex h-100 p-0">
        <div className="left">
          <h1 style={{'text-align':'center'}}>Customer Panel</h1>
        </div>
        <div className="right">
          {data_list.map((data) => (
              <div className="data-items">
                {Object.entries(data).map(([key, value])=>
                <div>
                  <span class='bold-text'>{key+" "}</span>
                  {key === 'location'?JSON.stringify(value['coordinates']):value}
                </div>)}
                <Button className="btn-warning mt-1 mb-1">Book Taxi</Button>
              </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Panel;
