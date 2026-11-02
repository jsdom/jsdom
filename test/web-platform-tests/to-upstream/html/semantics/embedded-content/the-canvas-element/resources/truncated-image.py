def main(request, response):
    response.close_connection = True
    return [(b"Content-Type", b"image/png"),
            (b"Content-Length", b"100"),
            (b"Connection", b"close")], b"\x00"
