import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Config{
  url: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  public url: string;

  constructor(private http: HttpClient) {}

  /**
   * Loads the config.json from the static folder and sets this.url
   */
  public async load(): Promise<Config> {
    const config =  await this.http
      .get<Config>('assets/config.json')
      .toPromise()
      this.url = config.url;
    return config
  }

}