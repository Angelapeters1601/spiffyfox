import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import LoadingFallback from "./ui/LoadingFallback";
import NotFoundPage from "./pages/NotFoundPage";
import UnauthorizedPage from "./components/UnauthorizedPage";
import { ScrollToTopHandler } from "./ui/ScrollToTop";
import JobPostings from "./admin/contractor/JobPostings";
-JobPostings;

// Lazy load main pages
const Home = React.lazy(() => import("./pages/Home"));
const Tips = React.lazy(() => import("./pages/Tips"));
const Services = React.lazy(() => import("./pages/Services"));
const Reviews = React.lazy(() => import("./pages/Reviews"));
const Location = React.lazy(() => import("./pages/Location"));
const Policy = React.lazy(() => import("./pages/Policy"));
const Join = React.lazy(() => import("./pages/Join"));
const Contact = React.lazy(() => import("./pages/Contact"));

// Lazy load admin components
const AdminLayout = React.lazy(() => import("./admin/AdminLayout"));
const AdminLogin = React.lazy(() => import("./admin/AdminLogin"));
const AdminProtectedRoute = React.lazy(
  () => import("./admin/protectedRoute/AdminProtectedRoute"),
);
const Dashboard = React.lazy(() => import("./admin/dashboard/Dashboard"));
const AdminContact = React.lazy(() => import("./admin/contact/AdminContact"));
const AdminNewsletter = React.lazy(
  () => import("./admin/contact/AdminNewsletter"),
);
const AdminContractor = React.lazy(
  () => import("./admin/contractor/AdminContractor"),
);

// const AdminJobPostings = React.lazy(() => import("./admin/job-postings"));
const AdminTips = React.lazy(() => import("./admin/tips/AdminTips"));
const AdminClientPortal = React.lazy(
  () => import("./admin/client/AdminClientPortal"),
);
const LiveChat = React.lazy(() => import("./admin/livechat/LiveChat"));
const VisitorAnalytics = React.lazy(
  () => import("./admin/visitors/VisitorAnalytics"),
);
const FAQ = React.lazy(() => import("./admin/faq/FAQ"));

function App() {
  return (
    <Router>
      <div className="App">
        <ScrollToTopHandler />

        <Routes>
          {/* Public routes with main layout */}
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
              path="reviews"
              element={
                <React.Suspense fallback={<LoadingFallback />}>
                  <Reviews />
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

          {/* Admin Login (public route) */}
          <Route
            path="admin"
            element={
              <React.Suspense fallback={<LoadingFallback />}>
                <AdminLogin />
              </React.Suspense>
            }
          />

          {/* Protected Admin routes */}
          <Route
            path="admin/*"
            element={
              <React.Suspense fallback={<LoadingFallback />}>
                <AdminProtectedRoute />
              </React.Suspense>
            }
          >
            <Route
              element={
                <React.Suspense fallback={<LoadingFallback />}>
                  <AdminLayout />
                </React.Suspense>
              }
            >
              <Route
                path="dashboard"
                element={
                  <React.Suspense fallback={<LoadingFallback />}>
                    <Dashboard />
                  </React.Suspense>
                }
              />
              <Route
                path="dashboard"
                element={
                  <React.Suspense fallback={<LoadingFallback />}>
                    <Dashboard />
                  </React.Suspense>
                }
              />
              <Route
                path="contact"
                element={
                  <React.Suspense fallback={<LoadingFallback />}>
                    <AdminContact />
                  </React.Suspense>
                }
              />
              <Route
                path="contractor"
                element={
                  <React.Suspense fallback={<LoadingFallback />}>
                    <AdminContractor />
                  </React.Suspense>
                }
              />
              <Route
                path="job-postings"
                element={
                  <React.Suspense fallback={<LoadingFallback />}>
                    <JobPostings />
                  </React.Suspense>
                }
              />
              <Route
                path="tips"
                element={
                  <React.Suspense fallback={<LoadingFallback />}>
                    <AdminTips />
                  </React.Suspense>
                }
              />{" "}
              <Route
                path="newsletter"
                element={
                  <React.Suspense fallback={<LoadingFallback />}>
                    <AdminNewsletter />
                  </React.Suspense>
                }
              />
              <Route
                path="client-portal"
                element={
                  <React.Suspense fallback={<LoadingFallback />}>
                    <AdminClientPortal />
                  </React.Suspense>
                }
              />
              <Route
                path="live-chat"
                element={
                  <React.Suspense fallback={<LoadingFallback />}>
                    <LiveChat />
                  </React.Suspense>
                }
              />
              <Route
                path="analytics"
                element={
                  <React.Suspense fallback={<LoadingFallback />}>
                    <VisitorAnalytics />
                  </React.Suspense>
                }
              />
              <Route
                path="faq"
                element={
                  <React.Suspense fallback={<LoadingFallback />}>
                    <FAQ />
                  </React.Suspense>
                }
              />
            </Route>
          </Route>

          {/* Standalone pages (without layouts) */}
          <Route
            path="unauthorized"
            element={
              <React.Suspense fallback={<LoadingFallback />}>
                <UnauthorizedPage />
              </React.Suspense>
            }
          />

          {/* Catch all route - 404 */}
          <Route
            path="*"
            element={
              <React.Suspense fallback={<LoadingFallback />}>
                <NotFoundPage />
              </React.Suspense>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
