export const createOrgDropdown = (elementId, dropdownOptions) => {

	const elementDropdown = document.getElementById(elementId);
	const optionsElement = elementDropdown.querySelector('.org-dropdown-options');
	const titleElement = elementDropdown.querySelector('.org-dropdown-title');
	const defaultText = '...';

	const dropdown = {
		selected: null,
		fill: null,
		getValue: null,
		onSelect: null,
		clear: null,
	};

	dropdown.clear = () => {
		optionsElement.innerHtml = '';
		optionsElement.classList.add('not-displayed');
		titleElement.textContent = defaultText;
		dropdown.selected = null;
	};

	const addItem = (itemObject) => {
		const item = document.createElement('li');
		item.setAttribute('data-value', itemObject.path);
		item.innerHTML = itemObject.name;
		optionsElement.append(item);
	};

	const selectItem = (name, value) => {
		dropdown.selected = { path: value, name };
		titleElement.textContent = name;
	};

	dropdown.onSelect = (e) => {
		const item = e.target;
		selectItem(item.textContent, item.dataset.value);
		optionsElement.querySelectorAll('li').forEach(li => li.classList.remove('selected'));
		item.classList.add('selected');
		optionsElement.classList.add('not-displayed');
		titleElement.classList.remove('focused');

		if (dropdownOptions && dropdownOptions.selectHandler) {
			dropdownOptions.selectHandler();
		}
	};

	dropdown.fill = (items) => {
		optionsElement.innerHTML = '';
		if (items) {
			items.forEach((item) => addItem(item));
			selectItem(items[0].name, items[0].path);
		}
	};

	dropdown.getValue = () => dropdown.selected;

	optionsElement.addEventListener('click', dropdown.onSelect);

	titleElement.addEventListener('click', () => {
		const optionsClasses = optionsElement.classList;
		if (optionsClasses.contains('not-displayed')) {
			optionsClasses.remove('not-displayed');
			titleElement.classList.add('focused');
		}
		else {
			optionsClasses.add('not-displayed');
			titleElement.classList.remove('focused');
		}
	});

	return dropdown;
};
