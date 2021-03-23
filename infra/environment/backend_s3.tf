resource "aws_s3_bucket" "backend_bucket" {
  bucket = "backend-bucket${local.quote_suffix}.talan.com"
}
