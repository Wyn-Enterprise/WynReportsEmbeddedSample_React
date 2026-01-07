export interface Report {
    id: string;
    name: string;
}

export const concatUrls = (...urls: string[]) => {
    const skipNullOrEmpty = (value: any) => !!value;
    const trimLeft = (value: string, char: string) => (value.substring(0, 1) === char ? value.substring(1) : value);
    const trimRight = (value: string, char: string) => (value.substring(value.length - 1) === char ? value.substring(0, value.length - 1) : value);
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

const makeHeaders = (referenceToken: string) => ({ ...defaultHeaders, 'Reference-Token': referenceToken });

const postGraphQlRequest = async (portalUrl: string, referenceToken: string, requestPayload: any) => {
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

export const getReportList = async (portalUrl: string, referenceToken: string): Promise<Report[]> => {
    const result = await postGraphQlRequest(portalUrl, referenceToken, {
        query: 'query { documenttypes(key:"rdl") { documents { id, title } } }',
    });
    
    if (!result?.data?.documenttypes?.[0]?.documents) {
        return [];
    }

    const { documents } = result.data.documenttypes[0];
    const list = documents.map((x: any) => ({ id: x.id, name: x.title }));
    list.sort((x: Report, y: Report) => x.name.localeCompare(y.name));
    return list;
};
