import {startServer} from "./daemon/DdnsDaemon";
import config, {writeTokensFromConfig} from "./config/Config";

writeTokensFromConfig(config);
startServer();