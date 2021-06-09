resource "aws_iam_role" "ecsTaskRole" {
  name = "ecsTaskRole"

  assume_role_policy = file("${path.module}/resources/ecsTaskRole.json")
}

data aws_iam_policy task_execution_policy {
  arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_role" "ecsTaskExecutionRole" {
  name = "bookadeskEcsTaskExecutionRole"
  assume_role_policy = file("${path.module}/resources/ecsTaskExecutionRole.json")
}

resource "aws_iam_role_policy_attachment" "sto-readonly-role-policy-attach" {
  role = aws_iam_role.ecsTaskExecutionRole.name
  policy_arn = data.aws_iam_policy.task_execution_policy.arn
}