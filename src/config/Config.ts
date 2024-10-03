import fs from 'fs';
import path from 'path';
import { CloudflareDomain } from "../domains/Domains";
import TokenDecoder from "../decoding/TokenDecoder";

interface Config {
    port: number;
    verifying_key: string;
    cloudflare_api_url: string;
    cloudflare_token: string;
    domains: CloudflareDomain[];
}

const configPath = path.resolve(__dirname, '../../config.json');

const defaultConfig: Config = {
    port: 0,
    cloudflare_api_url: "https://api.cloudflare.com/client/v4",
    verifying_key: '',
    cloudflare_token: '',
    domains: []
};

export const writeTokensFromConfig = (config: Config) => {
    const tokensFilePath = path.resolve(__dirname, '../../addresses.tokens');

    // Si el archivo existe, borrarlo
    if (fs.existsSync(tokensFilePath)) {
        fs.unlinkSync(tokensFilePath);
    }

    // Crear un nuevo archivo addresses.tokens
    const tokens = config.domains.map(domain => {
        const token = TokenDecoder.generateToken(domain.id);
        return `${domain.id}: ${token}`;
    }).join('\n');

    fs.writeFileSync(tokensFilePath, tokens, 'utf-8');
}

const readConfig = (): Config => {
    if (!fs.existsSync(configPath)) {
        fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2), 'utf-8');
    }

    try {
        const data = fs.readFileSync(configPath, 'utf-8');
        return JSON.parse(data) as Config;
    } catch (error) {
        throw new Error(`Error reading config file: ${error.message}`);
    }
}

const config = readConfig();

export default config;