import {Injectable} from '@angular/core';
import {isNil} from 'lodash';
import {IPublicationListViewModel} from '../types/view-model/publication-list-view-model';
import {IPublicationViewModel} from '../types/view-model/publication-view-model';
import {IPublicationFilterViewModel} from '../types/view-model/publication-filter-view-model';
import {IPublicationGetModel} from '../types/model/publication-get-model';
import {IPublicationPutModel} from '../types/model/publication-put-model';
import {IPublicationPostModel} from '../types/model/publication-post-model';
import {IPublicationDetailsViewState} from '../types/view-model/publication-details-view-state';
import {IPublicationFilterModel} from '../types/model/publication-filter-model';
import {IPublicationListGetModel} from '../types/model/publication-list-get-model';

@Injectable({providedIn: 'root'})
export class PublicationMapperService {
  public publicationListGetModelToViewModel(source: IPublicationListGetModel): IPublicationListViewModel {
    let destination = {} as IPublicationListViewModel;

    if (!isNil(source)) {
      destination = {
        id: source.id,
        title: source.title,
        date: source.date,
        authors: source.teachers.map(el => el.name).join(', ') + (source.anotherAuthors ? ` & ${source.anotherAuthors}` : ''),
        isDeleted: source.isDeleted
      };
    }

    return destination;
  }

  public publicationGetModelToViewModel(source: IPublicationGetModel): IPublicationViewModel {
    let destination = {} as IPublicationViewModel;

    if (!isNil(source)) {
      destination = {
        id: source.id,
        date: source.date,
        description: source.description,
        title: source.title,
        anotherAuthors: source.anotherAuthors,
        publisher: source.publisher,
        url: source.url,
        teachers: source.teachers,
        guid: source.guid,
        isDeleted: source.isDeleted
      };
    }

    return destination;
  }

  public publicationViewModelToPutModel(source: IPublicationViewModel): IPublicationPutModel {
    let destination = {} as IPublicationPutModel;

    if (!isNil(source)) {
      destination = {
        id: source.id,
        date: source.date,
        description: source.description,
        anotherAuthors: source.anotherAuthors,
        publisher: source.publisher,
        url: source.url,
        title: source.title,
        teacherIds: source.teachers.map(el => el.id),
        guid: source.guid
      };
    }

    return destination;
  }

  public publicationViewModelToPostModel(source: IPublicationViewModel): IPublicationPostModel {
    let destination = {} as IPublicationPostModel;

    if (!isNil(source)) {
      destination = {
        date: source.date,
        description: source.description,
        title: source.title,
        url: source.url,
        anotherAuthors: source.anotherAuthors,
        publisher: source.publisher,
        teacherIds: source.teachers.map(el => el.id)
      };
    }

    return destination;
  }

  public publicationInitializeViewModel(): IPublicationViewModel {
    return {
      id: null,
      date: '',
      publisher: '',
      url: '',
      teachers: [],
      anotherAuthors: '',
      title: '',
      description: '',
      guid: null,
      isDeleted: false
    };
  }

  public publicationInitializeFilterViewModel(): IPublicationFilterViewModel {
    return {
      dateLess: '',
      dateMore: '',
      showDeleted: false,
      teacherIds: [],
      title: '',
    };
  }

  public publicationInitializeDetailsViewState(): IPublicationDetailsViewState {
    return {
      isNotFound: false,
      restoring: false
    };
  }

  public publicationFilterViewModelToModel(source: IPublicationFilterViewModel): IPublicationFilterModel {
    let destination = {} as IPublicationFilterModel;

    if (!isNil(source)) {
      destination = {
        dateLess: source.dateLess || null,
        dateMore: source.dateMore || null,
        teacherIds: !source.teacherIds?.length ? undefined : source.teacherIds,
        title: source.title,
        showDeleted: source.showDeleted
      };
    }

    return destination;
  }
}
