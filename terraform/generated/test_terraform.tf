terraform {
 
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.70.0"
    }
  }
 
  backend "s3" {
    bucket       = "jamesbrass-aws-architect-sim-tfstate"
    key          = "aws-architect-simulator/terraform.tfstate" //file path in the bucket
    region       = "eu-west-2"
    use_lockfile = true   # if TF >=1.10; else add dynamodb_table = "..."
  }
 
}
 
provider "aws" {
  region  = "eu-west-2"      # pick your region
  # profile = "default"      # only needed if using a named profile ≠ default
}

resource "aws_lambda_function" "lambdaPlaceholder" {
  function_name = "my-lambda"
  role          = aws_iam_role.lambdaPlaceholder.arn
  filename      = "lambda.zip"
  handler       = "app.lambda_handler"
  runtime       = "python3.14"
}

resource "aws_iam_role" "lambdaPlaceholder" {
  name = "lambda_role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
       {
        Sid = null
        Effect = "Allow"
        Principal = {           
            Service = [
              "lambda.amazonaws.com"
            ]
          
        }
        Actions = "sts:AssumeRole"
      }
    ]
  })
}