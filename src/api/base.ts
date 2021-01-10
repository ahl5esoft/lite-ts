import { getMetadataStorage, validate } from 'class-validator';
import { ValidationMetadata } from 'class-validator/types/metadata/ValidationMetadata';

export abstract class APIBase {
    public $nameOfFiles: { [key: string]: any[]; } = {};

    public get $fileOption(): any {
        return;
    }

    public get $validations(): ValidationMetadata[] {
        return getMetadataStorage().getTargetValidationMetadatas(
            this.constructor,
            undefined
        );
    }

    protected req: any;
    public set request(value: any) {
        this.req = value;
    }

    public async auth(): Promise<boolean> {
        return true;
    }

    public async valid(): Promise<boolean> {
        const errors = await validate(this);
        return !errors.length;
    }

    public abstract call(): Promise<any>;
}