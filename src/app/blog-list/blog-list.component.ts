import { Component, OnInit } from '@angular/core';
import { BlogListService } from './blog-list.service';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.css']
})
export class BlogListComponent implements OnInit {
  private blogs: String[];
  constructor(private blogListService: BlogListService) { }

  ngOnInit() {
    this.loadBlogs();
  }

  private loadBlogs() {
    this.blogListService.loadBlogs$().subscribe(
      response => this.blogs = response.toString(),
      error => console.log(error)
    );
  }

  blogAddedHandler(blog) {
    this.blogListService.addBlogs$(blog).subscribe(
      response => this.loadBlogs(),
      error => console.log(error)
    );
  }

  deleteBlog(blog) {
    this.blogListService.deleteBlogs$(blog).subscribe(
      response => this.loadBlogs(),
      error => console.log(error)
    );
  }

}
