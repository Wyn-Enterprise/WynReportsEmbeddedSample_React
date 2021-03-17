import { getReportList } from '../api'

export const createAppSidebar = (portalUrl, username, referenceToken) => {
    document.getElementById('app-portal-url').innerHTML = portalUrl;
    document.getElementById('app-username').innerHTML = username;
    const reportsList = document.getElementById('wyn-report-list');
    let reports = [];
    const sortReports = () => {
        reports = reports.sort((x, y) => {
            if (x.name < y.name) return -1;
            if (x.name == y.name) return 0;
            return 1;
        })
    }
    const createReportElement = (report) => {
        var item = document.createElement("li");
        item.value = report.id;
        var text = document.createElement("span");
        text.innerHTML = report.name;
        item.appendChild(text);
        item.className = 'wyn-report-list-item';
        return item;
    }
    const removeActiveReport = () => {
        let items = reportsList.children;
        for (let i = 0; i < items.length; i++) {
            items[i].classList.remove('active');
        }
    }
    const hideSideMenu = () => {
        var item = document.getElementById("app-sidebar");
        item.hidden = true;
        appSidebar.setState({
            open: !appSidebar.state.open
          });
    }

    
        
    

    const appSidebar = {
        onLogOut: null,
        onCreateReport: null,
        onOpenReport: null,
        //onHideSideMenu: null,
        
        refreshReportsList: async () => {
            reports = await getReportList(portalUrl, referenceToken);
            sortReports();
            reportsList.innerHTML = null;
            reports.forEach(report => {
                const item = createReportElement(report);
                reportsList.appendChild(item);
                item.onclick = () => {
                    removeActiveReport();
                    item.classList.add('active');
                    appSidebar.onOpenReport(report)
                }
            });
        },
        onSavedReport: (report) => {
            let index = reports.findIndex(x => report.id == x.id || report.name == x.name);
            if (index == -1) {
                reports.push(report);
                sortReports();
                index = reports.findIndex(x => report.id == x.id)
                const item = createReportElement(report);
                reportsList.insertBefore(item, reportsList.children[index]);
            };
            removeActiveReport();
            reportsList.children.forEach((item, i) => {
                if (i == index) {
                    item.classList.add('active');
                }
            })
        },
        clearReportList: () => {
            reports = [];
            reportsList.innerHTML = null 
        }
        
    }
    document.getElementById('app-create-report').onclick = () => {
        removeActiveReport()
        appSidebar.onCreateReport();
    }
    document.getElementById('app-logout-button').onclick = () => {
        appSidebar.onLogOut()
        //appSidebar.hideSideMenu()
    }
    return appSidebar;
}