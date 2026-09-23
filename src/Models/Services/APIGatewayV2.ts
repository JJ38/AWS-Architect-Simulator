import type Resource from "../Resource";
import type { NodeProperty, Service, ValidationResult } from "../../types.ts";

export interface APIGatewayV2Data{

    id: string;
    service: Service;
    properties: Record<string, NodeProperty<any>>;
    
}

export default class APIGatewayV2 implements Resource{
    
    public id: string;
    public service: Service;
    public properties: Record<string, NodeProperty<any>>;


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


    public constructor(data: APIGatewayV2Data){
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