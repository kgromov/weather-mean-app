import {Component, Inject, LOCALE_ID, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Season, SeasonTemperature} from "../../model/season-data";
import {ExportChart, SEASONS_CHART_CONFIG} from "../../model/chart-config";
import {ChartjsComponent} from "@ctrl/ngx-chartjs";
import {SeasonTemperatureService} from "../../services/season-temperatue.service";
import {ChartDataset} from "chart.js";
import {WeatherServiceService} from "../../services/weather-service.service";
import {Subject} from "rxjs";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {takeUntil} from "rxjs/operators";

enum AggregateType {
  MAX = 'MAX',
  MIN = 'MIN',
  AVG = 'AVG'
}

@Component({
  selector: 'app-season-temperature',
  templateUrl: './season-temperature.component.html',
})
export class SeasonTemperatureComponent implements OnInit, OnDestroy {
  availableYears: number [] = [];
  // FIXME: Add mapping to YearBySeasonTemperature
  data: SeasonTemperature[] = [];
  chartConfig: ExportChart = SEASONS_CHART_CONFIG;
  // @ts-ignore
  @ViewChild(ChartjsComponent, {static: false}) chart: ChartjsComponent;
  private $subject: Subject<void> = new Subject<void>();
  // @ts-ignore
  form: FormGroup;
  aggregateTypes: string[] = Object.keys(AggregateType);

  constructor(@Inject(LOCALE_ID) public locale: string,
              private weatherService: WeatherServiceService,
              private seasonService: SeasonTemperatureService,
              private fb: FormBuilder) {
  }

  ngOnInit(): void {
    console.log('Aggregate types = ', this.aggregateTypes);

    this.form = this.fb.group({
      aggregateType: AggregateType.AVG,
    });

    this.weatherService.getYearsToShow()
      .subscribe(years => {
        console.log('Years range = ', years);
        this.availableYears = [...Array(years || 14).keys()].map(i => i + 1)
      });

    this.seasonService.getSeasonsTemperature()
      .subscribe(data => {
        this.data = data;
        this.updateChartData(data);
      });

    this.aggregateType.valueChanges
      .pipe(takeUntil(this.$subject))
      .subscribe(value => {
        console.log('Aggregated by ', value);
        this.updateChartData(this.data);
      });
  }

  ngOnDestroy(): void {
    this.$subject.next();
    this.$subject.complete();
  }

  onAggregateChanged(aggregateType: string) {
    console.log('Selected aggregateType = ', aggregateType);
    this.aggregateType.setValue(aggregateType);
  }

  private updateChartData(data: SeasonTemperature[]): void {
    const labelsData: any[] = [];
    const winterData: any[] = [];
    const springData: any[] = [];
    const summerData: any[] = [];
    const autumnData: any[] = [];
    data
      .forEach(season => {
        console.log('season = ', season);
        labelsData.push(season.year);
        const temperature = this.getTemperatureByAggregate(season);
        switch (season.season) {
          case Season.WINTER:
            winterData.push(temperature);
            break;
          case Season.SPRING:
            springData.push(temperature);
            break;
          case Season.SUMMER:
            summerData.push(temperature);
            break;
          case Season.AUTUMN:
            autumnData.push(temperature);
            break;
          default:
            console.error(`Unknown season ${season}`);
            break;
        }
      });

    this.chartConfig.data.labels = [...new Set(labelsData)].sort();
    const datasets: ChartDataset[] = this.chartConfig.data.datasets;
    datasets[0].data = [...winterData];
    datasets[1].data = [...springData];
    datasets[2].data = [...summerData];
    datasets[3].data = [...autumnData];
    console.log('Chart data: ', this.chartConfig);
    // to trigger refresh
    this.chart.updateChart();
  }

  private getTemperatureByAggregate(season?: SeasonTemperature): number | undefined {
    const aggregate: string = this.aggregateType.value;
    switch (aggregate?.toLocaleUpperCase()) {
      case 'MIN':
        return season?.minTemp;
      case 'MAX':
        return season?.maxTemp;
      default:
        return season?.avgTemp;
    }
  }

  get aggregateType(): FormControl {
    return this.form.get('aggregateType') as FormControl;
  }
}
