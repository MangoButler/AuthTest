import { useRef, useState } from "react";
import classes from "./profile-form.module.css";

function ProfileForm(props) {
  const [isInvalid, setIsInvalid] = useState(false);
  const newPasswordInputRef = useRef();
  const oldPasswordInputRef = useRef();

  async function submitHandler(event) {
    event.preventDefault();

    const newEnteredPassword = newPasswordInputRef.current.value;
    const oldEnteredPassword = oldPasswordInputRef.current.value;

    if (
      !newEnteredPassword ||
      !oldEnteredPassword ||
      newEnteredPassword.trim().length < 7
    ) {
      setIsInvalid(true);
      return;
    }
    props.onChangePassword({
      oldPassword: oldEnteredPassword,
      newPassword: newEnteredPassword,
    });

    oldPasswordInputRef.current.value = "";
    newPasswordInputRef.current.value = "";
    setIsInvalid(false);
  }

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        <input type="password" id="new-password" ref={newPasswordInputRef} />
      </div>
      <div className={classes.control}>
        <label htmlFor="old-password">Old Password</label>
        <input type="password" id="old-password" ref={oldPasswordInputRef} />
      </div>
      <div className={classes.action}>
        {isInvalid && <p>Invalid input</p>}
        {props.notification && (
          <p className={classes[props.notification.status]}>
            {props.notification.message}
          </p>
        )}
        <button>Change Password</button>
      </div>
    </form>
  );
}

export default ProfileForm;
