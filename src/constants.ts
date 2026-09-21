import type { Service } from "./types";

export const serviceImageSize = { width: 80, height: 80 };

export const services: Service[] = [
    { name: 'EC2', description: 'Elastic Compute Cloud', terraformType: 'resource', providerType: 'aws_instance', icon: 'serviceIcons/Res_Amazon-EC2_Instance_48.svg', image: 'serviceImages/Arch_Amazon-EC2_64.svg' },
    { name: 'S3', description: 'Simple Storage Service', terraformType: 'resource', providerType: 'aws_s3_bucket', icon: 'serviceIcons/Res_Amazon-Simple-Storage-Service_S3-Standard_48.svg', image: 'serviceImages/Arch_Amazon-Simple-Storage-Service_64.svg' },
    { name: 'Lambda', description: 'Serverless Computing Service', terraformType: 'resource', providerType: 'aws_lambda_function', icon: 'serviceIcons/Res_AWS-Lambda_Lambda-Function_48.svg', image: 'serviceImages/Arch_AWS-Lambda_64.svg' },
    { name: 'API Gateway', description: 'Serverless Computing Service', terraformType: 'resource', providerType: 'aws_apigatewayv2_api', icon: 'serviceIcons/Res_Amazon-API-Gateway_Endpoint_48.svg', image: 'serviceImages/Arch_Amazon-API-Gateway_64.svg' }
]