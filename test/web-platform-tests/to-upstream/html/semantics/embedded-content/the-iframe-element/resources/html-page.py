def main(request, response):
    status = int(request.GET.first(b"status", b"200"))
    title = request.GET.first(b"title", b"Test Page")

    headers = [(b"Content-Type", b"text/html")]

    if status == 404:
        title = b"Not Found"
        body = b"<!DOCTYPE html><title>Not Found</title><h1>404 Not Found</h1>"
    elif status == 503:
        title = b"Service Unavailable"
        body = b"<!DOCTYPE html><title>Service Unavailable</title><h1>503 Service Unavailable</h1>"
    else:
        body = b"<!DOCTYPE html><title>" + title + b"</title><h1>OK</h1>"

    return status, headers, body
