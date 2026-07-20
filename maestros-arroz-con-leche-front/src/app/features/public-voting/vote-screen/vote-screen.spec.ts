import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoteScreen } from './vote-screen';

describe('VoteScreen', () => {
  let component: VoteScreen;
  let fixture: ComponentFixture<VoteScreen>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoteScreen]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoteScreen);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
