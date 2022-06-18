import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PositionsPage } from './positions.page';

describe('PositionsPage', () => {
  let component: PositionsPage;
  let fixture: ComponentFixture<PositionsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PositionsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PositionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
