import type { Service, ValidationResult } from "../types";

export default interface Resource{

    id: string;
    service: Service;
    
    validate(): ValidationResult;
    toTerraform(): string;

}