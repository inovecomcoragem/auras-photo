import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';

@Injectable()
export class SensorService {
  private SENSOR_SERVER_URL = environment.sensorURL;

  constructor(private http: HttpClient) { }

  getTouch(): any {
    return this.http.get(this.SENSOR_SERVER_URL + '/get-touch/');
  }

  setLight(lightVal: string): any {
    return this.http.get(this.SENSOR_SERVER_URL + '/set-light/' + lightVal);
  }
}
