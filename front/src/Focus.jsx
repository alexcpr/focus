import React, { useState } from "react";
import {
  HashRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import "./assets/css/Focus.css";

import Header from "./Header";
import Hero from "./Hero";
import Gallery from "./Gallery";
import Contact from "./Contact";
import Login from "./Login";
import Admin from "./Admin";
import Register from "./Register";
import Account from "./Account";
import Footer from "./Footer";
import Legal from "./Legal";

function Focus() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Header />
              <Hero />
              <Gallery />
              <Footer />
            </>
          }
        />
        <Route
          path="/gallery"
          element={
            <>
              <Header />
              <Gallery />
              <Footer />
            </>
          }
        />
        <Route
          path="/gallery/:id"
          element={
            <>
              <Header />
              <Gallery />
              <Footer />
            </>
          }
        />
        <Route
          path="/contact"
          element={
            <>
              <Header />
              <Contact />
              <Footer />
            </>
          }
        />
        <Route
          path="/account"
          element={
            <>
              <Header />
              <Account />
              <Footer />
            </>
          }
        />
        <Route
          path="/login"
          element={
            <>
              <Header />
              <Login />
              <Footer />
            </>
          }
        />
        <Route
          path="/admin"
          element={
            <>
              <Header />
              <Admin />
              <Footer />
            </>
          }
        />
        <Route
          path="/register"
          element={
            <>
              <Header />
              <Register />
              <Footer />
            </>
          }
        />
        <Route
          path="/legal"
          element={
            <>
              <Header />
              <Legal />
              <Footer />
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default Focus;
