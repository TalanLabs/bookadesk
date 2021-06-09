resource "aws_s3_bucket" "backend_bucket" {
  bucket = "bookadesk-open-images${local.quote_suffix}.talan.com"
}
