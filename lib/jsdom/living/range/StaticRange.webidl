dictionary StaticRangeInit {
  required Node startContainer;
  required unsigned long startOffset;
  required Node endContainer;
  required unsigned long endOffset;
};

[Constructor(StaticRangeInit init), Exposed=Window]
interface StaticRange : AbstractRange {};
