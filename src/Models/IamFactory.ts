import { effect } from "../constants";
import type { Property } from "../types";


export class IamFactory{

     //the badge
    static makeIamRole(roleName: string, principalService: string): Record<string, Property<any>>{

        const IamRole: Record<string, Property<any>> = {

            "name": {value: roleName, type: "string"},
            "assume_role_policy": {
                value: {
                    "Sid": {value: null, type: "string"},
                    "Effect": {value: "allow", type: "select", options: effect},
                    "Principal": {
                        value: {
                            "Service": {value: principalService, type: "text"}, //drop down of services. Whos allowed to assume the role
                            "AWS": {value: null, type: "string"}, //account id or arn, maybe select in future.
                            "Federated": {value: null, type: "select", options: ['add list of providers']}, //drop down of providers
                            "*": {value: "*", type: "text"}
                        }, 
                        type: "tags"
                    },
                    "Action": {value: null, type: "string"}
                }, 
                type: "tags"
            }

        }
    

        // name = "test_role"

        // assume_role_policy = jsonencode({
        //     Version = "2012-10-17"
        //     Statement = [
        //         {
        //         Action = "sts:AssumeRole"
        //         Effect = "Allow"
        //         Sid    = ""
        //         Principal = {
        //         Service = "ec2.amazonaws.com"
        //         }
        //     },
        //     ]
        // })

        return IamRole;

    }

    //the doors the badge lets you go through
    // makeIamRolePolicy{}


}