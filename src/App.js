import React, { useEffect } from "react";
import Nav from "./components/Nav";
import Edit from "./pages/Edit/Edit";
import Home from "./pages/Home/Home";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import Search from "./pages/Search/Search";
import Details from "./pages/Details/Details";
import Loading from "./components/Loading/Loading";
import AddSeries from "./pages/AddSeries/AddSeries";
import EditProfile from "./pages/EditProfile/EditProfile";
import Verification from "./pages/Auth/Verification";
import { auth } from "./backend/config";
import { useAuthState } from "react-firebase-hooks/auth";
import { ToastContainer } from "react-toastify";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

function App({ darkMode, setDarkMode }) {
  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    return () => {
      sessionStorage.removeItem("isEmailSent");
    };
  }, []);

  if (loading) {
    return <Loading status={"Checking Auth State"} />;
  }

  if (error) {
    return <div className="text-primaryText">Fatal Error {error.message}</div>;
  }
  // bg-lmPrimaryLight dark:bg-primaryDark
  if (!user) {
    return (
      <div className="h-full min-h-screen w-full bg-loginBack2 font-body ">
        <BrowserRouter>
          <Routes>
            <Route index path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </BrowserRouter>
      </div>
    );
  }

  if (!user.emailVerified) {
    return (
      <div className="bg-lmPrimaryLight dark:bg-primaryDark h-full min-h-screen w-full">
        <Verification name={user.displayName} email={user.email} />
      </div>
    );
  }

  return (
    <div className="bg-lmPrimaryLight dark:bg-primaryDark h-full min-h-screen w-full font-body">
      <BrowserRouter>
        <Nav darkMode={darkMode} setDarkMode={setDarkMode} />
        <Routes>
          <Route path="/" element={<Home darkMode={darkMode} />} />
          <Route path="/:q" element={<Home darkMode={darkMode} />} />
          <Route path="/search/:seriesName" element={<Search />} />
          <Route path="/addseries" element={<AddSeries />} />
          <Route path="/details/:bookId" element={<Details />} />
          <Route path="/edit/:id" element={<Edit />} />
          <Route path="/editprofile/" element={<EditProfile />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        limit={4}
      />
    </div>
  );
}

export default App;
