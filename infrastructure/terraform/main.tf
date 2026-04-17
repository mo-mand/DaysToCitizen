module "dynamodb" {
  source  = "./modules/dynamodb"
  project = var.project
}

module "secrets" {
  source         = "./modules/secrets"
  project        = var.project
  resend_api_key = var.resend_api_key
  jwt_secret     = var.jwt_secret
}

module "iam" {
  source              = "./modules/iam"
  project             = var.project
  dynamodb_table_arns = module.dynamodb.table_arns
  secret_arns         = module.secrets.secret_arns
}

module "amplify" {
  source            = "./modules/amplify"
  project           = var.project
  github_repo       = var.github_repo
  github_token      = var.github_token
  amplify_role_arn  = module.iam.amplify_role_arn
  secret_arns       = module.secrets.secret_arns
  aws_region        = var.aws_region
  resend_api_key    = var.resend_api_key
  jwt_secret        = var.jwt_secret
}
