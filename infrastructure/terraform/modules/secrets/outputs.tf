output "secret_arns" {
  value = [
    aws_secretsmanager_secret.resend_api_key.arn,
    aws_secretsmanager_secret.jwt_secret.arn,
  ]
}
