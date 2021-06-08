locals {
  container_name = "bookadesk${local.quote_suffix}"
}

resource "aws_ecs_service" "default_service" {
  name            = local.container_name
  cluster         = var.ecs_cluster_id
  task_definition = aws_ecs_task_definition.bookadesk_task.arn
  desired_count   = 1
  launch_type     = "FARGATE"
  health_check_grace_period_seconds = 0

  deployment_controller {
    type = "ECS"
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.ecs-default-bookadesk.id
    container_name   = local.container_name
    container_port   = 8000
  }

  network_configuration {
    security_groups = [var.ecs_security_group_id]
    subnets         = var.public_subnets
    assign_public_ip= true
  }

  depends_on = [aws_lb_target_group.ecs-default-bookadesk]
}


resource "aws_ecs_task_definition" "bookadesk_task" {
  family                = local.container_name
  cpu = 256
  memory = 512
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  execution_role_arn = var.ecs_task_execution_role_arn
  task_role_arn = var.ecs_task_role_arn
  container_definitions    = <<DEFINITION
[
  {
    "logConfiguration": {
      "logDriver": "awslogs",
      "options": {
        "awslogs-group": "${aws_cloudwatch_log_group.ecs_log_group.name}",
        "awslogs-region": "${data.aws_region.current.name}",
        "awslogs-stream-prefix": "ecs"
      }
    },
    "portMappings": [
      {
        "hostPort": 8000,
        "protocol": "tcp",
        "containerPort": 8000
      }
    ],
    "cpu": 0,
    "environment": ${jsonencode(var.app_environment_vars)},
    "essential": true,
    "mountPoints": [],
    "volumesFrom": [],
    "image": "${aws_ecr_repository.backend_repository.repository_url}",
    "name": "${local.container_name}"
  }
]
  DEFINITION
}

resource "aws_cloudwatch_log_group" "ecs_log_group" {
  name = "/ecs/bookadesk${local.quote_suffix}"
}
