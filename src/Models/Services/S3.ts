import type Resource from "../Resource";
import type { Service, ValidationResult, NodeProperty } from "../../types.ts";


export interface S3Data{

    id: string;
    service: Service;
    properties: Record<string, NodeProperty<any>>;
    
}


export default class S3 implements Resource{

    public id: string;
    public service: Service;
    public properties: Record<string, NodeProperty<any>>;


    public static create(id: string, service: Service): Record<string, any>{

        return {

            id: id,
            service: service,
            properties: {
                "bucket": { value: null, type: "string"},
                "bucket_prefix": { value: null, type: "string"},
                "force_destroy": { value: false, type: "boolean"},
                "tags": { value: {}, type: "tags"}
            }

        }

    }


    public constructor(data: S3Data){
        this.id = data.id;
        this.service = data.service;
        this.properties = data.properties;
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

        let terraform: string = `resource ${this.service.providerType} ${this.properties.bucket.value}{`;

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