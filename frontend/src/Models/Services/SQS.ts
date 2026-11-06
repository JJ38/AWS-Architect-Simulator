import Resource from "../Resource";
import type { ComponentData, EdgeType, PermissionType, ValidationResult } from "../../types.ts";

export default class SQS extends Resource{


    public static sourceTypes: EdgeType[] = ["Poll"];
    public static targetTypes: EdgeType[] = ["Request/Response", "Event"];
    public static permissionType: PermissionType = "Passive";

    public static createData(id: string): ComponentData{

        return {

            id: id,
            metaData:{},
            simulationProperties: {
                "simulation_settings": {
                    "is_input_service": {value: false, type: "boolean"},
                    "requests_per_period": {
                        value: 10, 
                        type: "number", 
                        dependant: {
                            propertyPath: ['simulation_settings', 'is_input_service'], 
                            value: true,
                        }
                    },
                }
            },
            terraformProperties: {
                "aws_sqs_queue": {
                    "name": {value: id, type: "string"},
                    "delay_seconds": {value: null, type: "number"},
                    "max_message_size": {value: null, type: "number"},
                    "message_retention_seconds": {value: null, type: "number"},
                    "receive_wait_time_seconds": {value: null, type: "number"},
                    "redrive_policy": {
                        value: {
                            deadLetterTargetArn: {
                                value: null,
                                type: "string"
                            },
                            maxReceiveCount: {
                                value: 5,
                                type: "number"
                            },
                        },
                        type: "block"
                    },
                    "tags": {
                        value: {},
                        type: "tags"
                    },
                }
            },
            componentProperties: {}
        }

    }


    toTerraformEdgePropertiesCaller(edgeType: EdgeType, counterPart: Resource){
        return null;
    }

    toTerraformEdgePropertiesReceiver(edgeType: EdgeType, counterPart: Resource){
        return null;
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