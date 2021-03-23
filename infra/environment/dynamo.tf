resource "aws_dynamodb_table" "bookings-table" {
  name           = "${local.underscore_prefix}Bookings"
  billing_mode   = "PROVISIONED"
  read_capacity  = 1
  write_capacity = 1
  hash_key       = "id"

  attribute {
    name = "id"
    type = "S"
  }

  tags = {
    "DDBTableGroupKey-${var.env}" = var.env
  }
}

resource "aws_dynamodb_table" "floors-table" {
  name           = "${local.underscore_prefix}Floors"
  billing_mode   = "PROVISIONED"
  read_capacity  = 5
  write_capacity = 5
  hash_key       = "id"

  attribute {
    name = "id"
    type = "S"
  }

  tags = {
    "DDBTableGroupKey-${var.env}" = var.env
  }
}

resource "aws_dynamodb_table" "missing-supplies-table" {
  name           = "${local.underscore_prefix}MissingSupplies"
  billing_mode   = "PROVISIONED"
  read_capacity  = 1
  write_capacity = 1
  hash_key       = "id"
  range_key      = "createdAt"

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "createdAt"
    type = "N"
  }

  tags = {
    "DDBTableGroupKey-${var.env}" = var.env
  }
}

resource "aws_dynamodb_table" "offices-table" {
  name           = "${local.underscore_prefix}Offices"
  billing_mode   = "PROVISIONED"
  read_capacity  = 5
  write_capacity = 5
  hash_key       = "id"

  attribute {
    name = "id"
    type = "S"
  }

  tags = {
    "DDBTableGroupKey-${var.env}" = var.env
  }
}

resource "aws_dynamodb_table" "places-table" {
  name           = "${local.underscore_prefix}Places"
  billing_mode   = "PROVISIONED"
  read_capacity  = 1
  write_capacity = 1
  hash_key       = "id"

  attribute {
    name = "id"
    type = "S"
  }

  tags = {
    "DDBTableGroupKey-${var.env}" = var.env
  }
}

