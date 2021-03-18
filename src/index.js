import './index.css';
import '@grapecity/wyn-report-viewer/dist/viewer-app'
import { createAppSidebar } from './appSidebar'
import { createSignInForm } from './signInForm'
import { createDesigner } from './designer'
import { createViewer } from './viewer'

const createApp = (portalUrl, username, referenceToken) => {
    const appSidebar = createAppSidebar(portalUrl, username, referenceToken)
    const designer = createDesigner(portalUrl, referenceToken, appSidebar.onSavedReport)
    const viewer = createViewer(portalUrl, referenceToken)
    var isDesignerOpen = null;
    var rpt = null;
    
    const app = {
        open: () => {
            appSidebar.onCreateReport = () => {
                designer.openReport(rpt)
                viewer.close()
             }
            
            appSidebar.onOpenReport = (report) => {
                rpt = report
                if (!isDesignerOpen) {
                    viewer.openReport(report)
                    isDesignerOpen = true;
                    designer.close()
                }
                else {
                    viewer.openReport(report)
                    isDesignerOpen = true;
                    designer.close()
                }
                
            }
            appSidebar.refreshReportsList()
            document.getElementById('app-root').style.display = ''
        },
        close: () => {
            if (isDesignerOpen) {
                document.getElementById('wyn-viewer-root').style.display = 'none'
                appSidebar.clearReportList()
                viewer.close()
                isDesignerOpen = false
            }
            else if (!isDesigner) {
                document.getElementById('wyn-designer-root').style.display = 'none'
                appSidebar.clearReportList()
                designer.close()
                isDesignerOpen = true
            }
        },
        
        onLogOut: null
    }
    appSidebar.onLogOut = () => app.onLogOut()
    
    return app;
}

const init = () => {
    
    const signInForm = createSignInForm('http://localhost:51980/')
    signInForm.onSignIn = async (portalUrl, username, password) => {
        const referenceToken = await GrapeCity.ActiveReports.getReferenceToken(portalUrl, username, password)
        const app = createApp(portalUrl, username, referenceToken)
        app.onLogOut = () => {
            signInForm.open();
            app.close();
        }
        signInForm.close();
        app.open();
    }
    signInForm.open();
}

init()



