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
                "aws_lambda_function": {
                    "function_name": {value: null, type: "string"},
                    "role": {value: null, type: "string"},
                    "filename": {value: null, type: "string"},
                    "source_code_hash": {value: null, type: "string"},
                    "handler": {value: null, type: "string"},
                    "runtime": {value: null, type: "string"},
                    "timeout": {value: null, type: "number"},
                    "memory_size": {value: null, type: "number"},
                    "package_type": {value: null, type: "string"},
                    "architectures": {
                        value: null,
                        type: "tags"
                    },
                    "reserved_concurrent_executions": {value: null, type: "number"},
                    "publish": {value: null, type: "boolean"},
                    "environment": {
                        value: null,
                        type: "tags"
                    },
                    "vpc_config": {
                        value: null,
                        type: "tags"
                    },
                    "dead_letter_config": {
                        value: null,
                        type: "tags"
                    },
                    "ephemeral_storage": {
                        value: null,
                        type: "tags"
                    },
                    "layers": {
                        value: null,
                        type: "tags"
                    },
                    "tags": {
                        value: null,
                        type: "tags"
                    },
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