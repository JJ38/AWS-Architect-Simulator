import type { Service, ValidationResult } from "../types";

export default interface Resource{

    id: string;
    service: Service;
    properties: Record<string, unknown>;
    
    validate(): ValidationResult;
    toTerraform(): string;

}