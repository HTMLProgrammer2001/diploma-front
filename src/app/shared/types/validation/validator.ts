import {ValidationGroup} from './validation-group';
import {ValidationResult} from './validation-result';
import {ValidationRule} from './validation-rule';
import {ValidationTypes} from './validation-types';
import {ValidationGroupResult} from './validation-group-result';
import {get, isEmpty, isNil, isNull, isUndefined} from 'lodash';

/**
 * Validator
 */
export class Validator {
  validationGroups: Map<string, ValidationGroup> = new Map<string, ValidationGroup>();
  dtoValidationResult: ValidationResult = new ValidationResult();
  validationGroupResults: Map<string, ValidationGroupResult> = new Map<string, ValidationGroupResult>();
  dto: any;

  /**
   * Used to fill in validation groups and result groups.
   * This is base function for initializing validation objects.
   *   - validationGroups - mandatory for validation
   *   - validationGroupResults - optional, used to aggregate validation results from several fields
   *
   * @param ruleArray - validation rules with all necessary settings
   * @param translate - translate service
   */
  constructor(...ruleArray: Array<ValidationRule>) {
    this.addRules(...ruleArray);
    this.dtoValidationResult = new ValidationResult();
  }


  initValidatorResultStates(validator: Validator): void {
    if (!isNil(validator)) {
      if (!isEmpty(this.validationGroups)) {
        this.validationGroups.forEach(value => {
          const group = validator.validationGroups.get(value.fieldName);
          if (!isNil(group)) {
            value.validationResult = group.validationResult;
          }
        });
      }
      if (!isEmpty(this.validationGroupResults)) {
        this.validationGroupResults.forEach(value => {
          const groupResult = validator.validationGroupResults.get(value.groupName);
          if (!isNil(groupResult)) {
            value.validationResult = groupResult.validationResult;
          }
        });
      }
      if (!isNil(validator.dtoValidationResult)) {
        this.dtoValidationResult = validator.dtoValidationResult;
      }
    }
  }

  /**
   * Resets all validation results
   */
  resetValidationResults(): void {
    this.dtoValidationResult.isValid = true;
    this.dtoValidationResult.messages = [];
    if (!!this.validationGroups) {
      this.validationGroups.forEach((groupItem) => {
        groupItem.validationResult.isValid = true;
        groupItem.validationResult.messages = [];
      });
    }
    if (!isNull(this.validationGroupResults)) {
      this.validationGroupResults.forEach(value => {
        value.validationResult.isValid = true;
        value.validationResult.messages = [];
      });
    }
  }

  /**
   * Used to set dto object for validator
   * It is necessary if use validation for related fields see the following validation types:
   *   - dateGreaterThan
   *   - dateLessThan
   *   - dateTimeGreaterThan
   *   - dateTimeLessThan
   *
   * @param dto - object for validation
   */
  setDto(dto: any): void {
    this.dto = dto;
  }

  /**
   * Used to create validation group results to aggregate several fields.
   * Validation group results can be added in different way as setting rule.groupResultName in constructor
   *
   * @param resultGroupName - name of result group
   * @param fieldNames - name of field which will be added to result group
   */
  addGroupResult(resultGroupName: string, ...fieldNames: Array<string>): void {
    if (!isNull(resultGroupName) && !isNull(fieldNames)) {
      const validationResultGroup = this.validationGroupResults.get(resultGroupName) ?? new ValidationGroupResult();

      validationResultGroup.groupName = resultGroupName;

      fieldNames.forEach(fieldName => {
        if (this.validationGroups.has(fieldName)) {
          validationResultGroup.validationGroups.push(this.validationGroups.get(fieldName));
        }
      });
      validationResultGroup.isRequired = this.getIsRequiredForGroupResult(validationResultGroup.validationGroups);
      this.validationGroupResults.set(resultGroupName, validationResultGroup);
    }
  }

  /**
   * Returns true if have at least one active required rule
   *
   * @param validationGroups - settings for validation
   */
  getIsRequiredForGroupResult(validationGroups: Array<ValidationGroup>): boolean {
    let res = false;
    for (const item of validationGroups) {
      if (item.validationRules.some(v => (v.type === ValidationTypes.required) && v.isActive === true)) {
        res = true;
        break;
      }
    }
    return res;
  }

