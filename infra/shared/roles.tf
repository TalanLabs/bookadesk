resource "aws_iam_role" "deskBookingTaskRole" {
  name = "deskBookingTaskRole"

  assume_role_policy = file("${path.module}/resources/deskBookingTaskRole.json")
  description = "Acces DynamoDB"
}

resource "aws_iam_role" "ecsTaskExecutionRole" {
  name = "ecsTaskExecutionRole"

  assume_role_policy = file("${path.module}/resources/ecsTaskExecutionRole.json")
}
