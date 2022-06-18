import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HomeModalPage } from './home-modal.page';

describe('HomeModalPage', () => {
  let component: HomeModalPage;
  let fixture: ComponentFixture<HomeModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
