import { Injectable, Optional } from '@angular/core';
import { IConfig } from '../interfaces/config.interface';

@Injectable()
export class ConfigService {

  endPoint: string;

  constructor(@Optional() config: IConfig) {
    if (config) {
      this.endPoint = config.endPoint;
    }
  }
}
