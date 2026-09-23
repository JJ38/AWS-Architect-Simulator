import type Resource from "../Resource";
import type { Service, ValidationResult, NodeProperty } from "../../types.ts";

export default class S3 implements Resource{

    public id: string;
    public service: Service;

    public properties: Record<string, NodeProperty<any>> = {
        "bucket": { value: null, type: "string"},
        "buck_prefix": { value: null, type: "string"},
        "force_destroy": { value: false, type: "boolean"},
        "tags": { value: {}, type: "tags"}
    }

    public constructor({ id, service }: { id: string, service: Service }){
        this.id = id;
        this.service = service;

        this.properties.bucket.value = id;
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

    private propertyToTerraform(key: string, nodeProperty: NodeProperty<any>): string{

        const propertyTerraform = `${key} = ${nodeProperty.value}`;

        return propertyTerraform;
    }


}