import { getOrganizationObjList, getUserRoles } from '../api';
import { createOrgDropdown } from '../orgDropdown';
import { executeTask } from '../loader';

const DefaultPortalUrl = '';
const DefaultUsername = '';

const RootKey = 'reportDesignerSample';
const PortalUrlKey = 'portalUrl';
const UsernameKey = 'username';

const setLocalStorageItem = (key, value) => {
	const localStorageStr = localStorage.getItem(RootKey);
	let localStorageObj;

	try {
		localStorageObj = localStorageStr ? JSON.parse(localStorageStr) : {};
	}
	finally {
		localStorageObj = localStorageObj || {};
	}

	localStorageObj[key] = value;
	localStorage.setItem(RootKey, JSON.stringify(localStorageObj));
};

const getLocalStorageItem = (key) => {
	try {
		const localStorageObj = JSON.parse(localStorage.getItem(RootKey));
		return localStorageObj[key] || null;
	}
	catch (e) {
		return null;
	}
};

export const createSignInForm = (signInHandler, confirmOrganizationHandler) => {
	const inputUrl = document.getElementById('sign-in-portal-url');
	const inputUsername = document.getElementById('sign-in-username');
	const inputPassword = document.getElementById('sign-in-password');
	const elementRoot = document.getElementById('sign-in-root');

	const elementError = document.getElementById('sign-in-error');
	const signInButton = document.getElementById('sign-in-button');
	const elementOrganizationRoot = document.getElementById('org-root');
	const selectOrganizationButton = document.getElementById('org-select-button');

	inputUrl.value = getLocalStorageItem(PortalUrlKey) || DefaultPortalUrl;
	inputUsername.value = getLocalStorageItem(UsernameKey) || DefaultUsername;
	inputPassword.value = '';

	const dropdownOptions = {};
	dropdownOptions.selectHandler = () => { selectOrganizationButton.focus(); };
	const orgDropdown = createOrgDropdown('org-dropdown', dropdownOptions);

	const refresh = () => {
		signInButton.disabled = false;
		elementError.innerHTML = '';
		elementOrganizationRoot.classList.add('not-displayed');
		orgDropdown.clear();
	};

	const signInForm = {
		open: () => {
			elementRoot.classList.remove('not-displayed');
			inputPassword.focus();
		},
		fillOrganizationList: async (portalUrl, referenceToken) => {
			try {
				const result = await executeTask(async () => {
					const organizationObjList = await getOrganizationObjList(portalUrl, referenceToken);
					return organizationObjList;
				});
				orgDropdown.fill(result);
				selectOrganizationButton.focus();
			}
			catch (error) {
				throw new Error('<div>Can\'t get organization list</div>');
			}
		},
		checkUserRoles: async (portalUrl, referenceToken) => {
			try {
				await executeTask(async () => {
					const userRoles = await getUserRoles(portalUrl, referenceToken);
					if (!userRoles.includes('create-report') || !userRoles.includes('view-report')) {
						throw new Error(`<div>You have not enough permissions to open Report Designer.</div>
						<div>Please try to specify another organization or username.</div>`);
					}
					return userRoles;
				});
			}
			catch (error) {
				throw new Error(error.message);
			}
		},
		close: () => {
			refresh();
			elementRoot.classList.add('not-displayed');
		},
		refresh,
		onSignIn: signInHandler,
		onConfirmOrganization: confirmOrganizationHandler,
	};

	const validate = () => {
		const isEmpty = (val) => !(val || '').trim();
		if (isEmpty(inputUrl.value)) {
			inputUrl.focus();
			throw new Error('Portal URL is required.');
		}
		if (isEmpty(inputUsername.value)) {
			inputUsername.focus();
			throw new Error('Username is required.');
		}
	};

	const onSignIn = async () => {
		const portalUrl = inputUrl.value;
		const username = inputUsername.value;
		const password = inputPassword.value;
		try {
			validate();
			signInButton.disabled = true;
			await executeTask(async () => {
				await signInForm.onSignIn(portalUrl, username, password);
			});
			elementError.innerHTML = '';
			elementOrganizationRoot.classList.remove('not-displayed');
		}
		catch (error) {
			signInButton.disabled = false;
			elementError.innerHTML = error.message;
		}
	};

	const onConfirmOrganization = async () => {
		try {
			const portalUrl = inputUrl.value;
			const username = inputUsername.value;
			const password = inputPassword.value;
			const organizationPath = orgDropdown.getValue();
			await executeTask(async () => {
				await signInForm.onConfirmOrganization(portalUrl, username, password, organizationPath);
			});
		}
		catch (error) {
			signInButton.disabled = false;
			elementError.innerHTML = error.message;
		}
	};

	const onInputUser = (e) => {
		refresh();
		setLocalStorageItem(UsernameKey, e.target.value);
	};

	const onInputUrl = (e) => {
		refresh();
		setLocalStorageItem(PortalUrlKey, e.target.value);
	};

	const onInputPassword = () => {
		refresh();
	};

	signInButton.onclick = onSignIn;
	selectOrganizationButton.onclick = onConfirmOrganization;

	inputUrl.oninput = onInputUrl;
	inputUsername.oninput = onInputUser;
	inputPassword.oninput = onInputPassword;

	elementRoot.addEventListener('keyup', async (event) => {
		if (event.keyCode !== 13) return;
		if (elementOrganizationRoot.classList.contains('not-displayed')) {
			await onSignIn();
		}
	});

	return signInForm;
};
