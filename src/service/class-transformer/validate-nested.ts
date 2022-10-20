import { plainToInstance } from 'class-transformer';
import { registerDecorator, validate, ValidationOptions } from 'class-validator';

export function ClassTransformerValidateNested(typer: new () => any, validationOptions?: ValidationOptions) {
    return (target: object, propertyName: string) => {
        registerDecorator({
            name: 'ValidateNested',
            target: target.constructor,
            propertyName: propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                async validate(value: any) {
                    if (!Array.isArray(value))
                        value = [value];

                    for (const r of value) {
                        const res = await validate(
                            plainToInstance(typer, r),
                        );
                        if (res.length)
                            return false;
                    }

                    return true;
                },
            }
        });
    }
}