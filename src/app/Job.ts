export class Job {
  id: number;
  arrivalTime: number;
  burstTime: number;

  quantum: number;
  remainingTime: number;

  backgroundColor: string;

  constructor() {
    this.burstTime = 0;
    this.arrivalTime = 0;
    this.remainingTime = 0;
    this.backgroundColor = getRandomColor();
  }

  name() {
    return 'P' + this.id;
  }
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
