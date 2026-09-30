import Resource from "../Resource";
import type { Service, ValidationResult, EdgeType, ResourceData } from "../../types.ts";


export default class S3 extends Resource{

    public static sourceTypes: EdgeType[] = ["async"];
    public static targetTypes: EdgeType[] = ["sync"]


    public static create(id: string, service: Service): ResourceData{

        return {

            id: id,
            service: service,
            resourceName: id,
            terraformProperties: {
                "bucket": { value: id, type: "string"},
                "bucket_prefix": { value: null, type: "string"},
                "force_destroy": { value: false, type: "boolean"},
                "tags": { value: {}, type: "tags"}
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