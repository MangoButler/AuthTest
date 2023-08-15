import { useRef, useState } from "react";
import classes from "./auth-form.module.css";
import { validateEmail } from "../../lib/validators";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";

async function createUser(email, password) {
  const response = await fetch("/api/auth/sign-up", {
    method: "POST",
    body: JSON.stringify({ email: email, password: password }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }
  return data;
}

function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [isInvalid, setIsInvalid] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  function switchAuthModeHandler() {
    setIsLogin((prevState) => !prevState);
  }

  async function submitHandler(event) {
    event.preventDefault();

    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    if (
      !enteredEmail ||
      !validateEmail(enteredEmail) ||
      !enteredPassword ||
      enteredPassword.trim().length < 7
    ) {
      setIsInvalid(true);
      return;
    }
    setIsInvalid(false);

    if (isLogin) {
      const result = await signIn("credentials", {
        redirect: false,
        email: enteredEmail,
        password: enteredPassword,
      });

      if (!result.error) {
        //set authn state
        router.replace("/profile");
        console.log(result);
        return;
      }
      setError(result.error || "Something went wrong!");
    } else {
      try {
        const result = await createUser(enteredEmail, enteredPassword);
        console.log(result);
      } catch (error) {
        setError(error.message || "Failed to connect to server, try again!");
        console.log(error);
        return;
      }
      const result = await signIn('credentials', {
        redirect: false,
        email: enteredEmail,
        password: enteredPassword
      });
      if(!result.error){
        router.replace("/profile");
        console.log(result);
        return;
      }
      setError(result.error || 'Connection timeout, log in manually.');
    }
  }

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" required ref={emailInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input
            type="password"
            id="password"
            required
            ref={passwordInputRef}
          />
        </div>
        <div className={classes.actions}>
          {error && <p className={classes.errorText}>{error}</p>}
          {isInvalid && (
            <p className={classes.errorText}>Enter valid email and password</p>
          )}
          <button>{isLogin ? "Login" : "Create Account"}</button>
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default AuthForm;
