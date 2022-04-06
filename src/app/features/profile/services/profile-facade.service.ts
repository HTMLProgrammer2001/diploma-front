import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {BookmarkService} from '../../../global/services/bookmark/bookmark.service';
import {ConfigService} from '../../../global/services/config/config.service';
import {map, tap} from 'rxjs/operators';
import {ProfileApiService} from './profile-api.service';
import {ProfileMapperService} from './profile-mapper.service';
import {cloneDeep} from 'lodash';
import {IProfileViewModel} from '../types/view-model/profile-view-model';
import {IdSimpleItem} from '../../../shared/types/id-simple-item';
import {UserInfoFacadeService} from '../../../global/components/user-info/services/user-info-facade.service';

@Injectable({providedIn: 'root'})
export class ProfileFacadeService {
  constructor(
    private configService: ConfigService,
    private bookmarkService: BookmarkService,
    private profileMapperService: ProfileMapperService,
    private profileApiService: ProfileApiService,
    private userInfoFacadeService: UserInfoFacadeService,
  ) {
  }

  //region Profile

  public getProfile$(): Observable<IProfileViewModel> {
    if (!!this.bookmarkService.getCurrentDataItem().profileDetail) {
      return of(this.bookmarkService.getCurrentDataItem().profileDetail);
    } else {
      return this.loadProfile$();
    }
  }

  public loadProfile$(): Observable<IProfileViewModel> {
    return this.profileApiService.getProfile$()
      .pipe(
        map(value => this.profileMapperService.profileGetModelToViewModel(value.data)),
        tap(value => {
          this.bookmarkService.getCurrentDataItem().profileDetail = value;
          this.bookmarkService.getCurrentDataItem().profileDetailCopy = cloneDeep(value);

          this.userInfoFacadeService.userProfileInfo$.next(
            this.profileMapperService.profileViewModelToUserInfoProfileGetModel(value)
          );
        }),
      );
  }

  public updateProfile$(viewModel: IProfileViewModel): Observable<IProfileViewModel> {
    const body = this.profileMapperService.profileViewModelToPutModel(viewModel);
    return this.profileApiService.updateProfile$(body)
      .pipe(
        map(value => this.profileMapperService.profileGetModelToViewModel(value.data)),
        tap(value => {
          this.bookmarkService.getCurrentDataItem().profileDetail = value;
          this.bookmarkService.getCurrentDataItem().profileDetailCopy = cloneDeep(value);

          this.userInfoFacadeService.userProfileInfo$.next(
            this.profileMapperService.profileViewModelToUserInfoProfileGetModel(value)
          );
        })
      );
  }

  public deleteProfile$(profile: IProfileViewModel): Observable<IdSimpleItem> {
    return this.profileApiService.deleteProfile$(profile.guid).pipe(map(resp => resp.data));
  }

  // endregion
}
