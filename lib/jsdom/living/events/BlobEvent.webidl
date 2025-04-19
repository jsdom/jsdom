// https://w3c.github.io/mediacapture-record/#blobevent-section
[Exposed=Window]
interface BlobEvent : Event {
  constructor(DOMString type, BlobEventInit eventInitDict);
  [SameObject] readonly attribute Blob data;
  readonly attribute DOMHighResTimeStamp timecode;
};

dictionary BlobEventInit : EventInit {
  required Blob data;
  DOMHighResTimeStamp timecode;
};
