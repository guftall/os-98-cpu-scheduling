import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Job } from '../Job';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css']
})
export class JobsComponent implements OnInit {

  @Input("jobs") private jobs: Job[];
  constructor() {
  }

  ngOnInit() {
  }
  addJob() {

    var job = new Job();
    job.id = this.jobs.length + 1;
    this.jobs.push(job);
  }

}
