import React from "react";
import "../../styles/ReportsList.css";
import { Report } from "../library/index";

interface ReportsListProps {
    reportsList: Report[];
    selectedReport: (id: string) => void;
}

const ReportsList: React.FC<ReportsListProps> = ({ reportsList, selectedReport }) => {
    return (
        <div className="dashboardsList">
            {reportsList && reportsList.map((report) => (
                <div
                    className="listItem"
                    key={report.id}
                    onClick={() => selectedReport(report.id)}
                >
                    <h3>{report.name}</h3>
                </div>
            ))}
        </div>
    );
};

export default ReportsList;
