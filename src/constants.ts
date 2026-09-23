import APIGatewayV2 from "./Models/Services/APIGatewayV2";
import EC2 from "./Models/Services/EC2";
import Lambda from "./Models/Services/Lambda";
import S3 from "./Models/Services/S3";
import type { Service } from "./types";

export const serviceImageSize = { width: 80, height: 80 };

export const services: Record<string, Service> = {
    "EC2": { name: 'EC2', description: 'Elastic Compute Cloud', terraformType: 'resource', providerType: 'aws_instance', icon: 'serviceIcons/Res_Amazon-EC2_Instance_48.svg', image: 'serviceImages/Arch_Amazon-EC2_64.svg'},
    "S3": { name: 'S3', description: 'Simple Storage Service', terraformType: 'resource', providerType: 'aws_s3_bucket', icon: 'serviceIcons/Res_Amazon-Simple-Storage-Service_S3-Standard_48.svg', image: 'serviceImages/Arch_Amazon-Simple-Storage-Service_64.svg'},
    "Lambda": { name: 'Lambda', description: 'Serverless Computing Service', terraformType: 'resource', providerType: 'aws_lambda_function', icon: 'serviceIcons/Res_AWS-Lambda_Lambda-Function_48.svg', image: 'serviceImages/Arch_AWS-Lambda_64.svg'},
    "API Gateway V2": { name: 'API Gateway V2', description: 'Serverless Computing Service', terraformType: 'resource', providerType: 'aws_apigatewayv2_api', icon: 'serviceIcons/Res_Amazon-API-Gateway_Endpoint_48.svg', image: 'serviceImages/Arch_Amazon-API-Gateway_64.svg'}
}


export const resourceContainer: Record<string, any> = {

    'aws_instance': EC2.create,
    'aws_s3_bucket': S3.create,
    "aws_lambda_function": Lambda.create,
    "aws_apigatewayv2_api": APIGatewayV2.create

}   