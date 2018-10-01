def main(request, response):
    headers = [("X-Request-Method", request.method),
               ("X-Request-Content-Length", request.headers.get("Content-Length", "NO")),
               ("X-Request-Content-Type", request.headers.get("Content-Type", "NO")),
               ("Access-Control-Allow-Credentials", "true"),
               # Avoid any kind of content sniffing on the response.
               ("Content-Type", "text/plain")]

    origin = request.GET.first("origin", request.headers.get('origin'))
    if origin != None:
        headers.append(("Access-Control-Allow-Origin", origin))

    request_headers = request.GET.first("origin", request.headers.get('access-control-request-headers'))
    if request_headers != None:
        headers.append(("Access-Control-Allow-Headers", request_headers))

    request_method = request.GET.first("origin", request.headers.get('access-control-request-method'))
    if request_method != None:
        headers.append(("Access-Control-Allow-Methods", "OPTIONS, " + request_method))

    content = request.body

    return headers, content
