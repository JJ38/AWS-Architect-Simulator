import type { CodeChunk, EdgeType, Property, ResourceData, Service, ValidationResult } from "../types";


export interface ResourceStatics{

    new(data: ResourceData): Resource;
    create(id: string, service: Service): ResourceData;
    sourceTypes: EdgeType[];
    targetTypes: EdgeType[];

}

export default abstract class Resource{

    public id: string;
    public service: Service;
    public resourceName: string;
    public properties: Record<string, Property<any>>;

    abstract validate(): ValidationResult;

    public constructor(data: ResourceData){
        this.id = data.id;
        this.service = data.service;
        this.resourceName = data.resourceName;
        this.properties = data.properties;
    }

    toTerraform(): CodeChunk[]{

        const codeChunks: CodeChunk[] = [];

        codeChunks.push({value: "resource ", className:"terraformKeyword"})
        codeChunks.push({value: this.service.providerType + " ", className:"terraformParameter"})
        codeChunks.push({value: this.resourceName, className:"terraformParameter"})

        codeChunks.push({value: "{", className:"terraformBracket"})

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

}