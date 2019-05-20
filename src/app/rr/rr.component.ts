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
  }
  jobReceived(jobId: string) {

    var index = +jobId;
    var j = this.scheduler.jobs[index];
    this.scheduler.jobReceived(j);
  }
}

export const RR_QUANTOM = 50;
class RoundRobinScheduler implements Scheduler {
  jobs: Job[];
  _current: Job;
  jobQueue: Job[];

  constructor() {
    this.jobQueue = [];
    this.jobs = [];
  }
  next(): Job {
    if (this.jobQueue.length == 0) {
      return undefined;
    }

    var next = this.jobQueue.splice(this.jobQueue.length - 1, 1)[0];
    next.quantum = RR_QUANTOM;
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
    if (this._current.remainingTime == 0) {

      console.log(`Job ${this._current.name()} finished`);
      this._current = this.next();
    } else if (this._current.quantum < 1) {

      this.jobQueue.splice(0, 0, this._current);
      this._current = this.next();
    }
    return this._current;
  };
  add(job: Job) {
    if (job.burstTime < 0 || job.arrivalTime < 0) {
      return;
    }
    this.jobs.push(job);
  }
  jobReceived(job: Job) {

    job.remainingTime = job.burstTime;
    this.jobQueue.splice(0, 0, job);
    console.log(`Job ${job.name.bind(job)()} entered`)
  }
  reset() {
    this.jobQueue.splice(0, this.jobQueue.length);
    this._current = undefined;
  }

}
