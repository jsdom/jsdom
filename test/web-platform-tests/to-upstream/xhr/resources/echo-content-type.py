def main(request, response):
    response.writer.write_status(200)
    response.writer.write_header("Content-Type", "text/plain")
    response.writer.end_headers()
    response.content = request.headers["Content-Type"]
    response.close_connection = True
