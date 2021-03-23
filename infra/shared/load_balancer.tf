resource "aws_lb" "bookadesk_alb" {
  name               = "alb-desk-booking"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.ecs_security_group.id]
  subnets            = module.vpc.public_subnets
}
