import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {PPAJobParamsRFormComponent} from './ppajob-params-rform.component';
import {ModalModule} from 'ngx-bootstrap/modal';
import {StaticContentTestModule} from '../../../../documents/static-content_test_tool.spec';


describe('PPAJobParamsRFormComponent', () => {
  let component: PPAJobParamsRFormComponent;
  let fixture: ComponentFixture<PPAJobParamsRFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        // StaticContentModule,
        StaticContentTestModule,
        ReactiveFormsModule,
        ModalModule.forRoot(),
      ],
      declarations: [PPAJobParamsRFormComponent],
      providers: []
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PPAJobParamsRFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});