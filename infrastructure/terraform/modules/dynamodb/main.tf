resource "aws_dynamodb_table" "users" {
  name         = "${var.project}-users"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "email"
    type = "S"
  }

  global_secondary_index {
    name            = "email-index"
    hash_key        = "email"
    projection_type = "ALL"
  }

  tags = { Project = var.project }
}

resource "aws_dynamodb_table" "stays" {
  name         = "${var.project}-stays"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "userId"
  range_key    = "id"

  attribute {
    name = "userId"
    type = "S"
  }

  attribute {
    name = "id"
    type = "S"
  }

  tags = { Project = var.project }
}

resource "aws_dynamodb_table" "otps" {
  name         = "${var.project}-otps"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "email"

  attribute {
    name = "email"
    type = "S"
  }

  # OTPs auto-delete after 10 minutes via DynamoDB TTL
  ttl {
    attribute_name = "ttl"
    enabled        = true
  }

  tags = { Project = var.project }
}
