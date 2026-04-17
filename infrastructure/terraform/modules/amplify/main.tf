resource "aws_amplify_app" "app" {
  name         = var.project
  repository   = "https://github.com/${var.github_repo}"
  access_token = var.github_token
  iam_service_role_arn = var.amplify_role_arn

  build_spec = <<-YAML
    version: 1
    frontend:
      phases:
        preBuild:
          commands:
            - npm ci
        build:
          commands:
            - npm run build
      artifacts:
        baseDirectory: .next
        files:
          - '**/*'
      cache:
        paths:
          - node_modules/**/*
  YAML

  environment_variables = {
    NEXT_PUBLIC_ENV        = "production"
    APP_REGION             = var.aws_region
    RESEND_API_KEY         = var.resend_api_key
    JWT_SECRET             = var.jwt_secret
    EMAIL_FROM             = "DaysToCitizen <noreply@verification.daystocitizen.ca>"
    DYNAMODB_USERS_TABLE   = "daystocitizen-users"
    DYNAMODB_STAYS_TABLE   = "daystocitizen-stays"
    DYNAMODB_OTPS_TABLE    = "daystocitizen-otps"
  }

  platform = "WEB_COMPUTE"

  tags = { Project = var.project }
}

resource "aws_amplify_branch" "main" {
  app_id      = aws_amplify_app.app.id
  branch_name = "master"
  framework   = "Next.js - SSR"
  stage       = "PRODUCTION"

  enable_auto_build = true
}
