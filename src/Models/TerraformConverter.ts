import type { AppEdge, AppNode, Property } from "../types";
import type { ResourceStatics } from "./Resource";
import { resourceContainer } from "../constants";
import type Resource from "./Resource";


export class TerraformConverter{

    private stateNodes: AppNode[];
    private stateEdges: AppEdge[];
    public providerTerraform: string = "";
    public resourceTerraform: string = "";


    public constructor({ stateNodes, stateEdges }: { stateNodes: AppNode[], stateEdges: AppEdge[]}){
        this.stateNodes = stateNodes;
        this.stateEdges = stateEdges;
    }    

    public validateDiagram(): boolean{

        //check if each node has required info
        for(let i = 0; i < this.stateNodes.length; i++){
            // const resource = this.stateNodes[i].resource;
        }
        

        return true;

    }

    public diagramToTerraform(): boolean{

        this.resourceTerraform = "";
        this.providerTerraform = "";

        for(let i = 0; i < this.stateNodes.length; i++){

            const resource: ResourceStatics = resourceContainer[this.stateNodes[i].data.service.name!];
            const resourceInstance = new resource(this.stateNodes[i].data);
            this.resourceTerraform += this.toTerraform(resourceInstance);

        }

        return true;

    }

    expandNested(value: any, depth: number): string {
    
        const indent = "  ".repeat(depth);

        let terraform = " {\n";

        for (const [name, property] of Object.entries(value)) {

            terraform += `${indent}  ${name}`;
            terraform += this.writeProperty(property as Property<any>, depth + 1);
            terraform += "\n";
        }

        terraform += `${indent}}`;

        return terraform;
    }

    expandNestedJson(value: any, depth: number): string {
    
        const indent = "  ".repeat(depth);

        let terraform = " \n";

        for (const [name, property] of Object.entries(value)) {

            terraform += `${indent}  ${name}`;
            terraform += this.writeProperty(property as Property<any>, depth + 1);
            terraform += "\n";
        }

        terraform += `${indent}`;

        return terraform;
    }

    expandJson(value: any, depth: number): string {

        const indent = "  ".repeat(depth);

        let terraform = " = jsonencode({\n";

        for (const [name, property] of Object.entries(value)) {

            terraform += `${indent}  ${name}`;
            terraform += this.writeProperty(property as Property<any>, depth + 1);
            terraform += "\n";
        }

        terraform += `${indent}})`;

        return terraform;
    }

   expandJsonObject(value: any[], depth: number): string {
    const indent = "  ".repeat(depth);
    const childIndent = "  ".repeat(depth + 1);

    let terraform = " = {";

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

            if (typeof item.value === "object" && item.value !== null) {
                terraform += `${childIndent}`;
                terraform += this.expandNestedJson(item.value, depth + 1);
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
            terraform += this.expandNestedJson(item, depth + 1);
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

                if (typeof item.value === "object" && item.value !== null) {
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
    
    writeProperty(property: Property<any>, depth: number): string {
        switch (property.type) {
    
            case "block":
                return this.expandNested(property.value, depth);

            case "json":
                return this.expandJson(property.value, depth);

            case "jsonObject":
            return this.expandJsonObject(property.value, depth);

            case "tags":
                return ` = ${this.expandNested(property.value, depth)}`;
    
            case "propertyArray":
            case "stringArray":
                return this.expandArray(property.value, depth);
    
            case "number":
            case "boolean":
            case "link":
                return ` = ${property.value}`;
    
            default:
                if(property.value == null){
                    return ` = ${property.value}`;
                } else {
                    return ` = "${property.value}"`;
                }
        }

    }

    toTerraform(resource: Resource): string {
        let terraform = "";

        for (const recordName of Object.keys(resource.terraformProperties)) {

            terraform += `resource "${recordName}" "${resource.resourceName}" {\n`;
            for (const [key, property] of Object.entries(resource.terraformProperties[recordName])) { 
                //if mandatory fields are given, only write the other fields if they have a none empty value
                // console.log(resource)
                    // console.log(key,": ",property.value)

                console.log(resource.terraformProperties["aws_iam_role"])
                if(resource.mandatoryFields && !resource.mandatoryFields.includes(key)){
                    if(property.value == null || property.value == undefined || property.value.length === 0 || Object.keys(property.value).length === 0){
                        console.log(key,": ",property.value)
                        continue;
                    } 
                    //intended to be linked to a tickbox in the UI to enabled/disabled certain optional terraform blocs
                    if(property.value.terraformDisabled){
                        console.log(key,": disabled")
                        continue
                    }
                }
                terraform += `  ${key}`; 
                terraform += this.writeProperty(property as Property<any>, 1);
                terraform += "\n";
            }

            terraform += "}\n\n";
        }

        return terraform;
    }

}