output "app_url" {
  value = "https://main.${aws_amplify_app.app.default_domain}"
}

output "app_id" {
  value = aws_amplify_app.app.id
}
