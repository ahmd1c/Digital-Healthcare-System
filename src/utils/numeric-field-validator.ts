import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsNumericFilter(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isNumericFilter',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof parseFloat(value) === 'number') {
            return true;
          }
          if (typeof value === 'object' && value !== null) {
            const { gte, lte } = value;
            if (
              (gte === undefined || typeof gte === 'number') &&
              (lte === undefined || typeof lte === 'number')
            ) {
              return true;
            }
          }
          return false;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a number or an object with optional gte or lte properties of type number`;
        },
      },
    });
  };
}
