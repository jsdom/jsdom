import json


def main(request, response):
    response.headers.set(b"Content-Type", b"application/json")
    response.headers.set(b"Cache-Control", b"no-store")
    response.headers.set(b"Access-Control-Allow-Origin", request.headers.get(b"Origin", b"*"))
    response.headers.set(b"Access-Control-Allow-Credentials", b"true")

    if b"challenge" in request.GET and request.auth.username != request.GET.first(b"challenge"):
        response.status = 401
        response.headers.set(b"WWW-Authenticate", b'Basic realm="' + request.GET.first(b"challenge") + b'"')
    elif b"location" in request.GET:
        response.status = 302
        response.headers.set(b"Location", request.GET.first(b"location"))

    if b"cookie" in request.GET:
        response.headers.set(b"Set-Cookie", request.GET.first(b"cookie"))

    return json.dumps({
        "authorization": request.headers.get(b"Authorization", b"").decode("ascii"),
        "cookie": request.headers.get(b"Cookie", b"").decode("ascii")
    })
