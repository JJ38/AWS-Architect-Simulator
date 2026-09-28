import type { EdgeType, Property, Service, ValidationResult } from "../types";


export interface ResourceStatics{
    create(id: string, service: Service): Record<string, any>;
    sourceTypes: EdgeType[];
    targetTypes: EdgeType[];
}


export default interface Resource{

    id: string;
    service: Service;
    properties: Record<string, Property<any>>;

    // create(id: string, service: Service): Record<string, any>;
    validate(): ValidationResult;
    toTerraform(): string;

}