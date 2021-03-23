resource "aws_lb_listener" "bookadesk_alb_listener" {
  load_balancer_arn = var.lb_arn
  port              = var.http_port
  protocol          = "HTTP"

  default_action {
    target_group_arn = aws_lb_target_group.ecs-default-desk-booking.arn
    type             = "forward"
  }
}

resource "aws_lb_target_group" "ecs-default-desk-booking" {
  name                = "ecs-default-desk-booking${local.quote_suffix}"
  port                = var.http_port
  protocol            = "HTTP"
  vpc_id              = var.vpc_id
  target_type = "ip"
  load_balancing_algorithm_type = "round_robin"

  health_check {
    healthy_threshold   = "5"
    unhealthy_threshold = "2"
    interval            = "30"
    matcher             = "200"
    path                = "/health"
    port                = "traffic-port"
    protocol            = "HTTP"
    timeout             = "5"
  }

  lifecycle {
    create_before_destroy = true
  }
}
