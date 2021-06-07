data "aws_availability_zones" "available" {
  state = "available"
}

module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 2.64.0"

  name = "bookadesk-vpc"

  cidr = "10.0.0.0/16"

  azs             = [data.aws_availability_zones.available.names[0], data.aws_availability_zones.available.names[1]]
  public_subnets = ["10.0.0.0/24", "10.0.1.0/24"]
  database_subnets = ["10.0.10.0/24", "10.0.11.0/24"]

  create_database_subnet_group = false

  map_public_ip_on_launch = false
  enable_dns_hostnames = true

  tags = {
    Description = "Created for ECS cluster bookadesk"
  }
}

resource "aws_security_group" "ecs_security_group" {
  name = "bookadesk" // Value used for being compliant with the legacy security group
  description = "Bookadesk (open) security group" // Value used for being compliant with the legacy security group
  vpc_id = module.vpc.vpc_id

  dynamic "ingress"  {
    for_each = var.http_ports
    content {
      from_port = ingress.value
      to_port = ingress.value
      protocol = "tcp"
      cidr_blocks = ["0.0.0.0/0"]
      ipv6_cidr_blocks = ["::/0"]
    }
  }

  ingress {
      from_port = 8000
      to_port = 8000
      protocol = "tcp"
      cidr_blocks = ["0.0.0.0/0"]
      ipv6_cidr_blocks = ["::/0"]
  }

  egress {
    from_port = "0"
    to_port = "0"
    protocol = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
