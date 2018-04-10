import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class SensorService {
  private SENSOR_SERVER_URL = 'http://192.168.0.102:8000';
  constructor(private http: HttpClient) { }

  getTouch(): any {
    return this.http.get(this.SENSOR_SERVER_URL + '/get-touch/');
  }

  setLight(lightVal: string): any {
    return this.http.get(this.SENSOR_SERVER_URL + '/set-light/' + lightVal);
  }
}
