export const createViewer = (portalUrl, referenceToken) => {
    const viewer = GrapeCity.ActiveReports.JSViewer.create({
        element: '#wyn-viewer-root',
        reportID: '',
        reportService: {
            url: portalUrl,
            securityToken: referenceToken,
        }
    });
    
    return {
        openReport: (report) => {
            viewer.openReport(report.id)
            document.getElementById('wyn-viewer-root').style.display = 'block';
            document.getElementById('wyn-viewer-root').style.width = "100%";
        },
        close: () => {
            document.getElementById('wyn-viewer-root').style.display = 'none';
        }
    }
}
