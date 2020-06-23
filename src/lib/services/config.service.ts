import { Optional } from '@angular/core';
import { IConfig } from '../interfaces/config.interface';

export class ConfigService {

  endPoint: string;

  constructor(@Optional() config: IConfig) {
    if (config) {
      this.endPoint = config.endPoint;
    }
  }
}
