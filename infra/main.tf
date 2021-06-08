terraform {
  backend "s3" {
    bucket = "tf-state.bookadesk.talan.com"
    key = "bookadesk.tfstate.v2"
    region = "eu-west-3"

    shared_credentials_file = "aws_credentials"
  }
}

locals {
  environment = {
    prod = {
      env = "prod"
      http_port = 8002
      env_vars= [
//        {
//          name= "OFFICES_REPO",
//          value="POSTGRES"
//        }
      ]
    }
  }
}

module "shared" {
  source = "./shared"
  http_ports = values(local.environment)[*].http_port
  authorized_security_groups = [
    module.shared.ecs_security_group_id]
  developer_ip = {}
}

module "environments" {
  source = "./environment"
  for_each = local.environment
  env = each.value.env
  http_port = each.value.http_port
  app_environment_vars = each.value.env_vars

  ecs_cluster_id = module.shared.ecs_custer_id
  ecs_security_group_id = module.shared.ecs_security_group_id

  vpc_id = module.shared.vpc_id
  public_subnets = module.shared.public_subnets

  ecs_task_role_arn = module.shared.ecs_task_role_arn
  ecs_task_execution_role_arn = module.shared.ecs_task_execution_role_arn

  lb_arn = module.shared.lb_arn
}
