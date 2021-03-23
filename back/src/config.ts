const dbPrefix = process.env.NODE_ENV === "production" ? "" : `${process.env.NODE_ENV}_`;
const s3Suffix = process.env.NODE_ENV === "production" ? "" : "-dev";

export default { dbPrefix, s3Suffix };
