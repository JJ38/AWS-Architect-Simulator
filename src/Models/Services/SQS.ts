import Resource from "../Resource";
import type { EdgeType, ResourceData, Service, ValidationResult } from "../../types.ts";

export default class SQS extends Resource{


    public static sourceTypes: EdgeType[] = ["pull"];
    public static targetTypes: EdgeType[] = ["async"]


    public static create(id: string, service: Service): ResourceData{

        return {

            id: id,
            service: service,
            resourceName: id,
            terraformProperties: {
                "aws_sqs_queue": {
                    "name": {value: id, type: "string"},
                    "delay_seconds": {value: null, type: "number"},
                    "max_message_size": {value: null, type: "number"},
                    "message_retention_seconds": {value: null, type: "number"},
                    "receive_wait_time_seconds": {value: null, type: "number"},
                    "redrive_policy": {value: null, type: "tags"},
                    "tags": {value: null, type: "tags"},
                }
            },
            componentProperties: {}
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