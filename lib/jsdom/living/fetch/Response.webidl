[Constructor(optional BodyInit? body = null, optional ResponseInit init), Exposed=(Window,Worker)]
interface Response {
  [NewObject] static Response error();
  [NewObject] static Response redirect(USVString url, optional unsigned short status = 302);

  readonly attribute ResponseType type;

  readonly attribute USVString url;
  readonly attribute boolean redirected;
  readonly attribute unsigned short status;
  readonly attribute boolean ok;
  readonly attribute ByteString statusText;
  [SameObject] readonly attribute Headers headers;
  readonly attribute Promise<Headers> trailer;

  [NewObject] Response clone();
};
Response includes Body;

dictionary ResponseInit {
  unsigned short status = 200;
  ByteString statusText = "";
  HeadersInit headers;
};

enum ResponseType { "basic", "cors", "default", "error", "opaque", "opaqueredirect" };
