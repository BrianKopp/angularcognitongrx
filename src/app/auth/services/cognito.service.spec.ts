import { TestBed, inject } from '@angular/core/testing';

import { CognitoService } from './cognito.service';

describe('CognitoServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CognitoService]
    });
  });

  it('should be created', inject([CognitoService], (service: CognitoService) => {
    expect(service).toBeTruthy();
  }));
});
