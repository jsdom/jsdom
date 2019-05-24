def main(request, response):
    response.headers.set("Cache-Control", "no-store")
    response.headers.set("Access-Control-Max-Age", 0)
    response.content = request.headers["Content-Type"]

