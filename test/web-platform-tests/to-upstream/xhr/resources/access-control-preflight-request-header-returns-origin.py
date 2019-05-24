def main(request, response):
    response.headers.set("Cache-Control", "no-store")
    response.headers.set("Access-Control-Allow-Origin", "*")
    response.headers.set("Access-Control-Max-Age", 0)

    if request.method == "OPTIONS":
        response.headers.set('Access-Control-Allow-Origin', request.headers.get('origin'))
        response.headers.set("Access-Control-Allow-Headers", "X-Test")
        response.status = 200
    elif request.method == "GET":
        response.headers.set("Access-Control-Allow-Origin", "*")
        if request.headers.get("X-Test"):
            response.content = "PASS"
        else:
            response.status = 400
