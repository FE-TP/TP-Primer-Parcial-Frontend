import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Jaulas } from './jaulas';

describe('Jaulas', () => {
  let component: Jaulas;
  let fixture: ComponentFixture<Jaulas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Jaulas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Jaulas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
