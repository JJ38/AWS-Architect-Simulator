import type { NodeProperty, Service, ValidationResult } from "../types";

export default interface Resource{

    id: string;
    service: Service;
    properties: Record<string, NodeProperty<any>>;
    
    validate(): ValidationResult;
    toTerraform(): string;

}