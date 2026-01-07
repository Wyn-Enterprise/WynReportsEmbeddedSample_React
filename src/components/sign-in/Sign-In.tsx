import React, { useState, ChangeEvent } from "react";
import "../../styles/SignIn.css";

interface SignInProps {
  signIn: (serverUrl: string, token: string, username: string) => void;
}

const SignIn: React.FC<SignInProps> = ({ signIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [serverUrl, setServerUrl] = useState("");
  const [error, setError] = useState("");

  const [fieldErrors, setFieldErrors] = useState({
    serverUrl: "",
    username: "",
    password: "",
  });

  const onUsernameChange = (e: ChangeEvent<HTMLInputElement>) =>
    setUsername(e.target.value);
  const onPasswordChange = (e: ChangeEvent<HTMLInputElement>) =>
    setPassword(e.target.value);

  const onServerUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    setServerUrl(e.target.value.replace(/\/$/, ""));
  };

  const signInClick = async () => {
    setFieldErrors({ serverUrl: "", username: "", password: "" });
    setError("");

    const trimmedUrl = serverUrl.trim();
    const trimmedUser = username.trim();
    const trimmedPass = password.trim();

    let hasError = false;
    const newFieldErrors = { serverUrl: "", username: "", password: "" };

    if (!trimmedUrl) {
      newFieldErrors.serverUrl = "Please enter Portal URL";
      hasError = true;
    }
    if (!trimmedUser) {
      newFieldErrors.username = "Please enter Username";
      hasError = true;
    }
    if (!trimmedPass) {
      newFieldErrors.password = "Please enter Password";
      hasError = true;
    }

    if (hasError) {
      setFieldErrors(newFieldErrors);
      return;
    }

    let server = trimmedUrl;
    if (!/^https?:\/\//i.test(server)) {
      server = `http://${server}`;
    }

    try {
      const body = new URLSearchParams();
      body.append("grant_type", "password");
      body.append("username", trimmedUser);
      body.append("password", trimmedPass);
      body.append("client_id", "integration");
      body.append("client_secret", process.env.REACT_APP_CLIENT_SECRET || "");

      const response = await fetch(server + "/connect/token", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body.toString(),
      });

      if (!response.ok) {
        setError(`Authorization error (${response.status})`);
        return;
      }

      const res = await response.json();
      if (res?.access_token) {
        signIn(trimmedUrl, res.access_token, trimmedUser);
      } else {
        setError("Authorization error");
      }
    } catch (err: any) {
      setError(err?.message || "Network error: Failed to fetch");
    }
  };

  return (
    <div id="sign-in-root">
      <label id="sign-in-error" className="sign-in-error">
        {error}
      </label>
      <div className="sign-in-card card-surface">
        <div className="sign-in-form">
          <div className="sign-in-control">
            <input
              autoFocus
              type="text"
              className="sign-in-input"
              id="sign-in-portal-url"
              onChange={onServerUrlChange}
              placeholder="Portal URL"
            />
            <div className="sign-in-field-error">{fieldErrors.serverUrl}</div>
          </div>
          <div className="sign-in-control">
            <input
              type="text"
              className="sign-in-input"
              id="sign-in-username"
              onChange={onUsernameChange}
              placeholder="Username"
            />
            <div className="sign-in-field-error">{fieldErrors.username}</div>
          </div>
          <div className="sign-in-control">
            <input
              type="password"
              className="sign-in-input"
              id="sign-in-password"
              onChange={onPasswordChange}
              placeholder="Password"
            />
            <div className="sign-in-field-error">{fieldErrors.password}</div>
          </div>
          <button
            id="sign-in-button"
            className="sign-in-button"
            onClick={signInClick}
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
