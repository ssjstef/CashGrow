import Tree from "./pages/Tree.jsx";
import Graph from "./pages/Graph.jsx";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Uploader from "./pages/Uploader";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { useState, useContext } from "react";
import ProtectedRoutes from "./utils/ProtectedRoutes.jsx";

function App() {


  return(
    <BrowserRouter>
      <Routes>
        <Route path="/Login" element={<Login/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route element={<ProtectedRoutes/>}>
          <Route path="/tree" element={<Tree/>}/>
          <Route path="/upload" element={<Uploader/>}/>
          <Route path="/graph" element={<Graph/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;


