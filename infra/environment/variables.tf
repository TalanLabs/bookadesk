variable "env" {
  description = "Environment: (dev, staging or prod)"
  type = string
  validation {
    condition = contains(["dev", "staging", "prod"], var.env)
    error_message = "Possible values for env are: dev, staging or prod."
  }
}

variable "http_port" {
  type = number
}

variable "ecs_cluster_id" {
  type = string
}

variable "ecs_security_group_id" {
  type = string
}

variable "vpc_id" {
  type = string
}

variable "public_subnets" {
  type = list(string)
}

variable "ecs_task_role_arn" {
  type = string
}

variable "ecs_task_execution_role_arn" {
  type = string
}

variable "lb_arn" {
  type = string
}

locals {
  underscore_prefix = "${var.env}_"
  quote_suffix = "-${var.env}"
}

data "aws_region" "current" {}
