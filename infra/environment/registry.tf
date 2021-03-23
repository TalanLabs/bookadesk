resource "aws_ecr_repository" "backend_repository" {
  name                 = "desk-booking${local.quote_suffix}"
  image_tag_mutability = "MUTABLE"
}
