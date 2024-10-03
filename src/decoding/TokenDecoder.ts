import jwt from 'jsonwebtoken';
import config from "../config/Config";

const getSecret = () => {
    return config.verifying_key;
}

export interface ChangeRequestPayload {
    domain: string;
}

const generateToken = (subdomain: string) => {
    const payload: ChangeRequestPayload = {
        domain: subdomain
    }

    return jwt.sign(payload, getSecret());
}

const decodeToken = (token: string) => {
    try {
        return jwt.verify(token, getSecret()) as ChangeRequestPayload;
    } catch (e) {
        return null;
    }
}

const TokenDecoder = {
    generateToken,
    decodeToken
}

export default TokenDecoder;