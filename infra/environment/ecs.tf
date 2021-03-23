locals {
  container_name = "desk-booking${local.quote_suffix}"
}

resource "aws_ecs_service" "default_service" {
  name            = local.container_name
  cluster         = var.ecs_cluster_id
  task_definition = aws_ecs_task_definition.desk_booking_task.arn
  desired_count   = 1
  launch_type     = "FARGATE"
  health_check_grace_period_seconds = 0

  deployment_controller {
    type = "ECS"
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.ecs-default-desk-booking.id
    container_name   = local.container_name
    container_port   = 8000
  }

  network_configuration {
    security_groups = [var.ecs_security_group_id]
    subnets         = var.public_subnets
    assign_public_ip= true
  }

  depends_on = [aws_lb_target_group.ecs-default-desk-booking]
}

resource "aws_ecs_task_definition" "desk_booking_task" {
  family                = local.container_name
  container_definitions = templatefile("${path.module}/resources/task_definition.json", {
    registry_docker_image = aws_ecr_repository.backend_repository.repository_url
    log_group = aws_cloudwatch_log_group.ecs_log_group.name
    task_name = local.container_name
    region = data.aws_region.current.name
  })
  cpu = 256
  memory = 512
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  execution_role_arn = var.ecs_task_execution_role_arn
  task_role_arn = var.desk_booking_task_role_arn
}

resource "aws_cloudwatch_log_group" "ecs_log_group" {
  name = "/ecs/desk-booking${local.quote_suffix}"
}
