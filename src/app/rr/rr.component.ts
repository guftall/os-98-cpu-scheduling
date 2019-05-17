import { Component, OnInit } from '@angular/core';
import { GanttChartService } from '../gantt-chart/gantt-chart.service';
import { Scheduler } from '../Scheduler';
import { Job } from '../Job';
import { TIMER_MS } from '../gantt-chart/gantt-chart.component';

@Component({
  selector: 'app-rr',
  templateUrl: './rr.component.html',
  styleUrls: ['./rr.component.css'],
  providers: [GanttChartService]
})
export class RrComponent implements OnInit {

  scheduler: Scheduler
  constructor(
    private gChartService: GanttChartService
  ) {
    this.scheduler = new RoundRobinScheduler();
  }

  ngOnInit() {
    var that = this;
    this.gChartService.startChart();
    var job = new Job();
    job.id = 1;
    job.burstTime = 100;
    job.enterTime = 0;
    that.scheduler.add(job);

    var job = new Job();
    job.id = 2;
    job.burstTime = 100;
    job.enterTime = 0;
    that.scheduler.add(job);

    var job = new Job();
    job.id = 3;
    job.burstTime = 80;
    job.enterTime = 80;
    that.scheduler.add(job);
  }
}

export const RR_QUANTOM = 50;
class RoundRobinScheduler implements Scheduler {
  _current: Job;
  jobQueue: Job[];

  constructor() {
    this.jobQueue = [];
  }
  next(): Job {
    if (this.jobQueue.length == 0) {
      return undefined;
    }

    var next = this.jobQueue.splice(this.jobQueue.length - 1, 1)[0];
    next.quantum = RR_QUANTOM;
    console.log(this.jobQueue)
    return next;
  };
  current(): Job {

    if (this._current == undefined) {
      if (this.jobQueue.length > 0) {
        this._current = this.next();
      } else {
        return undefined;
      }
    }
    if (this._current.remainingTime < 1) {

      console.log(`Job ${this._current.name()} finished`);
      this._current = this.next();
    } else if (this._current.quantum < 1) {

      this.jobQueue.splice(0, 0, this._current);
      this._current = this.next();
    }
    return this._current;
  };
  add(job: Job) {
    if (job.burstTime < 0 || job.enterTime < 0) {
      return;
    }

    job.remainingTime = job.burstTime;

    var that = this;
    setTimeout(() => {
      that.jobQueue.splice(0, 0, job);
      console.log(`Job ${job.name()} entered`)
    }, job.enterTime * TIMER_MS)
  }

}
