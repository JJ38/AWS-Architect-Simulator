import Resource from "../Resource";
import type { Service, ValidationResult, EdgeType, ResourceData } from "../../types.ts";


export default class S3 extends Resource{

    public static sourceTypes: EdgeType[] = ["async"];
    public static targetTypes: EdgeType[] = ["sync"];


    public static create(id: string, service: Service): ResourceData{

        return {
            id: id,
            service: service,
            resourceName: id,
            terraformProperties: {
                "aws_s3_bucket": {
                    "bucket": { value: id, type: "string", anchor: true},
                    "bucket_prefix": { value: null, type: "string"},
                    "force_destroy": { value: false, type: "boolean"},
                    "tags": { value: {}, type: "tags"}
                },
                "aws_s3_bucket_versioning": {
                    "bucket": { 
                        value: id, 
                        type: "link", 
                        link: ['aws_s3_bucket', 'bucket']
                    },
                    "versioning_configuration": 
                    { 
                        value: { 
                            "status": { value: "Enabled", type: "string" }
                        }, 
                        type: "tags"
                    }
                },
                "aws_s3_bucket_public_access_block": {
                    "bucket": { 
                        value: id, 
                        type: "link", 
                        link: ['aws_s3_bucket', 'bucket']                     
                    },
                    "block_public_acls": { value: true, type: "boolean"},
                    "block_public_policy": { value: true, type: "boolean"},
                    "ignore_public_acls": { value: true, type: "boolean"},
                    "restrict_public_buckets": { value: true, type: "boolean"}
                }
            },
            componentProperties: {}
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

}