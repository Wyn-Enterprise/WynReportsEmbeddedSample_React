const elementLoader = document.getElementById('app-loader');

export const executeTask = async (runTask) => {
	try {
		elementLoader.classList.remove('not-displayed');
		const result = await runTask();
		return result;
	}
	finally {
		elementLoader.classList.add('not-displayed');
	}
};
