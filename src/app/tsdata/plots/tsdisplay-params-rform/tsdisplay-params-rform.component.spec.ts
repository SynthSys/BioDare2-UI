import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {TSDisplayParamsRFormComponent} from './tsdisplay-params-rform.component';
import {ReactiveFormsModule} from '@angular/forms';

describe('TSDisplayParamsRFormComponent', () => {
  let component: TSDisplayParamsRFormComponent;
  let fixture: ComponentFixture<TSDisplayParamsRFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [TSDisplayParamsRFormComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TSDisplayParamsRFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});