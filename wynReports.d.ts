import { DesignerApi } from '@grapecity/wyn-report-designer';
import { ViewerApi } from '@grapecity/wyn-report-viewer';

declare global {
	interface Window {
		GrapeCity: {
			WynReports: {
				/** Designer API namespace */
				Designer: DesignerApi;
				/** Viewer API namespace */
				Viewer: ViewerApi;
				/**
				 * Generates reference token.
				 * @param portalUrl Wyn Portal URL.
				 * @param username Name of Wyn Portal user.
				 * @param password Password of Wyn Portal user.
				 * @param organizationPath Path to Wyn Portal organization.
				 * @returns Reference token.
				 * @example
				 * const token = await GrapeCity.WynReports.getReferenceToken('https://wyn-portal.com/', '<username>', '<password>');
				 */
				getReferenceToken: (portalUrl: string, username: string, password: string, organizationPath?: string) => Promise<string>;
			};
		};
	}
}
