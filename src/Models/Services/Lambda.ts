import Resource from "../Resource";
import type { EdgeType, PermissionType, PropertyRecord, ResourceData, Service, ValidationResult } from "../../types.ts";
import { IamFactory } from "../IamFactory.ts";


export default class Lambda extends Resource{

    public static sourceTypes: EdgeType[] = ["sync", "async"];
    public static targetTypes: EdgeType[] = ["sync", "async", "pull"]
    public static permissionType: PermissionType = "IAM";

    public static create(id: string, service: Service): ResourceData{

        const resourceData: ResourceData = {
            id: id,
            service: service,
            resourceName: id,
            metaData:{

            },
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
            componentProperties: {},
            iamProperties: {
                "aws_iam_role": IamFactory.makeIamRole("", "ec2.amazonaws.com")
            }
        }

        return resourceData;

    }

    toTerraformEdgePropertiesCaller(edgeType: EdgeType, counterPart: Resource): Record<string, PropertyRecord>{
        

        
    

        return {};

    }

    toTerraformEdgePropertiesReceiver(edgeType: EdgeType, counterPart: Resource){

        const record: Record<string, PropertyRecord> = { };

        const resourcePropertyRecord: PropertyRecord = {
            "resource_attribute_name_wdw": {
                value: "resource attribute value", type: "string",
            }
        }

        record['resource_name_receiver'] = resourcePropertyRecord;
    

        return record;

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