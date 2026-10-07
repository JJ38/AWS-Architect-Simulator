import type { CodeChunk, EdgeType, PermissionType, Property, PropertyRecord, ResourceData, Service, ValidationResult } from "../types";


export interface ResourceStatics{

    new(data: ResourceData): Resource;
    create(id: string, service: Service): ResourceData;
    sourceTypes: EdgeType[];
    targetTypes: EdgeType[];
    permissionType: PermissionType;

}

export default abstract class Resource{

    public id: string;
    public service: Service;
    public resourceName: string;
    public terraformProperties: Record<string, PropertyRecord>;
    public iamProperties?: Record<string, PropertyRecord>;


    public constructor(data: ResourceData){
        this.id = data.id;
        this.service = data.service;
        this.resourceName = data.resourceName;
        this.terraformProperties = data.terraformProperties;
        this.iamProperties = data.iamProperties;
    }
    

    abstract validate(): ValidationResult;
    abstract toTerraformEdgePropertiesCaller(edgeType: EdgeType, counterPart: Resource): Record<string, PropertyRecord> | null;
    abstract toTerraformEdgePropertiesReceiver(edgeType: EdgeType, counterPart: Resource): Record<string, PropertyRecord> | null;


    toTerraformPreview(): CodeChunk[]{

        let codeChunks: CodeChunk[] = this.toTerraformResource(this.terraformProperties)
        console.log(this.iamProperties);

        if(this.iamProperties != null){
            codeChunks = [...codeChunks, ...this.toTerraformResource(this.iamProperties)];
        }

        return codeChunks;

    }

    toTerraformResource(properties: Record<string, PropertyRecord>): CodeChunk[]{

        const codeChunks: CodeChunk[] = [];

        for(const recordName of Object.keys(properties as Record<string, PropertyRecord>)){

            codeChunks.push({value: "resource ", className:"terraformKeyword"})
            codeChunks.push({value: recordName + " ", className:"terraformParameter"})
            codeChunks.push({value: this.resourceName, className:"terraformParameter"})

            codeChunks.push({value: "{", className:"terraformBracket"})
            
            codeChunks.push(...this.toTerraformPreviewParsePropertyRecord(properties[recordName]));
            codeChunks.push({value: "\n}\n", className:"terraformBracket"})

        }

        return codeChunks;
    }


    toTerraformPreviewParsePropertyRecord(propertyRecord: PropertyRecord): CodeChunk[]{

        const codeChunks: CodeChunk[] = [];

        for(const key of Object.keys(propertyRecord)){

            if(propertyRecord[key].value != null){

                codeChunks.push({value: "\n  ", className:"terraformProperty"})
                codeChunks.push({value: key, className:"terraformProperty"})
                codeChunks.push({value: "-=-", className:""})

                switch (propertyRecord[key].type) {

                    case "tags": { 

                        codeChunks.push({value: "{", className:""});

                        if(propertyRecord[key].value != null){
                
                            const tagChunks = this.toTerraformPreviewParsePropertyRecord(propertyRecord[key].value as PropertyRecord);
                            
                            tagChunks.forEach((chunk) => {
                                chunk.value = "  " + chunk.value;
                            });

                            codeChunks.push(...tagChunks);
                            
                        }

                        codeChunks.push({value: "\n  }", className:""});

                        break;
                    }

                    case "boolean": {
                        codeChunks.push({value: propertyRecord[key].value ? "true" : "false", className:"terraformValue"});
                        break;
                    }

                    case "link": {

                        //this is hardcoded for 1 nested value currently

                        const property: Property<any> = propertyRecord[key];
                        const link: string[] | undefined = property.link;

                        if(link == undefined){
                            return[];
                        }

                        let dependantPropertyRecord: PropertyRecord = this.terraformProperties[link[0]];
                        console.log(dependantPropertyRecord);

                        let dependantProperty: Property<any> = dependantPropertyRecord[link[1]];

                        codeChunks.push({value: dependantProperty.value, className:"terraformValue"});
                        break;
                    }

                    default: {
                        codeChunks.push({value: propertyRecord[key].value, className:"terraformValue"});
                        break;
                    }
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