// https://webidl.spec.whatwg.org/#quotaexceedederror

[Exposed=(Window,Worker), Serializable]
interface QuotaExceededError : DOMException {
  constructor(optional DOMString message = "", optional QuotaExceededErrorOptions options = {});

  readonly attribute double? quota;
  readonly attribute double? requested;
};

dictionary QuotaExceededErrorOptions {
  double quota;
  double requested;
};
