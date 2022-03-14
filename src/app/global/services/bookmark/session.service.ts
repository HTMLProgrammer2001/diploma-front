import {Injectable} from '@angular/core';
import {uniqueId} from '../../../shared/utils';
import {isNil} from 'lodash';
import moment from 'moment';
import * as LocalForage from 'localforage';
import {ConfigService} from '../config/config.service';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  public currentSessionId: string;
  private storeBookmarkExpirePeriodHours;
  private dateTimeFormat = 'DD.MM.YYYY HH:mm:ss';

  constructor(private configService: ConfigService) {
    this.init();
    this.storeBookmarkExpirePeriodHours = configService.getConfig().storeBookmarkExpirePeriodHours;
  }

  public init(): void {
    // get or create new session id
    this.currentSessionId = sessionStorage.getItem('session');
    this.currentSessionId = this.currentSessionId ? this.currentSessionId : uniqueId();
    sessionStorage.setItem('session', this.currentSessionId);

    // find or create current session
    const currentSession = this.getCurrentSession();
    this.extendCurrentSessionExpirationTime();
    const sessions = this.getSessionList();

    // current session was not created yet, create new session
    if (isNil(currentSession)) {
      sessions.push({
        id: this.currentSessionId,
        expirationTime: (moment()).add(this.storeBookmarkExpirePeriodHours, 'hour').format(this.dateTimeFormat),
      });
    }

    // check all sessions
    sessions.forEach((session, index) => {
      // delete expired session
      if (moment().diff(moment(session.expirationTime, this.dateTimeFormat), 'hour') >= this.storeBookmarkExpirePeriodHours) {
        this.deleteSessionById(session.id);
        sessions.splice(index, 1);
      }
    });

    this.setSessionList(sessions);
  }

  /**
   * Get current Session
   */
  public getCurrentSession(): Session {
    return this.getSessionList().find(s => s.id === this.currentSessionId);
  }

  /**
   * Get sessions list
   */
  public getSessionList(): Array<Session> {
    try {
      return JSON.parse(localStorage.getItem('sessions')) as Array<Session> || [];
    } catch (e) {
      return [];
    }
  }

  /**
   * Delete session by session id
   * Also delete IndexDB database
   */
  public deleteSessionById(sessionId: string): void {
    // try to clear IndexDB storage
    const dbname = `bookmarks_${sessionId}`;

    LocalForage.dropInstance({name: dbname}).then(_ => _);
    LocalForage.dropInstance({name: `localforage`}).then(_ => _);

    // delete from session storage
    this.setSessionList(this.getSessionList().filter(value => value.id !== sessionId));
  }

  /**
   * Save session to local store
   */
  public setSessionList(sessions: Array<Session>): void {
    localStorage.setItem('sessions', JSON.stringify(sessions));
  }

  /**
   * Update expiration time for current session
   */
  public extendCurrentSessionExpirationTime(): void {
    const sessionList = this.getSessionList();
    const foundSession = sessionList.find(item => item.id === this.currentSessionId);
    if (!isNil(foundSession)) {
      foundSession.expirationTime = moment().add(this.storeBookmarkExpirePeriodHours, 'hours').format(this.dateTimeFormat);
      this.setSessionList(sessionList);
    }
  }
}

interface Session {
  id: string;
  expirationTime: string;
}
