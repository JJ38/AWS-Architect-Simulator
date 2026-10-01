import type { CodeChunk, EdgeType, PropertyRecord, ResourceData, Service, ValidationResult } from "../types";


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
    public terraformProperties: Record<string, PropertyRecord>;

    abstract validate(): ValidationResult;

    public constructor(data: ResourceData){
        this.id = data.id;
        this.service = data.service;
        this.resourceName = data.resourceName;
        this.terraformProperties = data.terraformProperties;
    }

    toTerraformPreview(): CodeChunk[]{

        const codeChunks: CodeChunk[] = [];

        for(const recordName of Object.keys(this.terraformProperties as Record<string, PropertyRecord>)){

            codeChunks.push({value: "resource ", className:"terraformKeyword"})
            codeChunks.push({value: recordName + " ", className:"terraformParameter"})
            codeChunks.push({value: this.resourceName, className:"terraformParameter"})

            codeChunks.push({value: "{", className:"terraformBracket"})

            console.log(this.terraformProperties[recordName]);

            codeChunks.push(...this.toTerraformPreviewParsePropertyRecord(this.terraformProperties[recordName]));
            codeChunks.push({value: "\n}\n", className:"terraformBracket"})

        }

        return codeChunks;

    }


    toTerraformPreviewParsePropertyRecord(propertyRecord: PropertyRecord): CodeChunk[]{

        const codeChunks: CodeChunk[] = [];

        for(const key of Object.keys(propertyRecord)){

            codeChunks.push({value: "\n  ", className:"terraformProperty"})

            codeChunks.push({value: key, className:"terraformProperty"})
            codeChunks.push({value: " = ", className:""})

            //look at the property value. It might be a record/tags and need deconstructing further
            switch (propertyRecord[key].type) {

                case "tags": { 
                    codeChunks.push({value: "TO DO implement tags", className:"terraformValue"});
                    break;
                }

                case "boolean": {
                    codeChunks.push({value: propertyRecord[key].value ? "true" : "false", className:"terraformValue"});
                    break;
                }

                default: {
                    codeChunks.push({value: propertyRecord[key].value, className:"terraformValue"});
                    break;
                }
            }

        }
            
        return codeChunks;

    }


    toTerraform(): string{

        let terraform: string = "resource ";

       
        for(const recordName of Object.keys(this.terraformProperties)){

            terraform += recordName + " ";
            terraform += this.resourceName;
            terraform += "{";


            for(const key of Object.keys(this.terraformProperties[recordName])){

                terraform += "\n  ";
                terraform += key;
                terraform += " = "

                //look at the property value. It might be a record/tags and need deconstructing further
                switch (key) {

                    case "tags": {
                        terraform += "TO DO implement tags";
                        break;
                    }

                    default: {
                        terraform += this.terraformProperties[recordName][key].value;
                    }
                }
            }

        }

        terraform += "\n}\n";

        return terraform;
    }

}