  /**
   * Get validation result for some validation group result
   *
   * @param groupName - name of group result
   */
  getGroupResult(groupName: string): ValidationResult {
    return this.validationGroupResults.get(groupName).validationResult ?? new ValidationResult();
  }

  /**
   * Get validation group result with all settings and fields
   *
   * @param groupName - name of group result
   */
  getGroupResultFull(groupName: string): ValidationGroupResult {
    return this.validationGroupResults.get(groupName) ?? new ValidationGroupResult();
  }

  /**
   * Used to fill in validation groups and result groups.
   * This is base function for initializing validation objects.
   *   - validationGroups - mandatory for validation
   *   - validationGroupResults - optional, used to aggregate validation results from several fields
   *
   * @param ruleArray - validation rules with all necessary settings
   */
  addRules(...ruleArray: Array<ValidationRule>): void {
    if (!!ruleArray && ruleArray.length > 0) {
      // add ValidationGroups
      ruleArray.forEach(ruleItem => {
        if (isUndefined(ruleItem.isActive) || isNull(ruleItem.isActive)) {
          ruleItem.isActive = true;
        }
        let groupItem: ValidationGroup = this.validationGroups.get(ruleItem.fieldName);
        if (!groupItem) {
          groupItem = new ValidationGroup();
          groupItem.fieldName = ruleItem.fieldName;
          this.validationGroups.set(ruleItem.fieldName, groupItem);
        }

        let isRuleFound = false;

        if (ruleItem.type === ValidationTypes.required
          || ruleItem.type === ValidationTypes.maxLength
          || ruleItem.type === ValidationTypes.minLength
          || ruleItem.type === ValidationTypes.maxValue
          || ruleItem.type === ValidationTypes.minValue
          || ruleItem.type === ValidationTypes.maxDate
          || ruleItem.type === ValidationTypes.minDate
          || ruleItem.type === ValidationTypes.dateGreaterThan
          || ruleItem.type === ValidationTypes.dateLessThan
          || ruleItem.type === ValidationTypes.dateTimeGreaterThan
          || ruleItem.type === ValidationTypes.dateTimeLessThan
          || ruleItem.type === ValidationTypes.numberGreaterThan
          || ruleItem.type === ValidationTypes.numberLessThan
          || ruleItem.type === ValidationTypes.email
          || ruleItem.type === ValidationTypes.phone) {
          for (let i = 0; i < groupItem.validationRules.length; i++) {
            if (groupItem.validationRules[i].type === ruleItem.type) {
              groupItem.validationRules[i] = ruleItem;
              isRuleFound = true;
              break;
            }
          }
          if (!isRuleFound) {
            groupItem.validationRules.push(ruleItem);
          }
        } else {
          // for ValidationTypes.pattern ValidationTypes.custom
          groupItem.validationRules.push(ruleItem);
        }
      });

      // Add validation results group
      ruleArray.forEach(ruleItem => {
        if (ruleItem.groupResultName) {
          const validationResultGroup = this.validationGroupResults.get(ruleItem.groupResultName) ?? new ValidationGroupResult();
          validationResultGroup.groupName = ruleItem.groupResultName;

          const validationGroup = this.validationGroups.get(ruleItem.fieldName);
          if (!isNull(validationGroup) && !validationResultGroup.validationGroups.some(i => i.fieldName === ruleItem.fieldName)) {
            validationResultGroup.validationGroups.push(validationGroup);
          }
          this.validationGroupResults.set(ruleItem.groupResultName, validationResultGroup);
        }
      });

      // calculate isRequired for validationGroupResults
      this.validationGroupResults.forEach(value => {
        value.isRequired = this.getIsRequiredForGroupResult(value.validationGroups);
      });
    }
  }

  /**
   * Get validation result for some field
   *
   * @param fieldName - name of field
   */
  getResult(fieldName: string): ValidationResult {
    return this.validationGroups.get(fieldName).validationResult;
  }

  /**
   * Get validation rule by field name and rule type
   *
   * @param fieldName - name of field
   * @param ruleType - type of rule
   */
  getRule(fieldName: string, ruleType: ValidationTypes): ValidationRule {
    let result: ValidationRule = null;
    const validationGroup = this.getGroup(fieldName);
    if (validationGroup && validationGroup.validationRules && validationGroup.validationRules.length > 0) {
      result = validationGroup.validationRules.find(rule => rule.type === ruleType);
    }
    return result;
  }

