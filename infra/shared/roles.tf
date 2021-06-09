resource "aws_iam_role" "ecsTaskRole" {
  name = "ecsTaskRole"

  assume_role_policy = file("${path.module}/resources/ecsTaskRole.json")
}

data aws_iam_policy task_execution_policy {
  arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

data aws_iam_policy s3_full_access {
  arn = "arn:aws:iam::aws:policy/AmazonS3FullAccess"
}

resource "aws_iam_role" "ecsTaskExecutionRole" {
  name = "bookadeskEcsTaskExecutionRole"
  assume_role_policy = file("${path.module}/resources/ecsTaskExecutionRole.json")
}

resource "aws_iam_role_policy_attachment" "ecs-task-execution-role-policy-attach" {
  role = aws_iam_role.ecsTaskExecutionRole.name
  policy_arn = data.aws_iam_policy.task_execution_policy.arn
}

resource "aws_iam_role_policy_attachment" "s3-access-role-policy-attach" {
  role = aws_iam_role.ecsTaskRole.name
  policy_arn = data.aws_iam_policy.s3_full_access.arn
}