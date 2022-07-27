import './index.css';

import '@grapecity/wyn-report-designer';
import '@grapecity/wyn-report-viewer';

import { createAppSidebar } from './appSidebar';
import { createSignInForm } from './signInForm';
import { createDesigner } from './designer';
import { createViewer } from './viewer';

const createApp = async (portalUrl, username, organizationName, referenceToken) => {
	const appSidebar = createAppSidebar(portalUrl, username, organizationName, referenceToken);
	const designer = await createDesigner(portalUrl, referenceToken, appSidebar.onSavedReport);
	const viewer = await createViewer(portalUrl, referenceToken);
	var rpt = null;
	var isDesignerOpen = true;
	var count = 0;

	const app = {
		open: () => {
			appSidebar.onCreateReport = (reportType) => {
				designer.createReport(reportType);
				document.getElementById('report-viewer-app').classList.add('not-displayed');
			};
			appSidebar.onOpenReport = async (report) => {
				rpt = report
				viewer.openReport(report)
				document.getElementById('report-designer-app').classList.add('not-displayed');
			};
			appSidebar.onReportInDesigner = async (report) => {
				designer.openReportInDesigner(rpt)
				document.getElementById('report-viewer-app').classList.add('not-displayed');
			}
			appSidebar.refreshReportsList();
			document.getElementById('app-root').classList.remove('not-displayed');
		},
		close: () => {
			 document.getElementById('app-root').classList.add('not-displayed');
			 appSidebar.clearReportList();
		},
		onLogOut: null,
	};

	appSidebar.onLogOut = () => app.onLogOut();
	return app;
};

const init = async () => {
	let referenceToken = null;

	const signInHandler = async (portalUrl, username, password) => {
		try {
			referenceToken = await window.GrapeCity.WynReports.getReferenceToken(portalUrl, username, password);
			signInForm.fillOrganizationList(portalUrl, referenceToken);
		}
		catch (e) {
			if (e.name === 'Error') {
				throw new Error('Invalid username or password');
			}
			throw new Error(e.message);
		}
	};

	const selectOrganizationHandler = async (portalUrl, username, password, organizationObj) => {

		referenceToken = await window.GrapeCity.WynReports.getReferenceToken(portalUrl, username, password, organizationObj.path);
		await signInForm.checkUserRoles(portalUrl, referenceToken);

		const app = await createApp(portalUrl, username, organizationObj.name, referenceToken);
		app.onLogOut = () => {
			signInForm.open();
			app.close();
		};

		app.open();
		signInForm.close();
	};

	const signInForm = createSignInForm(signInHandler, selectOrganizationHandler);
	signInForm.open();
};

init();
