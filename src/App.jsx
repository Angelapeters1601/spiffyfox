import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import LoadingFallback from "./ui/LoadingFallback";

// Lazy load pages
const Home = React.lazy(() => import("./pages/Home"));
const Tips = React.lazy(() => import("./pages/Tips"));
const Services = React.lazy(() => import("./pages/Services"));
const Location = React.lazy(() => import("./pages/Location"));
const Policy = React.lazy(() => import("./pages/Policy"));
const Join = React.lazy(() => import("./pages/Join"));
const Contact = React.lazy(() => import("./pages/Contact"));

function App() {
  // Loading component
  const [isLoading, setIsLoading] = useState(false);

  isLoading && <LoadingFallback />;
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route
              index
              element={
                <React.Suspense fallback={<LoadingFallback />}>
                  <Home />
                </React.Suspense>
              }
            />
            <Route
              path="tips"
              element={
                <React.Suspense fallback={<LoadingFallback />}>
                  <Tips />
                </React.Suspense>
              }
            />
            <Route
              path="services"
              element={
                <React.Suspense fallback={<LoadingFallback />}>
                  <Services />
                </React.Suspense>
              }
            />
            <Route
              path="location"
              element={
                <React.Suspense fallback={<LoadingFallback />}>
                  <Location />
                </React.Suspense>
              }
            />
            <Route
              path="policy"
              element={
                <React.Suspense fallback={<LoadingFallback />}>
                  <Policy />
                </React.Suspense>
              }
            />
            <Route
              path="join"
              element={
                <React.Suspense fallback={<LoadingFallback />}>
                  <Join />
                </React.Suspense>
              }
            />
            <Route
              path="contact"
              element={
                <React.Suspense fallback={<LoadingFallback />}>
                  <Contact />
                </React.Suspense>
              }
            />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
