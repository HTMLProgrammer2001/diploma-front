import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {InputsModule} from '@progress/kendo-angular-inputs';
import {ButtonModule, ButtonsModule} from '@progress/kendo-angular-buttons';
import {GridModule} from '@progress/kendo-angular-grid';
import {
  AvatarModule,
  CardModule,
  DrawerModule,
  LayoutModule,
  PanelBarModule,
  SplitterModule,
  StepperModule,
  TabStripModule
} from '@progress/kendo-angular-layout';
import {ComboBoxModule, DropDownListModule, MultiSelectModule} from '@progress/kendo-angular-dropdowns';
import {UploadsModule} from '@progress/kendo-angular-upload';
import {
  DateInputsModule,
  DatePickerModule,
  DateTimePickerModule,
  TimePickerModule
} from '@progress/kendo-angular-dateinputs';
import {EditorModule} from '@progress/kendo-angular-editor';
import {LabelModule} from '@progress/kendo-angular-label';
import {EditControlComponent} from './components/edit-control/edit-control.component';
import {DropdownControlComponent} from './components/dropdown-control/dropdown-control.component';
import {DatepickerControlComponent} from './components/date-picker-control/datepicker-control.component';
import {IntlModule} from '@progress/kendo-angular-intl';
import {SearchControlComponent} from './components/search-control/search-control.component';
import {DropdownSmartControlComponent} from './components/dropdown-smart-control/dropdown-smart-control.component';
import {DialogModule, WindowModule} from '@progress/kendo-angular-dialog';
import {TooltipModule} from '@progress/kendo-angular-tooltip';
import {LabelControlComponent} from './components/label-control/label-control.component';
import {CheckboxControlComponent} from './components/checkbox-control/checkbox-control.component';
import {MultiSelectSmartControlComponent} from './components/multi-select-smart-control/multi-select-smart-control.component';
import {NumericControlComponent} from './components/numeric-control/numeric-control.component';
import {PopupTabsComponent} from './components/popup-tabs/popup-tabs.component';
import {DateTimePickerControlComponent} from './components/date-time-picker-control/date-time-picker-control.component';
import {TimePickerControlComponent} from './components/time-picker-control/time-picker-control.component';
import {IconsModule} from '@progress/kendo-angular-icons';
import {DatePickerSimpleControlComponent} from './components/date-picker-simple-control/date-picker-simple-control.component';
import {TranslateModule} from '@ngx-translate/core';
import {RTL} from '@progress/kendo-angular-l10n';
import {EditPasswordControlComponent} from './components/edit-password-control/edit-password-control.component';
import {TextAreaControlComponent} from './components/text-area-control/text-area-control.component';
import {SvgIconControlComponent} from './components/svg-icon-control/svg-icon-control.component';
import {PopupModule} from '@progress/kendo-angular-popup';
import {ReplacePipe} from './pipes/replace.pipe';
import {ContextMenuModule} from '@progress/kendo-angular-menu';
import {ValidationMessageTranslatePipe} from './pipes/validation-message.pipe';
import {TitleHeaderComponent} from './components/title-header/title-header.component';
import {StringToDatePipe} from './pipes/string-to-date.pipe';
import {EditGridServerPagingComponent} from './components/edit-grid-server-paging/edit-grid-server-paging.component';
import {ButtonControlComponent} from './components/button-control/button-control.component';
import {isLanguageRtl} from './utils';
import {FileControlComponent} from './components/file-control/file-control.component';
import {GetByKeyPipe} from './pipes/get-by-key.pipe';
import {GridPaginatorComponent} from './components/grid-paginator/grid-paginator.component';
import {LanguageSwitcherComponent} from './components/language-switcher/language-switcher.component';
import {TranslateAttributePipe} from './pipes/translate-attribute.pipe';
import {MaskedEditControlComponent} from './components/masked-edit-control/masked-edit-control.component';

export const enableRtl = () => isLanguageRtl(sessionStorage.getItem('currentLanguage'));

@NgModule({
  declarations: [
    EditControlComponent,
    SearchControlComponent,
    DropdownControlComponent,
    DatepickerControlComponent,
    StringToDatePipe,
    ValidationMessageTranslatePipe,
    GetByKeyPipe,
    TitleHeaderComponent,
    DropdownSmartControlComponent,
    LabelControlComponent,
    CheckboxControlComponent,
    MultiSelectSmartControlComponent,
    NumericControlComponent,
    PopupTabsComponent,
    DateTimePickerControlComponent,
    TimePickerControlComponent,
    DatePickerSimpleControlComponent,
    EditPasswordControlComponent,
    TextAreaControlComponent,
    SvgIconControlComponent,
    ReplacePipe,
    EditGridServerPagingComponent,
    ButtonControlComponent,
    FileControlComponent,
    GridPaginatorComponent,
    LanguageSwitcherComponent,
    TranslateAttributePipe,
    MaskedEditControlComponent,
  ],
  imports: [
    CommonModule,
    InputsModule,
    ButtonsModule,
    ButtonModule,
    GridModule,
    LayoutModule,
    AvatarModule,
    CardModule,
    DrawerModule,
    PanelBarModule,
    SplitterModule,
    StepperModule,
    TabStripModule,
    DropDownListModule,
    MultiSelectModule,
    DatePickerModule,
    DateTimePickerModule,
    TimePickerModule,
    EditorModule,
    LabelModule,
    IntlModule,
    ComboBoxModule,
    DialogModule,
    WindowModule,
    TooltipModule,
    IconsModule,
    TranslateModule,
    PopupModule,
    ContextMenuModule,
    UploadsModule
  ],
  exports: [
    InputsModule,
    ButtonsModule,
    ButtonModule,
    GridModule,
    LayoutModule,
    AvatarModule,
    CardModule,
    DrawerModule,
    PanelBarModule,
    SplitterModule,
    StepperModule,
    TabStripModule,
    DropDownListModule,
    MultiSelectModule,
    DatePickerModule,
    DateTimePickerModule,
    TimePickerModule,
    DateInputsModule,
    EditorModule,
    LabelModule,
    EditControlComponent,
    DropdownControlComponent,
    DatepickerControlComponent,
    SearchControlComponent,
    TitleHeaderComponent,
    StringToDatePipe,
    ValidationMessageTranslatePipe,
    DropdownSmartControlComponent,
    TooltipModule,
    LabelControlComponent,
    CheckboxControlComponent,
    MultiSelectSmartControlComponent,
    NumericControlComponent,
    PopupTabsComponent,
    DateTimePickerControlComponent,
    TimePickerControlComponent,
    IconsModule,
    DatePickerSimpleControlComponent,
    TranslateModule,
    EditPasswordControlComponent,
    TextAreaControlComponent,
    SvgIconControlComponent,
    ReplacePipe,
    ContextMenuModule,
    ButtonControlComponent,
    EditGridServerPagingComponent,
    FileControlComponent,
    GridPaginatorComponent,
    LanguageSwitcherComponent,
    TranslateAttributePipe,
    MaskedEditControlComponent
  ],
  providers: [{
    provide: RTL,
    useFactory: enableRtl
  },
    {
      provide: 'IS_ELEMENT_NAME_ENABLED',
      useFactory: () => false
    }]
})
export class SharedModule {
}
