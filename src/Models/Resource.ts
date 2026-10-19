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
    abstract toTerraformEdgePropertiesCaller(edgeType: EdgeType, counterPart: Resource, resource?: Resource): Record<string, PropertyRecord> | null;
    abstract toTerraformEdgePropertiesReceiver(edgeType: EdgeType, counterPart: Resource, resource?: Resource): Record<string, PropertyRecord> | null;


    toTerraformPreview(propertyRecords: Record<string, PropertyRecord>[]): CodeChunk[]{

        let codeChunks: CodeChunk[] = [];

        propertyRecords.forEach((propertyRecord) => {
            codeChunks = [...codeChunks, ...this.toTerraformResource(propertyRecord)];
        });

        return codeChunks;

    }

    toTerraformResource(properties: Record<string, PropertyRecord>): CodeChunk[]{

        const codeChunks: CodeChunk[] = [];

        for(const recordName of Object.keys(properties as Record<string, PropertyRecord>)){

            codeChunks.push({value: "resource ", className:"terraformKeyword"})
            codeChunks.push({value: recordName + " ", className:"terraformParameter"})
            codeChunks.push({value: this.resourceName, className:"terraformParameter"})

            codeChunks.push({value: "{", className:"terraformBracket"})
            // console.log(recordName+ " props: ", JSON.stringify(properties))
            codeChunks.push(...this.toTerraformPreviewParsePropertyRecord(properties[recordName], 0));
            codeChunks.push({value: "\n}\n\n", className:"terraformBracket"})

        }

        return codeChunks;
    }


    toTerraformPreviewParsePropertyRecord(propertyRecord: PropertyRecord, numberOfIndents: number): CodeChunk[]{

        let codeChunks: CodeChunk[] = [];

        for(const key of Object.keys(propertyRecord)){

            if(propertyRecord[key].value != null){

                codeChunks = [...codeChunks, ...this.toTerraformPreviewParseProperty(propertyRecord[key], key, numberOfIndents + 1)];
                
            }

        }
            
        return codeChunks;

    }


    toTerraformPreviewParseProperty(property: Property<any>, propertyName: string | null, numberOfIndents: number): CodeChunk[]{

        if(property == null){
            return [];
        }

        const codeChunks: CodeChunk[] = [];

        let indent: string = "";

        for(let i = 0; i < numberOfIndents; i++){
            indent += "  ";
        }

        codeChunks.push({value: `\n${indent}`, className:"terraformProperty"})

        if(propertyName != null){
            codeChunks.push({value: propertyName, className:"terraformProperty"})
        }


        switch (property.type) {

            case "tags": { 
                codeChunks.push({value: " = ", className:""})
                codeChunks.push({value: "{", className:""});

                if(property.value != null){
                    
                    const tagChunks = this.toTerraformPreviewParsePropertyRecord(property.value as PropertyRecord, numberOfIndents);
                    codeChunks.push(...tagChunks);
                    
                }

                codeChunks.push({value: `\n${indent}}`, className:""});

                break;
            }

            case "block": { 

                codeChunks.push({value: "{", className:""});

                if(property.value != null){
                    
                    const tagChunks = this.toTerraformPreviewParsePropertyRecord(property.value as PropertyRecord, numberOfIndents);
                    codeChunks.push(...tagChunks);
                    
                }

                codeChunks.push({value: `\n${indent}}`, className:""});

                break;
            }

            case "boolean": {
                codeChunks.push({value: " = ", className:""})
                codeChunks.push({value: property.value ? "true" : "false", className:"terraformValue"});
                break;
            }

            case "link": {
                 codeChunks.push({value: " = ", className:""})

                //this is hardcoded for 1 nested value currently
                const link: string[] | undefined = property.link;

                if(link == undefined){
                    return[];
                }

                let dependantPropertyRecord: PropertyRecord = this.terraformProperties[link[0]];
                let dependantProperty: Property<any> = dependantPropertyRecord[link[1]];

                codeChunks.push({value: dependantProperty.value, className:"terraformValue"});
                break;
            }

            case "propertyArray": {
                codeChunks.push({value: " = ", className:""})

                codeChunks.push({value: "[", className:"terraformValue"});
       
                if(property.value != null){

                    let arrayChunks: CodeChunk[] = [];

                    property.value.forEach((value: Property<any>, index: number) => {
                        arrayChunks = [...arrayChunks, ...this.toTerraformPreviewParseProperty(value, null, numberOfIndents + 1)];
                    })

                    codeChunks.push(...arrayChunks);
                    
                }

                codeChunks.push({value: `\n${indent}]`, className:"terraformValue"});
                break;
            }

            default: {
                codeChunks.push({value: " = ", className:""});
                codeChunks.push({value: property.value, className:"terraformValue"});
                break;
            }
        }

        return codeChunks;

    }

    expandNested(value: any, depth: number): string {

        const indent = "  ".repeat(depth);

        let terraform = " {\n";

        for (const [name, property] of Object.entries(value)) {

            terraform += `${indent}  ${name}`;
            terraform += this.renderProperty(property as Property<any>, depth + 1);
            terraform += "\n";
        }

        terraform += `${indent}}`;

        return terraform;
    }
    
    expandArray(value: any[], depth: number): string {
        const indent = "  ".repeat(depth);
        const childIndent = "  ".repeat(depth + 1);

        let terraform = " = [\n";

        for (const item of value) {

            // Primitive item
            if (typeof item !== "object" || item === null) {

                terraform += typeof item === "string"
                    ? `${childIndent}"${item}"\n`
                    : `${childIndent}${item}\n`;

                continue;
            }

            // Property wrapper ({ value: ..., type: ... })
            if ("value" in item) {

                if (
                    typeof item.value === "object" &&
                    item.value !== null
                ) {
                    terraform += `${childIndent}`;
                    terraform += this.expandNested(item.value, depth + 1);
                    terraform += "\n";
                }
                else {
                    terraform += typeof item.value === "string"
                        ? `${childIndent}"${item.value}"\n`
                        : `${childIndent}${item.value}\n`;
                }

                continue;
            }

            // Plain object
            terraform += `${childIndent}`;
            terraform += this.expandNested(item, depth + 1);
            terraform += "\n";
        }

        terraform += `${indent}]`;

        return terraform;
    }

    renderProperty(property: Property<any>, depth: number): string {

    switch (property.type) {

        case "block":
            return this.expandNested(property.value, depth);

        case "tags":
            return ` = ${this.expandNested(property.value, depth)}`;

        case "propertyArray":
        case "stringArray":
            return this.expandArray(property.value, depth);

        case "string":
            return ` = "${property.value}"`;

        default:
            return ` = ${property.value}`;
    }

    }
    toTerraform(): string {
        let terraform = "";

        for (const recordName of Object.keys(this.terraformProperties)) {

            terraform += `resource ${recordName} ${this.resourceName} {\n`;

            for (const [key, property] of Object.entries(this.terraformProperties[recordName])) {

                terraform += `  ${key}`;
                terraform += this.renderProperty(property as Property<any>, 1);
                terraform += "\n";
            }

            terraform += "}\n\n";
        }

        return terraform;
    }
}



    // //consumes values of the form: tags = this.terraformProperties[recordName][key].value;
    // expandNested(value: any, depth: number = 1): string {
    // const indent = "  ".repeat(depth);
    // const childIndent = "  ".repeat(depth + 1);

    // let terraform = `${indent}{\n`;

    // for (const [name, data] of Object.entries(value)) {
    //     const val = (data as any).value;

    //     //handle arrays like IAM role Statement
    //     if (Array.isArray(val)) {
    //             terraform += `${childIndent}${name} = [\n`;

    //             for (const item of val) {
    //                 terraform += this.expandNested(item.value, depth + 2);
    //                 terraform += "\n";
    //             }

    //             terraform += `${childIndent}]\n`;
    //     }
    //     //go layer deaper if subject is still an object
    //     else if (typeof val === "object" && val !== null) {
    //         terraform += `${childIndent}${name} `;
    //         terraform += this.expandNested(val, depth + 1);
    //         terraform += "\n";
    //     }
    //     else {

    //         terraform += typeof val === "string"
    //             ? `${childIndent}${name} = "${val}"\n`
    //             : `${childIndent}${name} = ${val}\n`;
    //     }
    // }

    // terraform += `${indent}}`;

    // return terraform;
    // }

    // toTerraform(): string{ 

    //     let terraform: string = "";
       
    //     for(const recordName of Object.keys(this.terraformProperties)){

    //         terraform += `resource ${recordName} ${this.resourceName} {\n`;

    //         for(const key of Object.keys(this.terraformProperties[recordName])){
    //             console.log("key: ", key);
    //             terraform += `\n  ${key}`;
                
    //             //look at the property value. It might be a record/tags and need deconstructing further
    //             if (this.terraformProperties[recordName][key].type == "tags"){
    //                 terraform += " ="
    //                 terraform += this.expandNested(this.terraformProperties[recordName][key].value)
    //                 break

    //             } 
    //             if (this.terraformProperties[recordName][key].type == "block"){
    //                 terraform += this.expandNested(this.terraformProperties[recordName][key].value)
    //                 console.log("block reached")

    //                 break

    //             } 
    //             if (this.terraformProperties[recordName][key].type == "Statement"){
    //                 terraform += JSON.stringify(this.terraformProperties[recordName][key].value)
    //                 console.log("statement reached")
    //                 break

    //             }
    //             else {
    //                 switch (key) {
                        
    //                     case "Statement": {
    //                         //still needs to be solved properly
    //                         terraform += JSON.stringify(this.terraformProperties[recordName][key].value)
    //                         break;
    //                     }

    //                     default: {
    //                         terraform += " = ";
    //                         if(this.terraformProperties[recordName][key].type == "string"){
    //                             terraform += '"' + this.terraformProperties[recordName][key].value + '"';
    //                         }
    //                         else {
    //                             terraform += this.terraformProperties[recordName][key].value;
    //                         }
    //                     }
    //                 }
    //             }
    //         }
    //     terraform += "\n}\n";
    //     }


    //     return terraform;
    // }