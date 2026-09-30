import type Resource from "../Resource";
import type { CodeChunk, EdgeType, Property, Service, ValidationResult } from "../../types.ts";


export interface SQSData{

    id: string;
    service: Service;
    properties: Record<string, Property<any>>;
    
}

export default class SQS implements Resource{

    public id: string;
    public service: Service;
    public properties: Record<string, Property<any>>;
    public static sourceTypes: EdgeType[] = ["pull"];
    public static targetTypes: EdgeType[] = ["async"]


    public static create(id: string, service: Service): Record<string, any>{

        return {

            id: id,
            service: service,
            properties: {
                "name": {value: null, type: id},
                "delay_seconds": {value: null, type: "number"},
                "max_message_size": {value: null, type: "number"},
                "message_retention_seconds": {value: null, type: "number"},
                "recieve_wait_time_seconds": {value: null, type: "number"},
                "redrive_policy": {value: null, type: "tags"},
                "tags": {value: null, type: "tags"},

            }

        }

    }

    
    public constructor(data: SQSData){
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

    public toTerraform(): CodeChunk[] {


        return [];
    }

}