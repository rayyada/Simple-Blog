import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BlogListService {
  private static SIMPLE_BLOG_ENDPOINT = 'https://us-central1-simple-blog-407c5.cloudfunctions.net/app';
  constructor(private http: HttpClient) { }

  loadBlogs$(): Observable<any> {
    return this.http.get(BlogListService.SIMPLE_BLOG_ENDPOINT, this.addHeaders());
  }
  addBlogs$(task): Observable<any> {
    return this.http.post(BlogListService.SIMPLE_BLOG_ENDPOINT, { content: task }, this.addHeaders());
  }
  deleteBlogs$(task): Observable<any> {
    return this.http.delete(BlogListService.SIMPLE_BLOG_ENDPOINT + '?id=' + task._id, this.addHeaders());
  }

  addHeaders() {
    var access_token = localStorage.getItem('access_token');
    return { headers: new HttpHeaders().set("authorization", `Bearer
    ${access_token}`)};
  }
}
