import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SrtnComponent } from './srtn.component';

describe('SrtnComponent', () => {
  let component: SrtnComponent;
  let fixture: ComponentFixture<SrtnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SrtnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SrtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
