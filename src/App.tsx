import React, { useState, useRef } from "react";
import { WynIntegration } from "@wynenterprise/wyn-integration";
import { getReportList, Report } from "./components/library/index";
import ReportsList from "./components/reports-list/ReportsList";
import SignIn from "./components/sign-in/Sign-In";
import "./styles/App.css";

const App: React.FC = () => {
    const [token, setToken] = useState<string | null>(null);
    const [username, setUsername] = useState<string>("");
    const [serverUrl, setServerUrl] = useState<string>("");
    const [reportsList, setReportsList] = useState<Report[]>([]);
    
    // Refs for mutable values that don't need to trigger re-renders
    const reportIdRef = useRef<string>("");
    const reportTypeRef = useRef<"CPL" | "FPL">("CPL"); 
    
    const insRef = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const signIn = async (url: string, newToken: string, user: string) => {
        try {
            const list = await getReportList(url, newToken);
            setToken(newToken);
            setServerUrl(url);
            setUsername(user);
            setReportsList(list);
        } catch (error) {
            console.error("Failed to load reports list", error);
        }
    };

    const signOut = () => {
        setToken(null);
        setReportsList([]);
        setUsername("");
        setServerUrl("");
        
        // Clean up viewer
        if (insRef.current && typeof insRef.current.destroy === 'function') {
            insRef.current.destroy();
        }
        insRef.current = null;
        
        if (containerRef.current) {
            containerRef.current.innerHTML = "";
        }
    };

    const clearContainer = () => {
        if (containerRef.current) {
            containerRef.current.innerHTML = "";
        }
    };

    const createViewer = async () => {
        clearContainer();
        if (!containerRef.current || !token) return;
        
        try {
            const ins = await WynIntegration.createReportViewer(
                {
                    baseUrl: serverUrl,
                    reportId: reportIdRef.current,
                    token: token,
                },
                "#wyn-root"
            );
            insRef.current = ins;
        } catch (e) {
            console.error("Failed to create report viewer", e);
        }
    };

    const selectedReport = (id: string, name: string) => {
        reportIdRef.current = id;
        if (insRef.current && typeof insRef.current.destroy === 'function') {
            insRef.current.destroy();
        }
        createViewer();
    };

    const createDesigner = async () => {
        clearContainer();
        if (!containerRef.current || !token) return;

        try {
            const ins = await WynIntegration.createReportDesigner(
                {
                    baseUrl: serverUrl,
                    reportId: reportIdRef.current,
                    language: "en",
                    token: token,
                },
                "#wyn-root"
            );
            insRef.current = ins;
            
            if (reportIdRef.current === "" && ins.api) {
                 ins.api.createReport({ reportType: reportTypeRef.current });
            }
        } catch (e) {
            console.error("Failed to create report designer", e);
        }
    };

    const createNewRdlReport = () => {
        if (insRef.current?.destroy) insRef.current.destroy();
        reportIdRef.current = "";
        reportTypeRef.current = "CPL";
        createDesigner();
    };

    const createNewFplReport = () => {
        if (insRef.current?.destroy) insRef.current.destroy();
        reportIdRef.current = "";
        reportTypeRef.current = "FPL";
        createDesigner();
    };

    const openReportInDesigner = () => {
        if (insRef.current?.destroy) insRef.current.destroy();
        if (reportIdRef.current === "") {
            alert("Please select a Report");
        } else {
            createDesigner();
        }
    };

    return (
        <div className="app">
            {!token && <SignIn signIn={signIn} />}
            {token && (
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
                                    onClick={signOut}
                                >
                                    Log Out
                                </button>
                            </div>
                            <div className="app-sidebar-header-group">
                                <button
                                    id="app-create-report-rdl"
                                    className="app-sidebar-btn app-create-report-btn"
                                    type="button"
                                    onClick={createNewRdlReport}
                                >
                                    <span className="btn-icon">+</span> Create New RDL Report
                                </button>
                                <button
                                    id="app-create-report-fpl"
                                    className="app-sidebar-btn app-create-report-btn"
                                    type="button"
                                    onClick={createNewFplReport}
                                >
                                    <span className="btn-icon">+</span> Create New Page Report
                                </button>
                                <button
                                    id="app-open-report-designer"
                                    className="app-sidebar-btn app-create-report-btn"
                                    type="button"
                                    onClick={openReportInDesigner}
                                >
                                    <span className="btn-icon">+</span> Design Selected Report
                                </button>
                            </div>
                        </div>
                        <div className="app-sidebar-content">
                            <ReportsList
                                selectedReport={selectedReport}
                                reportsList={reportsList}
                            />
                        </div>
                    </div>
                    <div id="wyn-root" ref={containerRef}></div>
                </div>
            )}
        </div>
    );
};

export default App;
