import React, { useEffect } from "react";
import { WynIntegration } from "@wynenterprise/wyn-integration";
import { getReportList } from "./components/library/index";
import ReportsList from "./components/reports-list/ReportsList";
import SignIn from "./components/sign-in/Sign-In";
import "./styles/App.css";

export default class App extends React.Component<any, any> {
  ins: any;
  reportId: any;
  reportType: any;
  reportName: any;
  constructor(props: any) {
    super(props);
    this.state = {
      token: null,
      username: "",
      serverUrl: "",
      reportID: "",
      docTitle: "",
      documentType: "rdl",
      reportType: "CPL",
      reportsList: null,
    };

    this.selectedReport = this.selectedReport.bind(this);
    this.signIn = this.signIn.bind(this);
    this.signOut = this.signOut.bind(this);
    this.createNewRdlReport = this.createNewRdlReport.bind(this);
    this.createNewFplReport = this.createNewFplReport.bind(this);
    this.createViewer = this.createViewer.bind(this);
    this.openReportInDesigner = this.openReportInDesigner.bind(this);
    this.createDesigner = this.createDesigner.bind(this);
  }

  selectedReport = (reportId: string, name: string) => {
    this.reportId = reportId;
    this.reportName = name;
    this.ins?.destroy?.();
    this.createViewer();
  };

  signIn = async (serverUrl: string, token: string, username: string) => {
    var reportsList = await getReportList(serverUrl, token);
    this.setState({
      token: token,
      serverUrl: serverUrl,
      username: username,
      reportsList: reportsList,
    });
  };

  signOut() {
    this.setState({ token: null });
  }
  clearContainer = () => {
    const container = document.querySelector("#wyn-root");
    if (container) container.innerHTML = "";
  };
  createViewer = () => {
    this.clearContainer();
    WynIntegration.createReportViewer(
      {
        baseUrl: this.state.serverUrl,
        reportId: this.reportId,
        //theme: 'red',
        token: this.state.token,
        // for v5.0, v5.1 ignore
        //version: '5.0.21782.0',
      },
      "#wyn-root"
    ).then((ins) => {
      this.ins = ins;
    });
  };

  createNewRdlReport = () => {
    this.ins?.destroy?.();
    this.reportId = "";
    this.reportType = "CPL";
    this.createDesigner();
  };

  createNewFplReport = () => {
    this.ins?.destroy?.();
    this.reportId = "";
    this.reportType = "FPL";
    this.createDesigner();
  };

  openReportInDesigner = () => {
    this.ins?.destroy?.();
    if (this.reportId === "") alert("Please select a Report");
    else this.createDesigner();
  };

  createDesigner = () => {
    this.clearContainer();
    WynIntegration.createReportDesigner(
      {
        baseUrl: this.state.serverUrl,
        reportId: this.reportId,
        language: "en",
        token: this.state.token,
        // for v5.0, v5.1 ignore
        //version: '5.0.21782.0',
      },
      "#wyn-root"
    ).then((ins) => {
      this.ins = ins;
      if (this.reportId === "")
        this.ins.api.createReport({ reportType: this.reportType });
      //this.loading = false;
    });
  };

  render() {
    const { token, serverUrl, username, reportsList, reportID } = this.state;

    const Application = (
      <div className="app">
        {token == null && <SignIn signIn={this.signIn} />}
        {token != null && (
          <div className="app-root">
            <div className="app-sidebar">
              <div className="app-sidebar-header">
                <div className="app-sidebar-header-group">
                  <div id="app-portal-url">{serverUrl}</div>
                </div>
                <div className="app-sidebar-header-group app-user-info">
                  <div>
                    <div id="app-username">{username}</div>
                  </div>
                  <button
                    id="app-logout-button"
                    className="app-sidebar-btn app-logout-button"
                    onClick={this.signOut}
                  >
                    Log Out
                  </button>
                </div>
                <div className="app-sidebar-header-group">
                  <button
                    id="app-create-report-rdl"
                    className="app-sidebar-btn app-create-report-btn"
                    type="button"
                    onClick={this.createNewRdlReport}
                  >
                    <span className="btn-icon">+</span> Create New RDL Report
                  </button>

                  <button
                    id="app-create-report-fpl"
                    className="app-sidebar-btn app-create-report-btn"
                    type="button"
                    onClick={this.createNewFplReport}
                  >
                    <span className="btn-icon">+</span> Create New Page Report
                  </button>

                  <button
                    id="app-open-report-designer"
                    className="app-sidebar-btn app-create-report-btn"
                    type="button"
                    onClick={this.openReportInDesigner}
                  >
                    <span className="btn-icon">+</span> Design Selected Report
                  </button>
                </div>
              </div>
              <div className="app-sidebar-content">
                <ReportsList
                  selectedReport={this.selectedReport}
                  reportsList={reportsList}
                />
              </div>
            </div>
            <div id="wyn-root"></div>
          </div>
        )}
      </div>
    );
    return Application;
  }
}
