import {HttpClientTestingModule} from '@angular/common/http/testing';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import {NgbActiveModal, NgbModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';
import { StaticAnalysisConfigFormComponent } from './static-analysis-config-form.component';
import {DashboardService} from '../../../shared/dashboard.service';
import {CollectorService} from '../../../shared/collector.service';
import {Observable, of} from 'rxjs';
import {StaticAnalysisModule} from '../static-analysis.module';

class MockCollectorService {
  mockCollectorData = {
    id: '4321',
    description: 'sonar : analysis1',
    collectorId: '1234',
    collector: {
      id: '1234',
      name: 'sonar',
      collectorType: 'CodeQuality'
    }
  };

  getItemsById(id: string): Observable<any> {
    return of(this.mockCollectorData);
  }
}

class MockDashboardService {
  mockDashboard = {
    title: 'dashboard1',
    application: {
      components: [{
        collectorItems: {
          CodeQuality: [{
            id: '1234',
            description: 'sonar : analysis1'
          }]
        }
      }]
    }
  };
  dashboardConfig$ = of(this.mockDashboard);
}

describe('StaticAnalysisConfigFormComponent', () => {
  let component: StaticAnalysisConfigFormComponent;
  let fixture: ComponentFixture<StaticAnalysisConfigFormComponent>;
  let dashboardService: DashboardService;
  let collectorService: CollectorService;
  let modalService: NgbModule;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [StaticAnalysisModule, ReactiveFormsModule, NgbModule, SharedModule, HttpClientTestingModule],
      declarations: [ ],
      providers: [{ provide: NgbActiveModal, useClass: NgbActiveModal },
        { provide: CollectorService, useClass: MockCollectorService},
        { provide: DashboardService, useClass: MockDashboardService}]
    })
    .compileComponents();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StaticAnalysisConfigFormComponent);
    component = fixture.componentInstance;
    dashboardService = TestBed.inject(DashboardService);
    collectorService = TestBed.inject(CollectorService);
    modalService = TestBed.inject(NgbModal);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should getStaticAnalysisTitle', () => {
    const collectorItem = {
      description : 'example-repo',
      niceName : 'example',
    };
    expect(component.getStaticAnalysisTitle(collectorItem)).toEqual('example : example-repo');
    expect(component.getStaticAnalysisTitle(null)).toEqual('');
  });

  it('should set widgetConfig', () => {
    const widgetConfigData = {
      options: {
        id: 123,
      }
    };
    component.widgetConfig = widgetConfigData;
    component.widgetConfig = null;
  });

  it('should call ngOnInit()', () => {
    component.ngOnInit();
  });

  it('should have an initial static config form', () => {
    const widgetConfigData = {
      options: {
        id: 123,
      }
    };
    component.widgetConfig = widgetConfigData;
    expect(component.staticAnalysisConfigForm).toBeDefined();
  });

  it('should assign selected job after submit', () => {
    component.createForm();
    expect(component.staticAnalysisConfigForm.get('staticAnalysisJob').value).toEqual('');
    component.staticAnalysisConfigForm = component.formBuilder.group({staticAnalysisJob: 'sonarJob1'});
    component.submitForm();
    expect(component.staticAnalysisConfigForm.get('staticAnalysisJob').value).toEqual('sonarJob1');
  });

  it('should load saved static analysis job', () => {
    component.loadSavedCodeQualityJob();
    collectorService.getItemsById('4321').subscribe(result => {
      expect(component.staticAnalysisConfigForm.get('staticAnalysisJob').value).toEqual(result);
    });
  });

});
