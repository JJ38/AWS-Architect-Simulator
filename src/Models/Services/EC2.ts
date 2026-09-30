import Resource from "../Resource";
import type { EdgeType, ResourceData, Service, ValidationResult } from "../../types.ts";

export default class EC2 extends Resource{

    public static sourceTypes: EdgeType[] = ["sync", "pull", "async"];
    public static targetTypes: EdgeType[] = ["sync"]


    public static create(id: string, service: Service): ResourceData{

        return {

            id: id,
            service: service,
            resourceName: id,
            properties: {
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