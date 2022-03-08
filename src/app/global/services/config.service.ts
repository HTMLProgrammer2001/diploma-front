import {Injectable} from '@angular/core';
import {Config} from '../types/config';
import {Version} from '../types/version';

@Injectable()
export class ConfigService {
  public config: Config;
  public version: Version;

  static getInstance(config: Config, version: Version) {
    const configService = new ConfigService();

    configService.config = config;
    configService.version = version;

    return configService;
  }

  getConfig(): Config {
    return this.config;
  }
  getVersion(): Version {
    return this.version;
  }
}
