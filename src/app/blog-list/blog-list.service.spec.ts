import { TestBed } from '@angular/core/testing';

import { BlogListService } from './blog-list.service';

describe('BlogListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BlogListService = TestBed.get(BlogListService);
    expect(service).toBeTruthy();
  });
});
