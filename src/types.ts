import type Resource from "./Models/Resource";
import { type Node } from '@xyflow/react';


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

export type ResourceNodeData = {
    kind: 'resource',
    id: string,
    resourceData: Record<string, any> | null,
    service: Service,
    ghost: boolean,
}

export type AppNode = Node<ResourceNodeData>;

export interface NodeProperty<T>{

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
| "radio";