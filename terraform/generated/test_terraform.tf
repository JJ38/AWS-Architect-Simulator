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

resource "aws_s3_bucket" "bucket" {
  bucket_prefix = "testing-bucket-"
  force_destroy = false
  tags =  {
    FakeTag = "test"
  }
}

resource "aws_s3_bucket_versioning" "versioning" {
  bucket = aws_s3_bucket.bucket.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_public_access_block" "public_access" {
  bucket = aws_s3_bucket.bucket.id
  block_public_acls = true
  block_public_policy = true
  ignore_public_acls = true
  restrict_public_buckets = true
}
