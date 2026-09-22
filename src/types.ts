import type Resource from "./Models/Resource";
import { type Node } from '@xyflow/react';


export type Service = {
    name: string;
    description: string;
    terraformType: string | null; //e.g resource
    providerType: string | null; //e.d aws_lambda_function
    icon: string;
    image: string;
    resource: (new (args: {id: string, service: Service}) => Resource) | null; // new doesnt create an instance. This is a reference to a class constructor
}

export type ValidationResult = {
    id: string;
    nodeType: string;
    valid: boolean;
    errors: string[];
}

export type ResourceNodeData = {
    kind: 'resource',
    label: string, 
    ghost: boolean, 
    img: string,
    terraformType: string | null,
    resource: Resource | null
}

export type AppNode = Node<ResourceNodeData>;