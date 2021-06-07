resource "aws_ecr_repository" "backend_repository" {
  name                 = "bookadesk"
  image_tag_mutability = "MUTABLE"
}
