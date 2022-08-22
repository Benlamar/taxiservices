import "./App.css";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Home from "./components/Home/Home";
import Taxi from "./components/Taxi/Taxi";
import Customer from "./components/Customer/Customer"
import Panel from "./components/Panel/Panel"
import TaxiPanel from "./components/TaxiPanel/TaxiPanel";
// import TaxiNavbar from "./components/Navbar/TaxiNavbar"

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/taxi" element={<Taxi/>} />
        <Route path="/customer" element={<Customer/>} />
        <Route path="/panel" element={<Panel/>} />
        <Route path="/taxipanel" element={<TaxiPanel/>} />
      </Routes>
    </BrowserRouter>
      
    </div>
  );
}

export default App;
