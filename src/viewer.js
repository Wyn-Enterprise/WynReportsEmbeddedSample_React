import { getReportingInfo, concatUrls } from './api';

const addCssLink = (cssUrl) => {
	const head = document.getElementsByTagName('head')[0];
	const link = document.createElement('link');
	link.rel = 'stylesheet';
	link.type = 'text/css';
	link.href = cssUrl;
	head.appendChild(link);
};

const addViewerCssLink = (portalUrl, pluginVersion, theme) => {
	const themeSuffix = theme !== 'default' ? `.${theme}` : '';
	const viewerCssUrl = concatUrls(portalUrl, `api/pluginassets/reports-${pluginVersion}/viewer-app${themeSuffix}.css`);
	addCssLink(viewerCssUrl);
};

export const createViewer = async (portalUrl, referenceToken) => {
	const prevDocumentTitle = document.title;

	const info = await getReportingInfo(portalUrl, referenceToken);
	addViewerCssLink(portalUrl, info.pluginVersion, info.theme);

	const reportViewerAppId = 'report-viewer-app';
	let viewer = window.GrapeCity.WynReports.Viewer.create({
		element: reportViewerAppId,
		portalUrl,
		referenceToken,
		locale: info.locale,
		makeTitle: (reportName) => reportName,
	});
	return {
		openReport: async (report) => {
			await viewer.openReport(report.id);
			document.getElementById(reportViewerAppId).classList.remove('not-displayed');
		},
		close: () => {
			if (viewer) {
				viewer.destroy();
				viewer = null;
			}
			document.getElementById(reportViewerAppId).classList.add('not-displayed');
			document.title = prevDocumentTitle;
		},
	};
};
