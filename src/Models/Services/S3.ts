import Resource from "../Resource";
import type { Service, ValidationResult, Property, EdgeType } from "../../types.ts";


export default class S3 extends Resource{

    public static sourceTypes: EdgeType[] = ["async"];
    public static targetTypes: EdgeType[] = ["sync"]


    public static create(id: string, service: Service): Record<string, any>{

        return {

            id: id,
            service: service,
            resourceName: id,
            properties: {
                "bucket": { value: id, type: "string"},
                "bucket_prefix": { value: null, type: "string"},
                "force_destroy": { value: false, type: "boolean"},
                "tags": { value: {}, type: "tags"}
            }

        }

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

    // public toTerraform(): CodeChunk[] {

    //     const codeChunks: CodeChunk[] = [];

    //     codeChunks.push({value: "resource ", className:"terraformKeyword"})
    //     codeChunks.push({value: this.service.providerType + " ", className:"terraformParameter"})
    //     codeChunks.push({value: this.properties.bucket.value, className:"terraformParameter"})

    //     codeChunks.push({value: "{", className:"terraformBracket"})

    //     for(const key of Object.keys(this.properties)){

    //         codeChunks.push({value: "\n  ", className:"terraformProperty"})

    //         codeChunks.push({value: key, className:"terraformProperty"})
    //         codeChunks.push({value: " = ", className:""})

    //         //look at the property value. It might be a record/tags and need deconstructing further
    //         switch (key) {

    //             case "tags": {
    //                 codeChunks.push({value: "TO DO implement tags", className:"terraformValue"})
    //                 break;
    //             }

    //             default: {
    //                 codeChunks.push({value: this.properties[key].value, className:"terraformValue"})
    //             }
    //         }

    //     }

    //     codeChunks.push({value: "\n", className:"terraformProperty"})
    //     codeChunks.push({value: "}", className:"terraformBracket"})

    //     return codeChunks;
    // }

}