  /**
   * Activate for some validation rule to include it in validation process
   *
   * @param fieldName - name of field
   * @param ruleType - type of validation rule
   */
  activateRule(fieldName: string, ruleType: ValidationTypes): void {
    const rule = this.getRule(fieldName, ruleType);
    if (!!rule) {
      rule.isActive = true;
    }
    // check required for validation group results
    if (ruleType === ValidationTypes.required) {
      this.validationGroupResults.forEach((value) => {
        value.isRequired = this.getIsRequiredForGroupResult(value.validationGroups);
      });
    }
  }

  /**
   * Make deactivation for some validation rule to exclude it from validation process
   *
   * @param fieldName - name of field
   * @param ruleType - type of validation rule
   */
  deactivateRule(fieldName: string, ruleType: ValidationTypes): void {
    const rule = this.getRule(fieldName, ruleType);
    if (!!rule) {
      rule.isActive = false;
    }
    // check required for validation group results
    if (ruleType === ValidationTypes.required) {
      this.validationGroupResults.forEach((value) => {
        value.isRequired = this.getIsRequiredForGroupResult(value.validationGroups);
      });
    }
  }

  /**
   * Get validation group which contain all validation rules for some field
   *
   * @param fieldName - name of field
   */
  getGroup(fieldName: string): ValidationGroup {
    return this.validationGroups.get(fieldName);
  }

  /**
   * Make validation for field
   *
   * @param fieldName - field for validation
   * @param fieldValue - field value for validation
   */
  validateField(fieldName: string, fieldValue: any): ValidationResult {
    let result: ValidationResult = new ValidationResult();
    if (fieldName) {
      const groupItem = this.validationGroups.get(fieldName);
      result = this.validateGroupItem(fieldValue, groupItem);

      // make validation for related fields
      // (it used for dateGreaterThan, dateTimeGreaterThan, dateLessThan, dateTimeLessThan, numberGreaterThan, numberLessThan)
      if (!isNull(groupItem) && !isNull(groupItem.validationRules) && groupItem.validationRules.length > 0) {
        const relatedRules = groupItem.validationRules.filter(i =>
          i.type === ValidationTypes.dateGreaterThan
          || i.type === ValidationTypes.dateLessThan
          || i.type === ValidationTypes.dateTimeGreaterThan
          || i.type === ValidationTypes.dateTimeLessThan
          || i.type === ValidationTypes.numberGreaterThan
          || i.type === ValidationTypes.numberLessThan
        );

        if (relatedRules?.length > 0) {
          const relatedFieldsSet = new Set<string>(relatedRules.map(el => el.settingValue));

          if (relatedFieldsSet.size > 0) {
            relatedFieldsSet.forEach(value => this.validateDtoForField(this.dto, value));
          }
        }
      }

      this.recalculateValidationGroupResults();
    }
    return result;
  }

  /**
   * Make validation for dto object
   *
   * @param dto - object for validation
   */
  validateDto(dto: any): ValidationResult {
    const result: ValidationResult = new ValidationResult();
    if (!isNull(dto)) {
      this.validationGroups.forEach((groupItem) => {
        const tmpSettingsValue = this.getValueFromDto(dto, groupItem.fieldName);
        const vResult = this.validateGroupItem(tmpSettingsValue, groupItem);
        if (!vResult.isValid) {
          result.isValid = vResult.isValid;
          result.messages.push(...vResult.messages);
          //result.toolTipMessage = vResult.toolTipMessage;
        }
      });

      this.recalculateValidationGroupResults();
    }

    this.dtoValidationResult = result;
    return result;
  }

  /**
   * Make validation for dto object
   *
   * @param dto - object for validation
   * @param fieldName - name of field
   */
  validateDtoForField(dto: any, fieldName: string): ValidationResult {
    const result: ValidationResult = new ValidationResult();
    if (!isNull(dto)) {
      const groupItem = this.getGroup(fieldName);
      const tmpSettingsValue = this.getValueFromDto(dto, groupItem.fieldName);
      const vResult = this.validateGroupItem(tmpSettingsValue, groupItem);
      if (!vResult.isValid) {
        result.isValid = vResult.isValid;
        result.messages.push(...vResult.messages);
        //result.toolTipMessage = vResult.toolTipMessage;
      }

      this.recalculateValidationGroupResults();
    }
    this.dtoValidationResult = result;
    return result;
  }

