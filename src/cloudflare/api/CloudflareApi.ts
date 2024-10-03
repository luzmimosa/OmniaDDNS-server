import axios from 'axios';
import {DnsRecordResponse} from "./ResponseModels";
import config from "../../config/Config";

const buildUrl = (endpoint: string) => {
    return `${config.cloudflare_api_url}${endpoint}`;
}

const getToken = () => {
    return config.cloudflare_token;
}

const getCall = async (endpoint: string, headers: any = {}) => {
    const url = buildUrl(endpoint);

    const response = await axios.get(url, {
        headers: {
            ...headers,
            'Authorization': `Bearer ${getToken()}`,
            'Content-Type': 'application/json'
        }
    })

    if (response.data?.success === false) {
        throw new Error(response.data.errors[0].message);
    }

    return response.data;
}
const postCall = async (endpoint: string, body: any, headers: any = {}) => {
    const url = buildUrl(endpoint);

    const response = await axios.post(url, body, {
        headers: {
            ...headers,
            'Authorization': `Bearer ${getToken()}`,
            'Content-Type': 'application/json'
        }
    })

    if (response.data?.success === false) {
        throw new Error(response.data.errors[0].message);
    }

    return response.data;
}
const patchCall = async (endpoint: string, body: any, headers: any = {}) => {
    const url = buildUrl(endpoint);

    const response = await axios.patch(url, body, {
        headers: {
            ...headers,
            'Authorization': `Bearer ${getToken()}`,
            'Content-Type': 'application/json'
        }
    })

    if (response.data?.success === false) {
        throw new Error(response.data.errors[0].message);
    }

    return response.data;
}

export const requestDnsData = async (zoneId: string): Promise<Array<DnsRecordResponse>> => {
    const endpoint = `/zones/${zoneId}/dns_records`

    try {
        const response =  await getCall(endpoint);

        const records: Array<DnsRecordResponse> = []
        response.result.forEach(record => {
            records.push({
                id: record.id,
                type: record.type,
                name: record.name,
                content: record.content
            });
        });

        return records;

    } catch (e) {
        return [];
    }
}

export const createARecord = async (
    zoneId: string,
    name: string,
    content: string,
    comment: string = "",
    useProxy: boolean = false,
    settings: any = {},
    tags: Array<string> = [],
    ttl: number = 1,
) => {
    const endpoint = `/zones/${zoneId}/dns_records`;
    const body = {
        type: "A",
        name: name,
        content: content,
        ttl: ttl,
        proxied: useProxy,
        settings: settings,
        tags: tags,
        comment: comment
    }

    try {
        const response = await postCall(endpoint, body);

        return response.result;
    } catch (e) {
        console.error(e);
        return null;
    }
}

export const updateARecord = async (
    zoneId: string,
    recordId: string,
    name: string,
    content: string,
    comment: string = "",
    useProxy: boolean = false,
    settings: any = {},
    tags: Array<string> = [],
    ttl: number = 1,
) => {
    const endpoint = `/zones/${zoneId}/dns_records/${recordId}`;
    const body = {
        type: "A",
        name: name,
        content: content,
        ttl: ttl,
        proxied: useProxy,
        settings: settings,
        tags: tags,
        comment: comment
    }

    try {
        const response = await patchCall(endpoint, body);

        return response.result;
    } catch (e) {
        console.error(e);
        return null;
    }
}