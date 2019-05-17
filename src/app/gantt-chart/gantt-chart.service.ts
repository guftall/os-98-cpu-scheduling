import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Job } from '../Job';

@Injectable()
export class GanttChartService {

  private jobs = new Subject<Job>();
  $jobs = this.jobs.asObservable();

  private $$startChart = new Subject<any>();
  $startChart = this.$$startChart.asObservable();

  private $$stopChart = new Subject<any>();
  $stopChart = this.$$stopChart.asObservable();

  addJob(job: Job) {
    this.jobs.next(job);
  }

  startChart() {
    this.$$startChart.next();
  }

  stopChart() {
    this.$$stopChart.next();
  }
}
