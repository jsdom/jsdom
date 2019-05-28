def main(request, response):
    response.headers.set("Content-Type", "text/plain")
    response.status = 200
    response.content = request.headers["Content-Type"]
    response.close_connection = True
