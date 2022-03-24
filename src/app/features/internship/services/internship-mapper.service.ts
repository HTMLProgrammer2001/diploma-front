import {Injectable} from '@angular/core';
import {isNil} from 'lodash';
import {IInternshipListViewModel} from '../types/view-model/internship-list-view-model';
import {IInternshipViewModel} from '../types/view-model/internship-view-model';
import {IInternshipFilterViewModel} from '../types/view-model/internship-filter-view-model';
import {IInternshipGetModel} from '../types/model/internship-get-model';
import {IInternshipPutModel} from '../types/model/internship-put-model';
import {IInternshipPostModel} from '../types/model/internship-post-model';
import {IInternshipDetailsViewState} from '../types/view-model/internship-details-view-state';
import {IInternshipFilterModel} from '../types/model/internship-filter-model';
import {IInternshipListGetModel} from '../types/model/internship-list-get-model';

@Injectable({
  providedIn: 'root',
})
export class InternshipMapperService {
  public internshipListGetModelToViewModel(source: IInternshipListGetModel): IInternshipListViewModel {
    let destination = {} as IInternshipListViewModel;

    if (!isNil(source)) {
      destination = {
        id: source.id,
        teacher: source.teacher,
        code: source.code,
        to: source.to,
        from: source.from,
        hours: source.hours,
        place: source.place,
        title: source.title,
        isDeleted: source.isDeleted
      };
    }

    return destination;
  }

  public internshipGetModelToViewModel(source: IInternshipGetModel): IInternshipViewModel {
    let destination = {} as IInternshipViewModel;

    if (!isNil(source)) {
      destination = {
        id: source.id,
        to: source.to,
        from: source.from,
        guid: source.guid,
        teacher: source.teacher,
        code: source.code,
        description: source.description,
        place: source.place,
        credits: source.credits,
        title: source.title,
        hours: source.hours,
        isDeleted: source.isDeleted
      };
    }

    return destination;
  }

  public internshipViewModelToPutModel(source: IInternshipViewModel): IInternshipPutModel {
    let destination = {} as IInternshipPutModel;

    if (!isNil(source)) {
      destination = {
        id: source.id,
        to: source.to,
        from: source.from,
        guid: source.guid,
        description: source.description,
        teacherId: source.teacher.id,
        code: source.code,
        hours: source.hours,
        place: source.place,
        title: source.title,
        credits: source.credits,
      };
    }

    return destination;
  }

  public internshipViewModelToPostModel(source: IInternshipViewModel): IInternshipPostModel {
    let destination = {} as IInternshipPostModel;

    if (!isNil(source)) {
      destination = {
        to: source.to,
        from: source.from,
        description: source.description,
        teacherId: source.teacher.id,
        code: source.code,
        hours: source.hours,
        place: source.place,
        title: source.title,
        credits: source.credits,
      };
    }

    return destination;
  }

  public internshipInitializeViewModel(): IInternshipViewModel {
    return {
      id: null,
      teacher: {
        id: null,
        name: ''
      },
      hours: 0,
      guid: null,
      description: '',
      title: '',
      place: '',
      from: null,
      to: null,
      code: '',
      credits: 0,
      isDeleted: false
    };
  }

  public internshipInitializeFilterViewModel(): IInternshipFilterViewModel {
    return {
      code: '',
      place: '',
      title: '',
      teacherId: null,
      showDeleted: false,
      dateFromMore: '',
      dateToLess: ''
    };
  }

  public internshipInitializeDetailsViewState(): IInternshipDetailsViewState {
    return {
      isNotFound: false,
      restoring: false
    };
  }

  public internshipFilterViewModelToModel(source: IInternshipFilterViewModel):
    IInternshipFilterModel {
    let destination = {} as IInternshipFilterModel;

    if (!isNil(source)) {
      destination = {
        code: source.code,
        teacherId: source.teacherId,
        place: source.place,
        title: source.title,
        dateToLess: source.dateToLess || null,
        dateFromMore: source.dateFromMore || null,
        showDeleted: source.showDeleted
      };
    }

    return destination;
  }
}
