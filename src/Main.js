import React, { useState, useEffect } from "react";
import App from "./App";

export default function Main() {
  let darkStatus = localStorage.getItem("isDark");
  const [darkMode, setDarkMode] = useState();

  useEffect(() => {
    if (darkStatus === null) {
      setDarkMode(false);
    } else if (darkStatus === "1") {
      setDarkMode(true);
    } else {
      setDarkMode(false);
    }
  }, [darkStatus]);

  return (
    <div className={darkMode ? "dark" : ""}>
      <App darkMode={darkMode} setDarkMode={setDarkMode} />
    </div>
  );
}
