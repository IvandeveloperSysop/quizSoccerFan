import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SliderModalPage } from './slider-modal.page';

describe('SliderModalPage', () => {
  let component: SliderModalPage;
  let fixture: ComponentFixture<SliderModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SliderModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SliderModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