  /**
   * Recalculate all group results. Used every time when group results should be recalculated
   */
  recalculateValidationGroupResults(): void {
    if (!isNull(this.validationGroupResults)) {
      this.validationGroupResults.forEach(value => {
        const validationResult = new ValidationResult();
        if (!isNull(value.validationGroups)) {
          value.validationGroups.forEach(item => {
            if (!item.validationResult.isValid) {
              validationResult.isValid = false;
              validationResult.messages.push(...item.validationResult.messages);
            }
          });
        }

        value.validationResult.isValid = validationResult.isValid;
        value.validationResult.messages = validationResult.messages;
      });
    }
  }

  /**
   * Make validation for value according validation group
   *
   * @param fieldValue - value for validation
   * @param groupItem - group which include all validation rules for some field
   */
  validateGroupItem(fieldValue: any, groupItem: ValidationGroup): ValidationResult {
    const result: ValidationResult = new ValidationResult();
    groupItem.validationRules.forEach(itemRule => {
      if (itemRule.isActive !== false) {
        const vResult = this[itemRule.type](fieldValue, itemRule);
        if (!vResult.isValid) {
          result.isValid = vResult.isValid;
          result.messages.push(vResult.messages[0]);
        }
        groupItem.validationResult.isValid = result.isValid;
        groupItem.validationResult.messages = result.messages;
      } else {
        groupItem.validationResult.isValid = true;
        groupItem.validationResult.messages = [];
      }
    });

    return result;
  }

  /**
   * Make validation fo "required" type
   *
   * @param value - data for validation
   * @param rule - validation settings
   */
  required(value: any, rule: ValidationRule): ValidationResult {
    const result: ValidationResult = new ValidationResult();
    if (value === undefined || value === null) {
      result.isValid = false;
      result.messages.push({message: rule.message, messageTranslateKey: rule.messageTranslateKey});
    } else if (typeof (value) === 'string' && value.trim().length === 0) {
      result.isValid = false;
      result.messages.push({message: rule.message, messageTranslateKey: rule.messageTranslateKey});
    } else if (typeof (value) === 'object' && value.length === 0) {
      result.isValid = false;
      result.messages.push({message: rule.message, messageTranslateKey: rule.messageTranslateKey});
    }
    return result;
  }

  /**
   * Make validation fo "minLength" type.
   *
   * @param value - data for validation
   * @param rule - validation settings. Use rule.settingValue as min length setting
   */
  minLength(value: string, rule: ValidationRule): ValidationResult {
    const tmpValue = isNil(value) ? null : String(value);
    const result: ValidationResult = new ValidationResult();
    if (tmpValue && tmpValue.length && tmpValue.length < Number(rule.settingValue)) {
      result.isValid = false;
      result.messages.push({
        message: rule.message,
        messageTranslateKey: rule.messageTranslateKey,
        replacers: {minLength: rule.settingValue}
      });
    }
    return result;
  }

  /**
   * Make validation fo "maxLength" type.
   *
   * @param value - data for validation
   * @param rule - validation settings. Use rule.settingValue as max length setting
   */
  maxLength(value: string, rule: ValidationRule): ValidationResult {
    const tmpValue = isNil(value) ? null : String(value);
    const result: ValidationResult = new ValidationResult();
    if (tmpValue && tmpValue.length && tmpValue.length > Number(rule.settingValue)) {
      result.isValid = false;
      result.messages.push({
        message: rule.message,
        messageTranslateKey: rule.messageTranslateKey,
        replacers: {maxLength: rule.settingValue}
      });
    }
    return result;
  }

