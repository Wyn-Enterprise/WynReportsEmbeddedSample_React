import { getReportList } from '../api';

export const createAppSidebar = (portalUrl, username, organizationName, referenceToken) => {
	document.getElementById('app-portal-url').innerHTML = (
		`<a href="${portalUrl}" target="_blank" rel="noopener noreferrer">${portalUrl}</a>`
	);
	document.getElementById('app-username').innerHTML = username;
	document.getElementById('app-org').innerHTML = organizationName;
	const reportsList = document.getElementById('wyn-report-list');
	let reports = [];
	
	const sortReports = () => {
		reports = reports.sort((x, y) => x.name.localeCompare(y.name));
	};
	const removeActiveReport = () => {
		const items = reportsList.children;
		for (let i = 0; i < items.length; i++) {
			items[i].classList.remove('active');
		}
	};

	const openReportViewer = () => {
		const items = reportsList.children;
		for (let i = 0; i < items.length; i++) {
			items[i].classList.remove('active');
		}
	}

	const createReportElement = (report) => {
		const item = document.createElement('li');
		item.value = report.id;
		const text = document.createElement('span');
		text.innerHTML = report.name;
		item.title = report.name;
		item.appendChild(text);
		item.className = 'wyn-report-list-item';
		item.onclick = () => {
			removeActiveReport();
			item.classList.add('active');
			appSidebar.onOpenReport(report);
		};
		return item;
	};
	const appSidebar = {
		onLogOut: null,
		onCreateReport: null,
		onReportInDesigner: null,
		onReportInViewer: null,
		onOpenReport: null,
		refreshReportsList: async () => {
			reports = await getReportList(portalUrl, referenceToken);
			sortReports();
			reportsList.innerHTML = '';
			reports.forEach(report => {
				const item = createReportElement(report);
				reportsList.appendChild(item);
			});
		},
		onSavedReport: (report) => {
			let index = reports.findIndex(x => report.id === x.id || report.name === x.name);
			if (index === -1) {
				reports.push(report);
				sortReports();
				index = reports.findIndex(x => report.id === x.id);
				const item = createReportElement(report);
				reportsList.insertBefore(item, reportsList.children[index]);
			}
			removeActiveReport();
			const item = reportsList.children[index];
			item.classList.add('active');
		},
		clearReportList: () => {
			reports = [];
			reportsList.innerHTML = '';
		},
	};
	document.getElementById('app-create-rdl-report').onclick = () => {
		removeActiveReport();
		appSidebar.onCreateReport('CPL');
	};
	document.getElementById('app-create-page-report').onclick = () => {
		removeActiveReport();
		appSidebar.onCreateReport('FPL');
	};
	document.getElementById('app-open-report-designer').onclick = () => {
		removeActiveReport();
		appSidebar.onReportInDesigner();
	};
	document.getElementById('app-logout-button').onclick = () => { appSidebar.onLogOut(); };
	return appSidebar;
};
