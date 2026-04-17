resource "aws_secretsmanager_secret" "resend_api_key" {
  name                    = "${var.project}/resend-api-key"
  recovery_window_in_days = 0
  tags                    = { Project = var.project }
}

resource "aws_secretsmanager_secret_version" "resend_api_key" {
  secret_id     = aws_secretsmanager_secret.resend_api_key.id
  secret_string = var.resend_api_key
}

resource "aws_secretsmanager_secret" "jwt_secret" {
  name                    = "${var.project}/jwt-secret"
  recovery_window_in_days = 0
  tags                    = { Project = var.project }
}

resource "aws_secretsmanager_secret_version" "jwt_secret" {
  secret_id     = aws_secretsmanager_secret.jwt_secret.id
  secret_string = var.jwt_secret
}
