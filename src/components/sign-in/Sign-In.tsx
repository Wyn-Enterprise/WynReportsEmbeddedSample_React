import * as React from "react";
import '../../styles/SignIn.css';

export default class SignIn extends React.Component<any, any> {

    constructor(props:any) {
        super(props);
        this.state = {
            username: '',
            password: '',
            serverUrl: '',
            error: ''
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

        var urlencoded = new URLSearchParams();
        urlencoded.append("grant_type", "password");
        urlencoded.append("username", this.state.username);
        urlencoded.append("password", this.state.password);
        urlencoded.append("client_id", "integration");
        urlencoded.append("client_secret", "eunGKas3Pqd6FMwx9eUpdS7xmz");

        const response = await fetch(this.state.serverUrl + "/connect/token", {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            body: urlencoded // body data type must match "Content-Type" header
        });

        await response.json().then(res => {
            var token = res.access_token;
            if (token) {
                this.props.signIn(this.state.serverUrl, token, this.state.username);
            } else {
                this.setState({ error: "Authorization error" });
            }
        }).catch(err => {
            console.log(err);
            this.setState({ error: "Authorization error" });
        });
    }

    public render() {
        const { error } = this.state;
        return (
            <div id="sign-in-root" className="not-displayed">
                <label id="sign-in-error" className="sign-in-error">{error}</label>
                <div className="sign-in-form">
                    <div className="sign-in-control">
                        <input autoFocus type="text" className="sign-in-input" id="sign-in-portal-url" onChange={this.onServerUrlChange} placeholder="Portal URL" />
                    </div>
                    <div className="sign-in-control">
                        <input autoFocus type="text" className="sign-in-input" id="sign-in-username" onChange={this.onUsernameChange} placeholder="Username" />
                    </div>
                    <div className="sign-in-control">
                        <input autoFocus type="password" className="sign-in-input" id="sign-in-password" onChange={this.onPasswordChange} placeholder="Password" />
                    </div>
                    <button id="sign-in-button" className="sign-in-button" onClick={this.signInClick}>Sign In</button>
                </div>
            </div>
        );
    }
}
