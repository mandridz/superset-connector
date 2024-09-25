// src/common/validators/is-single-field.validator.ts
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsSingleField', async: false })
export class IsSingleField implements ValidatorConstraintInterface {
  validate(_: any, args: ValidationArguments) {
    const obj = args.object as any;
    const keys = ['address', 'twitter', 'discord', 'telegram', 'email'];
    const presentKeys = keys.filter((key) => !!obj[key]);
    return presentKeys.length === 1;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Only one of the address, twitter, discord, telegram or email fields should be set';
  }
}
