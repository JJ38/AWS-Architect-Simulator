import type { AppEdge, AppNode, ComponentData, Property } from "../types";
import type { ResourceStatics } from "./Resource";
import { resourceContainer } from "../constants";
import type Resource from "./Resource";


export class TerraformConverter{

    private stateNodes: AppNode[];
    private stateEdges: AppEdge[];

    private stateNodesData: ComponentData[];

    public providerTerraform: string = "";
    public resourceTerraform: string = "";


    public constructor({ stateNodes, stateEdges, stateNodesData }: { stateNodes: AppNode[], stateEdges: AppEdge[], stateNodesData: ComponentData[]}){
        this.stateNodes = stateNodes;
        this.stateEdges = stateEdges;
        this.stateNodesData = stateNodesData;
    }    

    public validateDiagram(): boolean{

        //check if each node has required info
        for(let i = 0; i < this.stateNodes.length; i++){
            // const resource = this.stateNodes[i].resource;
        }
        

        return true;

    }

    public diagramToTerraform(myNodes: ComponentData[]): boolean{

        this.resourceTerraform = "";
        this.providerTerraform = "";

        console.log("nodes:", myNodes)
            myNodes.map(
                (stateNodeData: ComponentData) => {
                    console.log("statenodes:",this.stateNodes)
                    console.log("nodedata:",myNodes)

                    let myNode = this.stateNodes.find((node)=>node.id == stateNodeData.id)
                    console.log("mynode:",myNode)
                    const resource: ResourceStatics = resourceContainer[myNode.data.service.name];
                    const resourceInstance = new resource(myNode.data.service,stateNodeData);

                    const terraformProperties = resourceInstance.terraformProperties;
                    this.resourceTerraform += this.toTerraform(stateNodeData)

                }
            )

        

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

    toTerraform(resource: ComponentData): string {
        let terraform = "";

        for (const recordName of Object.keys(resource.terraformProperties)) {

            terraform += `resource "${recordName}" "${resource.id}" {\n`;
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