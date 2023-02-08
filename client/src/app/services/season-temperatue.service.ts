import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {SeasonTemperature, YearSummary} from "../model/season-data";

@Injectable({
  providedIn: 'root'
})
export class SeasonTemperatureService {
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {
  }

  public getYearSummary(years?: number): Observable<YearSummary[]> {
    const params: any = {};
    if (years) {
      params.years = years;
    }
    return this.http.get<YearSummary[]>(`${this.baseUrl}/weather/summary`, {params: params});
  }

  public getSeasonsTemperature(years?: number): Observable<SeasonTemperature[]> {
    const params: any = {};
    if (years) {
      params.years = years;
    }
    return this.http.get<SeasonTemperature[]>(`${this.baseUrl}/weather/seasonsInYear`, {params: params});
  }
}
