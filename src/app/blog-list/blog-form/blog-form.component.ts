import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-blog-form',
  templateUrl: './blog-form.component.html',
  styleUrls: ['./blog-form.component.css']
})
export class BlogFormComponent implements OnInit {

  @Output()
  blogAdded = new EventEmitter();

  public blog: String = null;

  addBlog() {
    let userInfo;
    this.authService.userProfile$.subscribe((user) =>{
      let blogEntry = {
        createdOn: new Date(),
        createdBy: user.nickname,
        updatedOn: new Date(),
        updatedBy: user.nickname,
        contents: this.blog
      }
      this.blogAdded.emit(blogEntry);
      this.blog = null;
    })
  }
  constructor(private authService : AuthService) { }

  ngOnInit() {
  }

}
