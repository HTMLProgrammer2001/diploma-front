import {Component, OnInit} from '@angular/core';
import {PreloaderService} from '../../services/preloader.service';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'cr-preloader',
  templateUrl: './preloader.component.html',
  styleUrls: ['./preloader.component.scss']
})
export class PreloaderComponent implements OnInit {

  public preloaderState$: BehaviorSubject<boolean>;

  constructor(private preloaderService: PreloaderService) {
  }

  ngOnInit(): void {
    this.preloaderState$ = this.preloaderService.preloaderState;
  }
}
