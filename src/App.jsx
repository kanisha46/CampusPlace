import { useState } from "react";
import Home from "./pages/Home";
import AuthPage from "./pages/Authpage";
import Header from "./components/Header";

function App() {
  const [page, setPage] = useState("home");

  return (
    <>
      <Header setPage={setPage} />
      {page === "home" && <Home />}
      {page === "login" && <AuthPage />}
    </>
  );
}

export default App;
