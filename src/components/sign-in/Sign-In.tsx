import * as React from "react";
import '../../styles/SignIn.css';

export default class SignIn extends React.Component<any, any> {

    constructor(props:any) {
        super(props);
        this.state = {
            username: '',
            password: '',
            serverUrl: '',
            error: '',
            serverUrlError: '',
            usernameError: '',
            passwordError: ''
        };

        this.onUsernameChange = this.onUsernameChange.bind(this);
        this.onPasswordChange = this.onPasswordChange.bind(this);
        this.onServerUrlChange = this.onServerUrlChange.bind(this);
        this.signInClick = this.signInClick.bind(this);
    }

    onUsernameChange(event:any) {
        this.setState({ username: event.target.value });
    }

    onPasswordChange(event:any) {
        this.setState({ password: event.target.value });
    }

    onServerUrlChange(event:any) {
        var re = /\/$/;
        this.setState({ serverUrl: event.target.value.replace(re, "") });
    }

    signInClick = async () => {
        try {
            // clear previous field errors
            this.setState({ serverUrlError: '', usernameError: '', passwordError: '', error: '' });

            // basic client-side validation
            const serverUrlValue = (this.state.serverUrl || '').trim();
            const usernameValue = (this.state.username || '').trim();
            const passwordValue = (this.state.password || '').trim();
            let hasError = false;
            if (!serverUrlValue) {
                this.setState({ serverUrlError: 'Please enter Portal URL' });
                hasError = true;
            }
            if (!usernameValue) {
                this.setState({ usernameError: 'Please enter Username' });
                hasError = true;
            }
            if (!passwordValue) {
                this.setState({ passwordError: 'Please enter Password' });
                hasError = true;
            }
            if (hasError) return;
            var urlencoded = new URLSearchParams();
            urlencoded.append("grant_type", "password");
            urlencoded.append("username", this.state.username);
            urlencoded.append("password", this.state.password);
            urlencoded.append("client_id", "integration");
            urlencoded.append("client_secret", "eunGKas3Pqd6FMwx9eUpdS7xmz");

            let server = serverUrlValue;
            if (!server) {
                this.setState({ error: 'Please enter Portal URL' });
                return;
            }
            if (!/^https?:\/\//i.test(server)) {
                server = 'http://' + server;
            }

            const response = await fetch(server + "/connect/token", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                redirect: 'follow',
                body: urlencoded.toString()
            });

            if (!response.ok) {
                console.error('Token request failed', response.status, response.statusText);
                this.setState({ error: `Authorization error (${response.status})` });
                return;
            }

            const res = await response.json();
            const token = res && res.access_token;
            if (token) {
                this.props.signIn(this.state.serverUrl, token, this.state.username);
            } else {
                this.setState({ error: 'Authorization error' });
            }
        } catch (err:any) {
            console.error('Network or fetch error', err);
            this.setState({ error: err && err.message ? err.message : 'Network error: Failed to fetch' });
        }
    }

    public render() {
        const { error } = this.state;
        return (
            <div id="sign-in-root">
                <label id="sign-in-error" className="sign-in-error">{error}</label>
                <div className="sign-in-card card-surface">
                    <div className="sign-in-form">
                        <div className="sign-in-control">
                            <input autoFocus type="text" className="sign-in-input" id="sign-in-portal-url" onChange={this.onServerUrlChange} placeholder="Portal URL" />
                            <div className="sign-in-field-error">{this.state.serverUrlError}</div>
                        </div>
                        <div className="sign-in-control">
                            <input type="text" className="sign-in-input" id="sign-in-username" onChange={this.onUsernameChange} placeholder="Username" />
                            <div className="sign-in-field-error">{this.state.usernameError}</div>
                        </div>
                        <div className="sign-in-control">
                            <input type="password" className="sign-in-input" id="sign-in-password" onChange={this.onPasswordChange} placeholder="Password" />
                            <div className="sign-in-field-error">{this.state.passwordError}</div>
                        </div>
                        <button id="sign-in-button" className="sign-in-button" onClick={this.signInClick}>Sign In</button>
                    </div>
                </div>
            </div>
        );
    }
}
