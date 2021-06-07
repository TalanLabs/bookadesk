output "ecs_custer_id" {
  value = aws_ecs_cluster.default_cluster.id
}

output "ecs_security_group_id" {
  value = aws_security_group.ecs_security_group.id
}

output "vpc_id" {
  value = module.vpc.vpc_id
}

output "public_subnets" {
  value = module.vpc.public_subnets
}

output "ecs_task_role_arn" {
  value = aws_iam_role.ecsTaskRole.arn
}

output "ecs_task_execution_role_arn" {
  value = aws_iam_role.ecsTaskExecutionRole.arn
}

output "lb_arn" {
  value = aws_lb.bookadesk_alb.arn
}

