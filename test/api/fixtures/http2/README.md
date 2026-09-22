The self-signed certificate and private key are test fixtures for the local HTTP/2 server. The tests trust this certificate explicitly without disabling TLS verification.

To regenerate them from this directory:

```sh
openssl req -x509 -newkey rsa:2048 -noenc -keyout key.pem -out cert.pem -days 36500 -subj '/CN=localhost' -addext 'subjectAltName=DNS:localhost,IP:127.0.0.1'
```
