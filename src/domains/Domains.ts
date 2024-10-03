import config from "../config/Config";

export interface CloudflareDomain {
    id: string;
    zone_id: string;
}

export const getDomainData = (): CloudflareDomain[]  => {
    return config.domains;
}