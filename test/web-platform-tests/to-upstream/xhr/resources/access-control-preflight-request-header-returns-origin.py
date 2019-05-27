def main(request, response):
    if request.method == "OPTIONS":
        response.headers.set("Access-Control-Allow-Origin", request.headers.get('origin'))
        response.headers.set("Access-Control-Allow-Headers", "X-Test")
        response.status = 200
    elif request.method == "GET":
        response.headers.set("Access-Control-Allow-Origin", "*")
        if request.headers.get("X-Test"):
            response.headers.set("Content-Type", "text/plain")
            response.content = "PASS"
        else:
            response.status = 400
