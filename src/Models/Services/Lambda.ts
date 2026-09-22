import type Resource from "../Resource";
import type { Service, ValidationResult } from "../../types.ts";

export default class Lambda implements Resource{

    public id: string;
    public service: Service;
    public properties: Record<string, unknown> = {}

    public constructor({ id, service }: { id: string, service: Service }){
        this.id = id;
        this.service = service;
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

    public toTerraform(): string {
        return "";
    }

}