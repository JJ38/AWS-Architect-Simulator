import { type Edge, type Node } from '@xyflow/react';

export type Service = {
    name: string;
    description: string;
    terraformType: string | null; //e.g resource
    providerType: string | null; //e.d aws_lambda_function
    icon: string;
    image: string;
}

export type ValidationResult = {
    id: string;
    nodeType: string;
    valid: boolean;
    errors: string[];
}

export type ComponentData = ResourceNodeData | EdgeData;

type BaseComponentData = {
    properties: Record<string, Property<any>>,
}

export type ResourceNodeData = BaseComponentData & {
    id: string,
    service: Service,
}

export type AppNode = Node<ResourceNodeData>;

export type EdgeData = BaseComponentData & {
    edgeType: EdgeType
}

export type AppEdge = Edge<EdgeData>;

export interface Property<T>{

    value: T,
    type: PropertyType

}

//union type. Similar to an enum but more lightweight
export type PropertyType =
| "string"
| "boolean"
| "number"
| "tags"
| "checkbox"
| "select"
| "radio";

export type EdgeType = "sync" | "async" | "pull"


export interface CodeChunk{

    value: any,
    className: string

}
