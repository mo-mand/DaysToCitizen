variable "aws_region" {
  default = "ca-central-1"
}

variable "project" {
  default = "daystocitizen"
}

variable "resend_api_key" {
  description = "Resend API key for OTP email delivery"
  type        = string
  sensitive   = true
}

variable "jwt_secret" {
  description = "Secret used to sign JWT session cookies"
  type        = string
  sensitive   = true
}

variable "github_repo" {
  description = "GitHub repo for Amplify CI/CD (owner/repo)"
  type        = string
}

variable "github_token" {
  description = "GitHub personal access token for Amplify"
  type        = string
  sensitive   = true
}
