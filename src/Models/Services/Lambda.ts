import type Resource from "../Resource";
import type { Property, Service, ValidationResult } from "../../types.ts";


export interface LambdaData{

    id: string;
    service: Service;
    properties: Record<string, Property<any>>;
    
}

export default class Lambda implements Resource{

    public id: string;
    public service: Service;
    public properties: Record<string, Property<any>>;
    

    public static create(id: string, service: Service): Record<string, any>{

        return {
            id: id,
            service: service,
            properties: {
                "test": {value: null, type: "string"},
                "number": {value: null, type: "number"},
            }
        }

    }

    public constructor(data: LambdaData){
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
        return "";
    }

}