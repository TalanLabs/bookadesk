locals {
  bucket_frontend_name = "bookadesk${local.quote_suffix}.talan.com"
}

resource "aws_s3_bucket" "frontend_bucket" {
  bucket = local.bucket_frontend_name
  acl    = "public-read"
  policy = templatefile("${path.module}/resources/frontend-policy.json", {
    bucket_frontend_name = local.bucket_frontend_name
  })
  website {
    index_document = "index.html"
  }
}
