import './index.css';
import '@grapecity/wyn-report-viewer/dist/viewer-app'
import { createAppSidebar } from './appSidebar'
import { createSignInForm } from './signInForm'
import { createDesigner } from './designer'

const createApp = (portalUrl, username, referenceToken) => {
    const appSidebar = createAppSidebar(portalUrl, username, referenceToken)
    const designer = createDesigner(portalUrl, referenceToken, appSidebar.onSavedReport)
    
    const app = {
        open: () => {
            appSidebar.onCreateReport = () => {
                designer.createReport()
            }
            appSidebar.onOpenReport = (report) => {
                designer.openReport(report)
            }
            appSidebar.refreshReportsList()
            document.getElementById('app-root').style.display = ''
        },
        close: () => {
            document.getElementById('app-root').style.display = 'none'
            appSidebar.clearReportList()
            designer.close()
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
