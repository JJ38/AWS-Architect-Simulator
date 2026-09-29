import type Resource from "../Resource";
import type { Service, ValidationResult, Property, EdgeType, CodeChunk } from "../../types.ts";


export interface S3Data{

    id: string;
    service: Service;
    properties: Record<string, Property<any>>;
    
}


export default class S3 implements Resource{

    public id: string;
    public service: Service;
    public properties: Record<string, Property<any>>;
    public static sourceTypes: EdgeType[] = ["async"];
    public static targetTypes: EdgeType[] = ["sync"]


    public static create(id: string, service: Service): Record<string, any>{

        return {

            id: id,
            service: service,
            properties: {
                "bucket": { value: id, type: "string"},
                "bucket_prefix": { value: null, type: "string"},
                "force_destroy": { value: false, type: "boolean"},
                "tags": { value: {}, type: "tags"}
            }

        }

    }


    public constructor(data: S3Data){
        this.id = data.id;
        this.service = data.service;
        this.properties = data.properties;
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

    public toTerraform(): CodeChunk[] {

        const codeChunks: CodeChunk[] = [];

        codeChunks.push({value: "resource ", className:"terraformKeyword"})
        codeChunks.push({value: this.service.providerType + " ", className:"terraformParameter"})
        codeChunks.push({value: this.properties.bucket.value, className:"terraformParameter"})

        codeChunks.push({value: "{", className:"terraformBracket"})

        console.log(this.properties);

        for(const key of Object.keys(this.properties)){

            codeChunks.push({value: "\n  ", className:"terraformProperty"})

            codeChunks.push({value: key, className:"terraformProperty"})
            codeChunks.push({value: " = ", className:""})

            //look at the property value. It might be a record/tags and need deconstructing further
            switch (key) {

                case "tags": {
                    codeChunks.push({value: "TO DO implement tags", className:"terraformValue"})
                    break;
                }

                default: {
                    codeChunks.push({value: this.properties[key].value, className:"terraformValue"})
                }
            }

        }

        codeChunks.push({value: "\n", className:"terraformProperty"})
        codeChunks.push({value: "}", className:"terraformBracket"})

        return codeChunks;
    }

    private propertyToTerraform(key: string, Property: Property<any>): string{

        const propertyTerraform = `${key} = ${Property.value}`;

        return propertyTerraform;
    }


}