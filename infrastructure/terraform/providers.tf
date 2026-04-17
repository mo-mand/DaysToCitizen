terraform {
  required_version = ">= 1.5"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket         = "dtc-terraform-state-723951822691"
    key            = "daystocitizen/terraform.tfstate"
    region         = "ca-central-1"
    dynamodb_table = "dtc-terraform-locks"
    encrypt        = true
    profile        = "dtc"
  }
}

provider "aws" {
  region  = var.aws_region
  profile = "dtc"
}
