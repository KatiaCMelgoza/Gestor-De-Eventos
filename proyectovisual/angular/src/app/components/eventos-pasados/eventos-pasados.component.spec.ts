import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventosPasadosComponent } from './eventos-pasados.component';

describe('EventosPasadosComponent', () => {
  let component: EventosPasadosComponent;
  let fixture: ComponentFixture<EventosPasadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventosPasadosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EventosPasadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
