import type { EdgeType, ResourceData, Service, ValidationResult } from "../../types";
import Resource from "../Resource";

//incomplete look at all types
export const dynamodb_billing_mode = [
    "PAY_PER_REQUEST",
    "PROVISIONED"
]

export default class DyanmoDB extends Resource{
    
    public static sourceTypes: EdgeType[] = ["async"];
    public static targetTypes: EdgeType[] = ["sync"]


    public static create(id: string, service: Service): ResourceData{

        return {

            id: id,
            service: service,
            resourceName: id,
            terraformProperties: {
                "name": {value: id, type: "string"},
                "hash_key": {value: null, type: "number"},
                "billing_mode": {value: "PAY_PER_REQUEST", type: "select", options: dynamodb_billing_mode},
                "tags": {value: null, type: "tags"},
            }

        }

    }

    // # only needed if billing_mode = "PROVISIONED"
    // # read_capacity  = 5
    // # write_capacity = 5


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