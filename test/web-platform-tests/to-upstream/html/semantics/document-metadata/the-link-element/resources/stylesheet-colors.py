def main(request, response):
    status = int(request.GET.first(b"status", b"200"))
    element_id = request.GET.first(b"id", b"target")

    headers = [(b"Content-Type", b"text/css")]
    body = b"#" + element_id + b" { color: rgb(255, 0, 0); }"

    return status, headers, body
