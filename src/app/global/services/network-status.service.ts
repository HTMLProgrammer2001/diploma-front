import {fromEvent, merge, Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class NetworkStatusService {
  public online = true;

  public online$: Observable<boolean> = merge(
    fromEvent(window, 'online'),
    fromEvent(window, 'offline'),
  ).pipe(
    map(value => value.type === 'online'),
    tap(value => this.online = value)
  );

  constructor() {
    this.online$.subscribe(_ => _);
  }
}
