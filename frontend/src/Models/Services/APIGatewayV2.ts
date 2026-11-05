import Resource from "../Resource";
import type { ComponentData, EdgeType, PermissionType, ResourceData, Service, ValidationResult } from "../../types.ts";


export default class APIGatewayV2 extends Resource{
    
    public static sourceTypes: EdgeType[] = ["Request/Response", "Event"];
    public static targetTypes: EdgeType[] = ["Request/Response"];
    public static permissionType: PermissionType = "Service";
    

    public static createData(id: string): ComponentData{

        return {

            id: id,
            metaData: {},
            simulationProperties: {
                "simulation_settings": {
                    "is_input_service": {value: true, type: "boolean"},
                    "request_per_period": {
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
                "aws_apigatewayv2_api": {
                    "name": {value: null, type: "string"},
                    "protocol_type": {value: null, type: "string"},
                    "target": {value: null, type: "string"},
                    "route_key": {value: null, type: "string"},
                    "description": {value: null, type: "string"},
                    "route_selection_expression": {value: null, type: "string"},
                    "disable_execute_api_endpoint": {value: null, type: "boolean"},
                    "cors_configuration": {
                        value: {},
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