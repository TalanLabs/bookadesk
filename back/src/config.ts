const dbPrefix =
  process.env.NODE_ENV === "production" ? "" : `${process.env.NODE_ENV}_`;
const s3Suffix = process.env.NODE_ENV === "production" ? "-prod" : "-dev";
const emailFrom = process.env.EMAIL_FROM || "noreply-bookadesk@example.com";

export default { dbPrefix, s3Suffix, emailFrom };
