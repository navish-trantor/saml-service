import React, { useState } from "react";
import axios from "axios";
import { useEffect } from "react";

const App = () => {
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {}, [userEmail]);
  // can we find a more optimal way to redirect??
  const RedirectToLogin = () =>
    window.location.replace(
      `http://localhost:3000/login?location=${window.location.href}`
    );

  const handleClick = () => {
    setLoading(true);

    axios({
      method: "GET",
      url: `http://localhost:3000/whoami`,
      withCredentials: true,
    })
      .then((res) => {
        console.log("SAML user ", res.data.user);
        if (res.data.user.nameID) {
          setUserEmail(res.data.user.nameID);
          setLoading(false);
        } else {
          // redirect to login
          RedirectToLogin();
        }
      })
      .catch((err) => {
        // redirect to login
        RedirectToLogin();
      });
  };

  const handleLogOutClick = () => {
    // axios({
    //   method: "POST",
    //   url: "http://localhost:3000/logout",
    //   headers: {
    //     "Access-Control-Allow-Origin": "*",
    //   },
    // })
    //   .then((res) => console.log(res))
    //   .catch((err) => console.log(err));
    window.location.replace(`http://localhost:3000/logout`);
  };

  if (loading) return <p>Loading.....</p>;

  if (userEmail !== "")
    return (
      <>
        <p>Hello I'm {userEmail}</p>
        <button onClick={handleLogOutClick}>LogOut</button>
      </>
    );

  return (
    <>
      <button onClick={handleClick}>Login</button>
    </>
  );
};

export default App;
