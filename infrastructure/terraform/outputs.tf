output "amplify_app_url" {
  description = "Temporary Amplify URL to test before connecting custom domain"
  value       = module.amplify.app_url
}

output "dynamodb_table_names" {
  value = module.dynamodb.table_names
}

output "amplify_app_id" {
  value = module.amplify.app_id
}