  /**
   * Make validation fo "minValue" type.
   *
   * @param value - data for validation
   * @param rule - validation settings Use rule.settingValue as min value setting
   */
  minValue(value: number, rule: ValidationRule): ValidationResult {
    const result: ValidationResult = new ValidationResult();
    if (value !== undefined && value !== null && value < Number(rule.settingValue)) {
      result.isValid = false;
      result.messages.push({
        message: rule.message,
        messageTranslateKey: rule.messageTranslateKey,
        replacers: {min: rule.settingValue}
      });
    }
    return result;
  }

  /**
   * Make validation fo "maxValue" type.
   *
   * @param value - data for validation
   * @param rule - validation settings. Use rule.settingValue as max value setting
   */
  maxValue(value: number, rule: ValidationRule): ValidationResult {
    const result: ValidationResult = new ValidationResult();
    if (value !== undefined && value !== null && value > Number(rule.settingValue)) {
      result.isValid = false;
      result.messages.push({
        message: rule.message,
        messageTranslateKey: rule.messageTranslateKey,
        replacers: {max: rule.settingValue}
      });
    }
    return result;
  }

  /**
   * Make validation fo "minDate" type.
   *
   * @param value - data for validation
   * @param rule - validation settings. Use rule.settingValue as min date setting
   */
  minDate(value: any, rule: ValidationRule): ValidationResult {
    const valueDate = new Date(value);
    const ruleDate = new Date(rule.settingValue);
    const result: ValidationResult = new ValidationResult();
    if (value && valueDate && ruleDate && valueDate < ruleDate) {
      result.isValid = false;
      result.messages.push({
        message: rule.message,
        messageTranslateKey: rule.messageTranslateKey,
        replacers: {minDate: rule.settingValue.toLocaleDateString()}
      });
    }
    return result;
  }

  /**
   * Make validation fo "maxDate" type.
   *
   * @param value - data for validation
   * @param rule - validation settings. Use rule.settingValue as max date setting
   */
  maxDate(value: any, rule: ValidationRule): ValidationResult {
    const valueDate = new Date(value);
    const ruleDate = new Date(rule.settingValue);
    const result: ValidationResult = new ValidationResult();
    if (value && valueDate && ruleDate && valueDate > ruleDate) {
      result.isValid = false;
      result.messages.push({
        message: rule.message,
        messageTranslateKey: rule.messageTranslateKey,
        replacers: {maxDate: rule.settingValue.toLocaleDateString()}
      });
    }
    return result;
  }

  /**
   * Make validation fo "dateGreaterThan" type. Validate "value" and dto[rule.settingValue]
   * dto object should be set to validator (.setDto(dto))
   *
   * @param value - data for validation
   * @param rule - validation settings. Use rule.settingValue for additional date field name
   */
  dateGreaterThan(value: any, rule: ValidationRule): ValidationResult {
    const result: ValidationResult = new ValidationResult();
    let valueDate: Date = null;
    if (!isNull(value)) {
      valueDate = new Date(value);
      valueDate = new Date(valueDate.getFullYear(), valueDate.getMonth(), valueDate.getDate());
    }
    let ruleDate: Date = null;
    const tmpSettingsValue = this.getValueFromDto(this.dto, rule.settingValue);
    if (tmpSettingsValue) {
      ruleDate = new Date(tmpSettingsValue);
      ruleDate = new Date(ruleDate.getFullYear(), ruleDate.getMonth(), ruleDate.getDate());
    }
    if (value && valueDate && ruleDate && valueDate < ruleDate) {
      result.isValid = false;
      result.messages.push({message: rule.message, messageTranslateKey: rule.messageTranslateKey});
    }
    return result;
  }

  /**
   * Make validation fo "dateTimeGreaterThan" type. Validate "value" and dto[rule.settingValue]
   * dto object should be set to validator (.setDto(dto))
   *
   * @param value - data for validation
   * @param rule - validation settings. Use rule.settingValue for additional date field name
   */
  dateTimeGreaterThan(value: any, rule: ValidationRule): ValidationResult {
    const result: ValidationResult = new ValidationResult();
    let valueDate: Date = null;
    if (!isNull(value)) {
      valueDate = new Date(value);
    }
    let ruleDate: Date = null;
    const tmpSettingsValue = this.getValueFromDto(this.dto, rule.settingValue);
    if (tmpSettingsValue) {
      ruleDate = new Date(tmpSettingsValue);
    }
    if (value && valueDate && ruleDate && valueDate < ruleDate) {
      result.isValid = false;
      result.messages.push({message: rule.message, messageTranslateKey: rule.messageTranslateKey});
    }
    return result;
  }

