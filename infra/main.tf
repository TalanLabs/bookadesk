terraform {
  backend "s3" {
    bucket = "tf-state.bookadesk.talan.com"
    key    = "bookadesk.tfstate"
    region = "eu-west-3"

    shared_credentials_file = "aws_credentials"
  }
}

locals {
  environment = {
    staging = {
      env = "staging"
      http_port = 8081
    },
    prod = {
      env = "prod"
      http_port = 80
    }
  }
}

module "shared" {
  source = "./shared"
  http_ports = values(local.environment)[*].http_port
}

module "environments" {
  source = "./environment"
  for_each = local.environment
  env = each.value.env
  http_port = each.value.http_port

  ecs_cluster_id = module.shared.ecs_custer_id
  ecs_security_group_id = module.shared.ecs_security_group_id

  vpc_id = module.shared.vpc_id
  public_subnets = module.shared.public_subnets

  desk_booking_task_role_arn = module.shared.desk_booking_task_role_arn
  ecs_task_execution_role_arn = module.shared.ecs_task_execution_role_arn

  lb_arn = module.shared.lb_arn
}
