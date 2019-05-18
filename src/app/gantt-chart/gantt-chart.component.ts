import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Job } from '../Job';
import { GanttChartService } from './gantt-chart.service';
import { Subscription } from 'rxjs';
import { Scheduler } from '../Scheduler';

export const TIMER_MS = 50;
@Component({
  selector: 'app-gantt-chart',
  templateUrl: './gantt-chart.component.html',
  styleUrls: ['./gantt-chart.component.css']
})
export class GanttChartComponent implements OnInit, OnDestroy {

  @Input() scheduler: Scheduler;
  startSubscription: Subscription;
  stopSubscription: Subscription;
  timer;
  parts: GanttPart[];
  isIdle: boolean;
  prev: Job;
  constructor(
    private ganttChartService: GanttChartService
  ) {
    this.parts = [];
    this.parts.push({length: 0, color: "", margin: 0, name: ""})
    this.isIdle = false;
    this.startSubscription = ganttChartService.$startChart.subscribe(() => {
      this.start.bind(this)();
    })
    this.stopSubscription = ganttChartService.$stopChart.subscribe(() => {
      this.stopTimer.bind(this)();
    })

  }

  ngOnInit() {
  }
  calculateMargin(index: number) {
    var r = 0;
    for (var i=0; i<index; i++){
      r += this.parts[i].length;
    }
    return r;
  }
  start() {
    let that = this;
    if (this.timer != undefined)
    {
      alert('Timer is already started');
      return;
    }

    var allJobs = that.scheduler.jobs;
    for (var i=0; i<allJobs.length; i++) {

      var j = allJobs[i];
      j.remainingTime = j.burstTime;
      that.doWork(i);
    }

    this.timer = setInterval(() => {

      var current: Job = that.scheduler.current.bind(that.scheduler)();

      if (current == undefined && !that.isIdle) {
        that.isIdle = true;

        var part = new GanttPart();
        part.name = "";
        part.color = "#e51c23";
        that.parts.push(part);
        part.margin = that.calculateMargin.bind(that)(that.parts.length - 1);
      }
      else if (current != undefined) {

        that.isIdle = false;
        --current.quantum;
        --current.remainingTime;

        if (that.prev != current) {

          that.prev = current;
          var part = new GanttPart();
          part.name = that.scheduler._current.name();
          part.color = current.backgroundColor;
          that.parts.push(part);
          part.margin = that.calculateMargin.bind(that)(that.parts.length - 1);
        }
      }

      ++that.parts[that.parts.length - 1].length;


    }, TIMER_MS)
  }

  doWork(index: number) {

    var that = this;
    setTimeout(() => {
      var j = that.scheduler.jobs[index];
      that.scheduler.jobQueue.splice(0, 0, j);
      console.log(`Job ${j.name.bind(j)()} entered`)
    }, that.scheduler.jobs[index].arrivalTime * TIMER_MS);
  }
  stopTimer() {
    clearInterval(this.timer);
    this.timer = undefined;
    this.parts = [];
    this.isIdle = false;
    this.prev = undefined;
    this.scheduler.reset();
  }
  ngOnDestroy(): void {
    this.startSubscription.unsubscribe();
    this.stopSubscription.unsubscribe();
  }
}

class GanttPart {
  name: string;
  length: number;
  margin: number;
  color: string;

  constructor() {
    this.length = 0;
  }
}

