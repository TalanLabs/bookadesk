resource "aws_iam_role" "ecsTaskRole" {
  name = "ecsTaskRole"

  assume_role_policy = file("${path.module}/resources/ecsTaskRole.json")
}

resource "aws_iam_role" "ecsTaskExecutionRole" {
  name = "bookadeskEcsTaskExecutionRole"

  assume_role_policy = file("${path.module}/resources/ecsTaskExecutionRole.json")
}
