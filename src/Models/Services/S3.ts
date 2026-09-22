import type Resource from "../Resource";
import type { Service, ValidationResult } from "../../types.ts";

export default class S3 implements Resource{

    public id: string;
    public service: Service;

    public bucket: string;
    public properties: Record<string, unknown> = {}

    public constructor({ id, service }: { id: string, service: Service }){
        this.id = id;
        this.bucket = id;
        this.service = service;

        this.properties['bucket'] = id;
    }

    public validate(): ValidationResult {

        let valid = true;
        const errors: string [] = [];

        const validationResult = {
            id: "",
            nodeType: "",
            valid: valid, 
            errors: errors
        };

        return validationResult;

    }

    public toTerraform(): string {

        let terraform: string = `resource ${this.service.providerType} ${this.id}{`;

        for(const key of Object.keys(this.properties)){

            const value = this.properties[key];

            console.log(`key: ${key}, value: ${value}`);
            terraform += this.propertyToTerraform(key, value);
        }

        terraform += "}"

        return terraform;
    }

    private propertyToTerraform(key: string, value: unknown): string{

        const propertyTerraform = `${key} = ${value}`;

        return propertyTerraform;
    }


}