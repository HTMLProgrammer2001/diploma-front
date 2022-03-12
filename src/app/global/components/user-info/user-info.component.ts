import {Component, ElementRef, EventEmitter, HostListener, isDevMode, OnInit, Output, ViewChild} from '@angular/core';
import {ConfigService} from '../../services/config.service';
import {AuthService} from '../../services/auth/auth.service';

@Component({
  selector: 'cr-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit {
  public avatarUrl = '';
  public show = false;
  public isDevelop: boolean;
  public appVersion: string;
  public userName: string;
  public initials: string;
  public companyName: string;

  @Output() onLogout: EventEmitter<void> = new EventEmitter();

  @ViewChild('anchor') public anchor: ElementRef;
  @ViewChild('popup', {read: ElementRef}) public popup: ElementRef;

  constructor(
    private configService: ConfigService,
    private authService: AuthService) {
    this.userName = authService.accessTokenModel?.fullName;
    this.avatarUrl = authService.accessTokenModel?.avatarUrl;
    this.initials = authService.accessTokenModel?.fullName
      .split(/\s/).reduce((acc, el) => acc + el[0].toUpperCase(), '') || '';
  }

  ngOnInit(): void {
    this.isDevelop = isDevMode();
    this.appVersion = this.configService.getVersion().appVersion;
  }

  @HostListener('keydown', ['$event'])
  public keydown(event: any): void {
    if (event.keyCode === 27) {
      this.toggle(false);
    }
  }

  @HostListener('document:click', ['$event'])
  public documentClick(event: any): void {
    if (!this.contains(event.target)) {
      this.toggle(false);
    }
  }

  public toggle(show?: boolean): void {
    this.show = show !== undefined ? show : !this.show;
    const header = document.getElementById('main-header');
    const popupTabs = document.getElementsByClassName('cr-custom-tab');

    if (this.show && popupTabs.length > 0) {
      header.classList.add('cr-header-no-shadow');
    } else {
      header.classList.remove('cr-header-no-shadow');
    }
  }

  private contains(target: any): boolean {
    return this.anchor.nativeElement.contains(target) ||
      (this.popup ? this.popup.nativeElement.contains(target) : false);
  }

  logout() {
    this.onLogout.emit();
  }
}
