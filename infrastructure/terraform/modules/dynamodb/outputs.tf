output "table_arns" {
  value = [
    aws_dynamodb_table.users.arn,
    aws_dynamodb_table.stays.arn,
    aws_dynamodb_table.otps.arn,
  ]
}

output "table_names" {
  value = {
    users = aws_dynamodb_table.users.name
    stays = aws_dynamodb_table.stays.name
    otps  = aws_dynamodb_table.otps.name
  }
}
