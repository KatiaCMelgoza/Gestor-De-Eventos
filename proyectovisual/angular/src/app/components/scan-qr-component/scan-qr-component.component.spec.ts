import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScanQrComponentComponent } from './scan-qr-component.component';

describe('ScanQrComponentComponent', () => {
  let component: ScanQrComponentComponent;
  let fixture: ComponentFixture<ScanQrComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScanQrComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ScanQrComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
