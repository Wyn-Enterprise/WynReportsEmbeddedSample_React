import { getReportingInfo, concatUrls } from './api';

const addCssLink = (cssUrl) => {
	const head = document.getElementsByTagName('head')[0];
	const link = document.createElement('link');
	link.rel = 'stylesheet';
	link.type = 'text/css';
	link.href = cssUrl;
	head.appendChild(link);
};

const addDesignerAndViewerCssLinks = (portalUrl, pluginVersion, theme) => {
	const themeSuffix = theme !== 'default' ? `.${theme}` : '';
	const viewerCssUrl = concatUrls(portalUrl, `api/pluginassets/reports-${pluginVersion}/viewer-app${themeSuffix}.css`);
	const designerCssUrl = concatUrls(portalUrl, `api/pluginassets/reports-${pluginVersion}/designer-app${themeSuffix}.css`);

	addCssLink(viewerCssUrl);
	addCssLink(designerCssUrl);
};

export const createDesigner = async (portalUrl, referenceToken, onSavedReport) => {
	const prevDocumentTitle = document.title;

	const info = await getReportingInfo(portalUrl, referenceToken);
	addDesignerAndViewerCssLinks(portalUrl, info.pluginVersion, info.theme);

	const designerOptions = window.GrapeCity.WynReports.Designer.createDesignerOptions(portalUrl, referenceToken);
	designerOptions.locale = info.locale;
	designerOptions.onSaved = onSavedReport;

	designerOptions.makeTitle = (reportName, options) => {
		const title = `${reportName}${options.dirty ? ' *' : ''}`;
		return title;
	};

	let viewer = null;
	designerOptions.openViewer = (options) => {
		if (!viewer) {
			viewer = window.GrapeCity.WynReports.Viewer.create({
				element: options.element,
				portalUrl,
				referenceToken,
				locale: options.locale,
			});
		}

		viewer.openReport(options.reportInfo.id);
	};

	await window.GrapeCity.WynReports.Designer.renderApplication('report-designer-app', designerOptions);

	const reportDesignerApp = document.getElementById('report-designer-app');

	return {
		createReport: (reportType) => {
			window.GrapeCity.WynReports.Designer.closeViewer();
			window.GrapeCity.WynReports.Designer.api.createReport({
				reportType: (reportType || '').toUpperCase() === 'FPL' ? 'FPL' : 'CPL',
			});
			reportDesignerApp.classList.remove('not-displayed');
		},
		openReportInDesigner: (report) => {
			window.GrapeCity.WynReports.Designer.closeViewer();
			const reportInfo = {
				id: report.id,
				name: report.name,
				permissions: ['all'],
			};
			window.GrapeCity.WynReports.Designer.api.openReport({ reportInfo });
			reportDesignerApp.classList.remove('not-displayed');
		},
		openReport: (report) => {
			window.GrapeCity.WynReports.Designer.closeViewer();
			const reportInfo = {
				id: report.id,
				name: report.name,
				permissions: ['all'],
			};
			window.GrapeCity.WynReports.Designer.api.openReport({ reportInfo });
			reportDesignerApp.classList.remove('not-displayed');
		},
		close: () => {
			if (viewer) {
				viewer.destroy();
				viewer = null;
			}
			window.GrapeCity.WynReports.Designer.destroy();
			reportDesignerApp.classList.add('not-displayed');
			document.title = prevDocumentTitle;
		},
	};
};
