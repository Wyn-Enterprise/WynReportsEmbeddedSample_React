import * as React from "react";
import "../../styles/ReportsList.css";

export default class ReportsList extends React.Component<any, any> {


    constructor(props:any) {
        super(props);       
    }

    onReportClick = (rdl:any) => {        
        this.props.selectedReport(rdl.id, rdl.name);
    }

    public render() {
        const { reportsList } = this.props;

        return (
            <div className="dashboardsList">
                {reportsList.map((rdl:any, index:any) => {
                    return (
                        <div className="listItem" key={index} onClick={() => this.onReportClick(rdl)}>
                            <h3>{rdl.name}</h3>
                        </div>)
                })}
            </div>
        )
    }
}
