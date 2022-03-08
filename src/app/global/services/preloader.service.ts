import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {uniqueId} from '../../shared/utils';

@Injectable({
  providedIn: 'root'
})
export class PreloaderService {
  public preloaderState: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public setOfRequests = new Set<string>();
  public preloaderStopTimer: any;

  start(): string {
    this.preloaderState.next(true);
    const requestId = uniqueId();
    this.setOfRequests.add(requestId);
    this.stopPreloader(30 * 1000);
    return requestId;
  }

  stop(requestId: string): void {
    this.setOfRequests.delete(requestId);
    if (this.setOfRequests.size === 0){
      this.stopPreloader(300);
    }
  }

  private stopPreloader(interval: number): void {
    if (!!this.preloaderStopTimer) {
      clearTimeout(this.preloaderStopTimer);
    }
    this.preloaderStopTimer = setTimeout(() => {
      this.setOfRequests.clear();
      this.preloaderState.next(false);
    }, interval);
  }
}
