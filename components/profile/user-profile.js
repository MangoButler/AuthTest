// import { useEffect, useState } from "react";
import { useState } from "react";
import ProfileForm from "./profile-form";
import classes from "./user-profile.module.css";

// import { useSession, getSession } from "next-auth/react";

function UserProfile() {
  // Redirect away if NOT auth
  // const [isLoading, setIsLoading] = useState(true);

  // const { data: session, status } = useSession();
  // const loading = status === "loading";

  // useEffect(() => {
  //   getSession().then((session) => {
  //     if (!session) {
  //       window.location.href = "/auth";
  //     } else {
  //       setIsLoading(false);
  //     }
  //   });
  // }, []);

  // if (isLoading) {
  //   return <p className={classes.profile}>Loading...</p>;
  // }
  const [requestStatus, setRequestStatus] = useState(false);

  async function changePasswordHandler(passwordData) {
    const response = await fetch("/api/user/change-password", {
      method: "PATCH",
      body: JSON.stringify(passwordData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    if (!response.ok) {
      console.log(data.message || "Something went wrong!");
      setRequestStatus({ status: "error", message: data.message });
      return;
    }

    console.log(data);
    setRequestStatus({ status: "success", message: data.message });
  }

  return (
    <section className={classes.profile}>
      <h1>Your User Profile</h1>
      <ProfileForm onChangePassword={changePasswordHandler} notification={requestStatus} />
    </section>
  );
}

export default UserProfile;
