import React, { useEffect, useReducer, useRef } from "react";
import ReactDOM from "react-dom/client";

const root = ReactDOM.createRoot(document.getElementById("root"));

function Login() {
  const fields = {
    username: "",
    password: "",
    confirm_password: "",
    error: "",
    password_correct: "Incorrect Password",
  };
  const pass = useRef("");
  const conf_pass = useRef("");
  const changer = useRef();
  useEffect(() => {
    changer.current.addEventListener("change", add_listener);
  });
  let para = document.getElementById("paragraph");
  function reducer(state, action) {
    switch (action.type) {
      case "edit": {
        return { ...state, [action.field]: action.value };
      }
      case "correct":
        return { ...state, password_correct: "Correct Password", error: "" };
      case "incorrect password":
        para.style.display = "block";
        return { ...state, error: "Incorrect Password" };
      case "too short":
        para.style.display = "block";
        return {
          ...state,
          error: "Password must contain at least 8 Characters",
        };
      case "absent-characters":
        para.style.display = "block";
        return { ...state, error: "Password Must Contain Special Characters" };
      case "upper-characters":
        para.style.display = "block";
        return {
          ...state,
          error: "Password Must Contain Uppercase Characters",
        };
      case "lower-characters":
        para.style.display = "block";
        return {
          ...state,
          error: "Password Must Contain Lowercase Characters",
        };
      case "number-characters":
        para.style.display = "block";
        return { ...state, error: "Password Must Contain Numbers" };
      default:
        return state;
    }
  }

  const passExp_lowercase = /[a-z]+/;
  const passExp_uppercase = /[A-Z]+/;
  const passExp_special = /[!@#$%^&*()_+":><?]+/;
  const passExp_numbers = /[0-9]+/;

  const sub_button = useRef();
  const add_listener = () => {
    if (pass.current.length < 8) {
      dispatch({ type: "too short" });
    } else {
      if (passExp_special.test(pass.current) === false) {
        dispatch({ type: "absent-characters" });
      } else {
        if (passExp_numbers.test(pass.current) === false) {
          dispatch({ type: "number-characters" });
        } else {
          if (passExp_uppercase.test(pass.current) === false) {
            dispatch({ type: "upper-characters" });
          } else {
            if (passExp_lowercase.test(pass.current) === false) {
              dispatch({ type: "lower-characters" });
            } else {
              if (pass.current !== conf_pass.current) {
                dispatch({ type: "incorrect password" });
              } else {
                dispatch({ type: "correct" });
              }
            }
          }
        }
      }
    }
  };

  const [state, dispatch] = useReducer(reducer, fields);
  useEffect(() => {
    pass.current = state.password;
  });
  useEffect(() => {
    conf_pass.current = state.confirm_password;
  });
  const handleSubmission = (event) => {
    event.preventDefault();
    console.log(state);
  };
  return (
    <>
      <form onSubmit={handleSubmission} method="POST">
        <label>Username</label>
        <input
          type="text"
          placeholder="Username"
          required
          value={state.username}
          onChange={(event) =>
            dispatch({
              type: "edit",
              field: "username",
              value: event.target.value,
            })
          }
        ></input>
        <label style={{ display: "block" }}>Password</label>
        <input
          type="password"
          ref={changer}
          required
          autoComplete="on"
          id="password"
          placeholder="Password"
          style={{ display: "block" }}
          value={state.password}
          onChange={(e) =>
            dispatch({ type: "edit", field: "password", value: e.target.value })
          }
        />
        <input
          type="password"
          required
          placeholder="Confirm Password"
          value={state.confirm_password}
          onChange={(e) =>
            dispatch({
              type: "edit",
              field: "confirm_password",
              value: e.target.value,
            })
          }
          autoComplete="on"
        />
        <button type="submit" ref={sub_button} onClick={add_listener}>
          Sign Up
        </button>
      </form>
      <p id="paragraph" style={{ display: "none" }}>
        {state.error}
      </p>
    </>
  );
}
export default Login;
root.render(<Login />);