  /**
   * Make validation fo "dateLessThan" type. Validate "value" and dto[rule.settingValue]
   * dto object should be set to validator (.setDto(dto))
   *
   * @param value - data for validation
   * @param rule - validation settings. Use rule.settingValue for additional date field name
   */
  dateLessThan(value: any, rule: ValidationRule): ValidationResult {
    const result: ValidationResult = new ValidationResult();
    let valueDate: Date = null;
    if (!isNull(value)) {
      valueDate = new Date(value);
      valueDate = new Date(valueDate.getFullYear(), valueDate.getMonth(), valueDate.getDate());
    }
    let ruleDate: Date = null;
    const tmpSettingsValue = this.getValueFromDto(this.dto, rule.settingValue);
    if (tmpSettingsValue) {
      ruleDate = new Date(tmpSettingsValue);
      ruleDate = new Date(ruleDate.getFullYear(), ruleDate.getMonth(), ruleDate.getDate());
    }
    if (value && valueDate && ruleDate && valueDate > ruleDate) {
      result.isValid = false;
      result.messages.push({message: rule.message, messageTranslateKey: rule.messageTranslateKey});
    }
    return result;
  }

  /**
   * Make validation fo "dateTimeLessThan" type. Validate "value" and dto[rule.settingValue]
   * dto object should be set to validator (.setDto(dto))
   *
   * @param value - data for validation
   * @param rule - validation settings. Use rule.settingValue for additional date field name
   */
  dateTimeLessThan(value: any, rule: ValidationRule): ValidationResult {
    const result: ValidationResult = new ValidationResult();
    let valueDate: Date = null;
    if (!isNull(value)) {
      valueDate = new Date(value);
    }
    let ruleDate: Date = null;
    const tmpSettingsValue = this.getValueFromDto(this.dto, rule.settingValue);
    if (tmpSettingsValue) {
      ruleDate = new Date(tmpSettingsValue);
    }
    if (value && valueDate && ruleDate && valueDate > ruleDate) {
      result.isValid = false;
      result.messages.push({message: rule.message, messageTranslateKey: rule.messageTranslateKey});
    }
    return result;
  }

  /**
   * Validation for numeric type. For case when one number is greater than other
   *
   * @param value - entered data
   * @param rule - validation settings
   */
  public numberGreaterThan(value: number, rule: ValidationRule): ValidationResult {
    const validationResult: ValidationResult = new ValidationResult();
    let valueNumber;
    if (!isNull(value)) {
      valueNumber = value;
    }
    let ruleNumber;
    const temp = this.getValueFromDto(this.dto, rule.settingValue);
    if (temp) {
      ruleNumber = temp;
    }
    if (!isNil(valueNumber) && !isNil(ruleNumber) && valueNumber < ruleNumber) {
      validationResult.isValid = false;
      validationResult.messages.push({message: rule.message, messageTranslateKey: rule.messageTranslateKey});
    }
    return validationResult;
  }

  /**
   * Validation for numeric type. For case when one number is less than other
   *
   * @param value - entered data
   * @param rule - validation settings
   */
  public numberLessThan(value: number, rule: ValidationRule): ValidationResult {
    const validationResult: ValidationResult = new ValidationResult();

    let valueNumber;
    if (!isNull(value)) {
      valueNumber = value;
    }
    let ruleNumber;
    const temp = this.getValueFromDto(this.dto, rule.settingValue);
    if (temp) {
      ruleNumber = temp;
    }
    if (!isNil(valueNumber) && !isNil(ruleNumber) && valueNumber > ruleNumber) {
      validationResult.isValid = false;
      validationResult.messages.push({message: rule.message, messageTranslateKey: rule.messageTranslateKey});
    }
    return validationResult;
  }

  /**
   * Make validation fo "pattern" type.
   *
   * @param value - data for validation
   * @param rule - validation settings. Use rule.settingValue for pattern value
   */
  pattern(value: any, rule: ValidationRule): ValidationResult {
    const result: ValidationResult = new ValidationResult();
    const pattern = new RegExp(rule.settingValue);
    if (value && rule.settingValue && pattern && !pattern.test(value)) {
      result.isValid = false;
      result.messages.push({
        message: rule.message,
        messageTranslateKey: rule.messageTranslateKey,
        replacers: {pattern: rule.settingValue}
      });
    }
    return result;
  }

