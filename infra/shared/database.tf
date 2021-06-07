//variable "db_password" {}
variable "db_name" {
  default = "bookadesk"
}
variable "authorized_security_groups" {}
variable "developer_ip" {
  type = map(string)
}

resource "aws_secretsmanager_secret" "pg_password" {
  name = "bookadesk-db-password"
}

data "aws_secretsmanager_secret_version" "postgres_password" {
  secret_id = aws_secretsmanager_secret.pg_password.arn
}

locals {
  db_password = data.aws_secretsmanager_secret_version.postgres_password.secret_string
}

resource "aws_db_instance" "database" {
  allocated_storage = 20
  storage_type = "gp2"
  engine = "postgres"
  engine_version = "11.10"
  instance_class = "db.t2.micro"
  publicly_accessible = true
  vpc_security_group_ids = [
    aws_security_group.sg.id]
  apply_immediately = true
  username = "postgres"
  password = local.db_password
  name = var.db_name
  db_subnet_group_name = aws_db_subnet_group.default.name
}

resource "aws_db_subnet_group" "default" {
  name       = "main"
  subnet_ids = module.vpc.database_subnets

  tags = {
    Name = "My DB subnet group"
  }
}

resource "aws_security_group" "sg" {
  name = "${var.db_name}-db-sg"
  description = "Security group for ${var.db_name} database"

  vpc_id = module.vpc.vpc_id

  ingress {
    from_port = 5432
    to_port = 5432
    protocol = "tcp"
    security_groups = var.authorized_security_groups
  }

  # Allow access for developers IPs
  dynamic ingress {
    for_each = var.developer_ip
    content {
      description = ingress.key
      from_port = 5432
      to_port = 5432
      protocol = "tcp"
      cidr_blocks = [
        "${ingress.value}/32"]
    }
  }

  # ping
  ingress {
    from_port = -1
    to_port = -1
    protocol = "icmp"
    cidr_blocks = [
      "0.0.0.0/0"]
    ipv6_cidr_blocks = [
      "::/0"]
  }

  tags = {
    Terraform = true
    Name = "${var.db_name}-db-sg"
    Env = "prod"
  }
}
