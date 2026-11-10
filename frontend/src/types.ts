import { type Edge, type Node } from '@xyflow/react';

export type Service = {
    name: string;
    description: string;
    terraformType: string | null; //e.g resource
    providerTypes: string[] | null; //e.d aws_lambda_function
    icon: string;
    image: string;
}

export type ValidationResult = {
    id: string;
    nodeType: string;
    valid: boolean;
    errors: string[];
}

export type PropertyRecord = Record<string, Property<any>>;

export type ComponentData = {
    id: string,
    metaData: Record<string, any>,
    simulationProperties?: Record<string, PropertyRecord>,
    componentProperties: Record<string, PropertyRecord>,
    terraformProperties: Record<string, PropertyRecord>,
    iamProperties?: Record<string, PropertyRecord>,
    resources?: Record<string, string>, 
}

export type ResourceData = {
    id: string,
    service: Service,
    resourceName: string,
    showTraffic: boolean,
    highlighted: boolean,
    requestsPerPeriod?: number
}

export type AppNode = Node<ResourceData>;

export type EdgeData = {
    behaviour: {
        edgeType: Property<EdgeType>
    }
}

export type AppEdge = Edge<EdgeData>;

export type AppComponent = AppNode | AppEdge;

export interface Property<T>{
    value: T,
    type: PropertyType,
    options?: readonly T[]
    name?: string
    dependant?: {propertyPath: string[], value?: any}
    anchor?: boolean
    link?: string[]
}

export interface InputsController{

    keyboardInputOnChange(
        event: string | number, 
        nodeProperty: Property<any>, 
        propertyCategory: PropertyCategory,
        propertyRecordName: string[],
        inputName: string, 
        componentID: string | null,
        componentSetter: React.Dispatch<React.SetStateAction<any>>
    ): void,
    getDependantProperty(property: Property<any>, componentData: ComponentData | undefined): any,
    checkBoxOnChange(
          event: React.ChangeEvent<HTMLInputElement, HTMLInputElement>, 
        nodeProperty: Property<any>, 
        propertyCategory: PropertyCategory,
        propertyRecordName: string[],
        inputName: string, 
        componentID: string | null,
        componentSetter: React.Dispatch<React.SetStateAction<any>>
    ): void,
    onSelectChange(
        event: React.ChangeEvent<HTMLSelectElement, HTMLSelectElement>, 
        nodeProperty: Property<any>, 
        propertyCategory: PropertyCategory,
        propertyRecordName: string[],
        inputName: string, 
        componentID: string | null,
        componentSetter: React.Dispatch<React.SetStateAction<any>>
    ): void,
    shouldShowProperty(property: Property<any>, componentData: Record<string, PropertyRecord> | undefined): boolean

}

export type PropertyCategory =
"simulation"
| "component"
| "terraform" 
| "iam"

//union type. Similar to an enum but more lightweight
export type PropertyType =
| "edgeType"
| "link"
| "json"
| "propertyArray"
| "stringArray"
| "text"
| "string"
| "boolean"
| "number"
| "tags"
| "nestedTags"
| "checkbox"
| "select"
| "block"
| "tatement"
| "radio";

export type EdgeType = "Request/Response" | "Event" | "Poll";

export type NodeType = "imageNode" | "costNode" | "trafficNode" | "capacityNode";

export interface CodeChunk{
    value: any,
    className: string
}

export type PermissionType = "IAM" | "Service" | "Passive"; // A passive service should only ever show up as a pull source
export type TrafficPeriod = "Hour" | "Day" | "Month";

export interface Coords{
    x: number,
    y: number
}

export interface ThrottleIngress{
    capacity: ThroughPut //concurrency / duration || workers x work per worker
}

export interface QueueIngress{
    capacity: ThroughPut,
    size: number,
    timeout: number
}

export interface ThroughPut{
    requests: number,
    period: TimePeriod
}   

export type TimePeriod = "Seconds" | "Minutes" | "Hours";

export type Ingress = ThrottleIngress | QueueIngress;

export type RequestRecord = {node?: ComponentData, throughPut?: number, edge?: ComponentData, multiplier?: number};

