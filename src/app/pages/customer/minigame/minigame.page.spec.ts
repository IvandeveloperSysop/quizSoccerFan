import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MinigamePage } from './minigame.page';

describe('MinigamePage', () => {
  let component: MinigamePage;
  let fixture: ComponentFixture<MinigamePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MinigamePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MinigamePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
