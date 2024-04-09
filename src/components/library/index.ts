export const concatUrls = (...urls:String[]) => {
    const skipNullOrEmpty = (value:any) => !!value;
    const trimLeft = (value:any, char:any) => (value.substr(0, 1) === char ? value.substr(1) : value);
    const trimRight = (value:any, char:any) => (value.substr(value.length - 1) === char ? value.substr(0, value.length - 1) : value);
    return urls
        .map(x => x && x.trim())
        .filter(skipNullOrEmpty)
        .map((x, i) => (i > 0 ? trimLeft(x, '/') : x))
        .map((x, i, arr) => (i < arr.length - 1 ? trimRight(x, '/') : x))
        .join('/');
};

const defaultHeaders = {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    Accept: 'application/json',
    'content-type': 'application/json',
    'pragma': 'no-cache',
};

const makeHeaders = (referenceToken:any) => ({ ...defaultHeaders, 'Reference-Token': referenceToken });

const postGraphQlRequest = async (portalUrl:any, referenceToken:any, requestPayload:any) => {
    const url = concatUrls(portalUrl, 'api/graphql');
    const init = {
        headers: makeHeaders(referenceToken),
        method: 'post',
        body: JSON.stringify(requestPayload),
    };

    const response = await fetch(url, init);
    if (!response.ok) throw new Error(`${url} status code ${response.status}`);

    const result = await response.json();
    return result;
};

export const getReportList = async (portalUrl:any, referenceToken:any) => {
    const result = await postGraphQlRequest(portalUrl, referenceToken, {
        query: 'query { documenttypes(key:"rdl") { documents { id, title } } }',
    });
    const { documents } = result.data.documenttypes[0];
    const list = documents.map((x:any) => ({ id: x.id, name: x.title }));
    list.sort((x:any, y:any) => x.name.localeCompare(y.name));
    return list;
};

export const getReportInfo = async (portalUrl:any, referenceToken:any) => {
    const result = await postGraphQlRequest(portalUrl, referenceToken, {
        query: 'query { me { language, themeName } }',
    });
    const { data: { me: { language, themeName } } } = result;
    return {
        //pluginVersion: version,
        theme: themeName,
        locale: language,
    };
};