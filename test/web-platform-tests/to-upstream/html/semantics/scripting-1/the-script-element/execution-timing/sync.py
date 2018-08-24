import time

def main(request, response):
    response.headers.append("Content-Type", "text/javascript")
    try:
        delay = int(request.GET.first("sec"))
    except:
        response.set_error(400, "Invalid parameter")

    time.sleep(int(delay))

    return "window.newfunction = function () { log('run');};"
