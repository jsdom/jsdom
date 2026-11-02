from html import escape
from urllib.parse import urlencode


def main(request, response):
    key = request.GET.first(b"key")
    action = request.GET.first(b"action", b"image")
    response.headers.set(b"Cache-Control", b"no-store")

    if action == b"document":
        dimensions = request.GET.first(b"dimensions")
        if request.GET.first(b"timing") == b"load":
            attributes = {
                b"height": ' onload="this.onload = null; this.height = 2"',
                b"width": ' onload="this.onload = null; this.width = 2"'
            }[dimensions]
        else:
            attributes = {
                b"none": "",
                b"height": ' height="1"',
                b"width": ' width="1"',
                b"both": ' width="1" height="1"'
            }[dimensions]
        src = escape("?" + urlencode({"key": key}), quote=True)
        response.headers.set(b"Content-Type", b"text/html")
        return f'<!DOCTYPE html><img src="{src}"{attributes}>'

    with request.server.stash.lock:
        count = request.server.stash.take(key) or 0
        if action == b"count":
            response.headers.set(b"Content-Type", b"text/plain")
            return str(count)
        request.server.stash.put(key, count + 1)

    response.headers.set(b"Content-Type", b"image/svg+xml")
    return b'<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"/>'
