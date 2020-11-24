import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FbCreateResponse, Post} from './interfaces';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class PostsService {

  constructor(private http: HttpClient) {
  }

  public createPost(post: Post): Observable<Post> {
    return this.http.post(`${environment.fbDataBaseUrl}/posts.json`, post)
      .pipe(map((response: FbCreateResponse) => {

        return {
          ...post,
          id: response.name,
          date: new Date(post.date)
        };
      }));
  }

  public getAllPosts(): Observable<Post[]> {
    return this.http.get(`${environment.fbDataBaseUrl}/posts.json`)
      .pipe(
        map((response: {[key: string]: any}) => {

        return Object.keys(response)
          .map(key => ({
          ...response[key],
          id: key,
          date: new Date(response[key].date)
        }));
      }));
  }

  public deletePost(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.fbDataBaseUrl}/posts/${id}.json`);
  }
}
