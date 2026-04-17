variable "project" {}
variable "github_repo" {}
variable "github_token" { sensitive = true }
variable "amplify_role_arn" {}
variable "secret_arns" { type = list(string) }
variable "aws_region" {}
variable "resend_api_key" { sensitive = true }
variable "jwt_secret" { sensitive = true }
