export const insecureDeserialization = {
  guidance: () =>
    'Added a `@Consumes` annotation restricting the endpoint to common safe media types (JSON, XML, form, multipart, octet-stream, plain text). Requests with `Content-Type: application/x-java-serialized-object` are no longer routed to the RESTEasy `SerializableProvider`. If your endpoint legitimately accepts a content type not in this allowlist (e.g. `image/png`, a custom JSON variant), expect HTTP 415 from those clients and extend the `@Consumes` list to include it.',
}
