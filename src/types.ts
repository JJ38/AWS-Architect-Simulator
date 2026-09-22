import type Resource from "./Models/Resource";

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