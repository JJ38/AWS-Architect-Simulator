import type { CodeChunk, EdgeType, Property, ResourceNodeData, Service, ValidationResult } from "../types";


export interface ResourceStatics{
    new(data: ResourceNodeData): Resource
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
    toTerraform(): CodeChunk[];

}