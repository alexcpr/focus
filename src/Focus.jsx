import { HashRouter as Router, Route, Routes } from "react-router-dom";

import "./assets/css/Focus.css";

import Header from "./Header";
import Hero from "./Hero";
import Gallery from "./Gallery";
import Contact from "./Contact";
import Footer from "./Footer";

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
          path="/account"
          element={
            <>
              <Header />
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
      </Routes>
    </Router>
  );
}

export default Focus;
