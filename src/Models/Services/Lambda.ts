import Resource from "../Resource";
import type { EdgeType, ResourceData, Service, ValidationResult } from "../../types.ts";


export default class Lambda extends Resource{

    public static sourceTypes: EdgeType[] = ["sync", "async"];
    public static targetTypes: EdgeType[] = ["sync", "async", "pull"]

    public static create(id: string, service: Service): ResourceData{

        return {
            id: id,
            service: service,
            resourceName: id,
            terraformProperties: {
                "test": {value: null, type: "string"},
                "number": {value: null, type: "number"},
            }
        }

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

}