  /**
   * Make validation fo Israel "passport" type.
   *
   * @param passport - data for validation
   * @param rule - validation settings
   */
  passport(passport: any, rule: ValidationRule): ValidationResult {
    const result: ValidationResult = new ValidationResult();
    if (!!passport && passport.length > 0) {
      if (isNaN(passport) || passport.length !== 9) {
        result.isValid = false;
      } else {
        const iPas: Array<number> = new Array<number>(Math.max(passport.length, 9));
        // int[] iPas = new int[Math.max(passport.length(), 9)];
        const dif = iPas.length - passport.length;
        for (let i = 0; i < dif; i++) {
          iPas[i] = 0;
        }
        for (let i = dif; i < iPas.length; i++) {
          iPas[i] = (passport.charCodeAt(i - dif) - '0'.charCodeAt(0));
        }
        const j = iPas.length % 2;
        let sum = 0;
        for (let i = 0; i < iPas.length; i++) {
          if (i % 2 === j) {
            iPas[i] *= 2;
          }
          if (iPas[i] >= 10) {
            iPas[i] = iPas[i] % 10 + Math.trunc(iPas[i] / 10);
          }
          sum += iPas[i];
        }
        result.isValid = sum % 10 === 0;
      }
    }
    if (!result.isValid) {
      result.messages.push({message: rule.message, messageTranslateKey: rule.messageTranslateKey});
    } else {
      result.messages = [];
    }
    return result;
  }

  /**
   * Make validation fo "email" type.
   *
   * @param value - data for validation
   * @param rule - validation settings
   */
  email(value: string, rule: ValidationRule): ValidationResult {
    // eslint-disable-next-line max-len
    const pattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const result: ValidationResult = new ValidationResult();

    if (!!value && value.length > 0 && !pattern.test(value)) {
      result.isValid = false;
      result.messages.push({message: rule.message, messageTranslateKey: rule.messageTranslateKey});
    }
    return result;
  }

  /**
   * Make validation of "phone" type.
   *
   * @param value - data for validation
   * @param rule - validation settings
   */
  phone(value: string, rule: ValidationRule): ValidationResult {
    // eslint-disable-next-line max-len
    const pattern = /^(?:\+380)?[ .-]?\(?[0-9]{2}\)?[ .-]?[0-9]{2}[ .-]?[0-9]{2}[ .-]?[0-9]{3}$/;
    const result: ValidationResult = new ValidationResult();

    if (!!value && value.length > 0 && !pattern.test(value)) {
      result.isValid = false;
      result.messages.push({message: rule.message, messageTranslateKey: rule.messageTranslateKey});
    }
    return result;
  }

  /**
   * Make custom validation. Use function which should be set in rule.customFunction
   *
   * @param value - data for validation. This data will be pass on user function as parameter.
   * @param rule - validation settings
   */
  customValidationWithFunction(value: any, rule: ValidationRule): ValidationResult {
    const result: ValidationResult = new ValidationResult();
    if (!rule.customFunction(value, this.dto)) {
      result.isValid = false;
      result.messages.push({
        message: rule.message,
        messageTranslateKey: rule.messageTranslateKey,
        replacers: rule.settingValue
      });
    }
    return result;
  }

  /**
   * Get value from dto.
   *
   * @param dto - data for getting value by field name
   * @param fieldName - name of field. For inner data can be use dot separation (example: 'partner.group')
   */
  getValueFromDto(dto: any, fieldName: string): any {
    let resultValue = null;
    if (!isNull(dto)) {
      if (!isNull(fieldName)) {
        resultValue = get(dto, fieldName) ?? null;
      } else {
        this.logWarning('fieldName is undefined or null.');
      }
    } else {
      this.logWarning('DTO is undefined or null. Pleas use validator.setDto(...) to apply data for validator');
    }
    return resultValue;
  }

  logWarning(msg: string): void {
    console.error('%cWarning ', 'color: black; background-color: #e7ad00;', msg);
  }
}
