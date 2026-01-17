def main(request, response):
    status = int(request.GET.first(b"status", b"200"))
    flag_name = request.GET.first(b"flag", b"script" + str(status).encode() + b"Ran")

    headers = [(b"Content-Type", b"text/javascript")]
    body = b"window." + flag_name + b" = true;"

    return status, headers, body
