// https://xhr.spec.whatwg.org/#interface-formdata
typedef (File or USVString) FormDataEntryValue;

[Exposed=(Window,Worker)]
interface FormData {
  constructor(optional HTMLFormElement form);

  void append(USVString name, USVString value);
  void append(USVString name, Blob value, optional USVString filename);
  void delete(USVString name);
  FormDataEntryValue? get(USVString name);
  sequence<FormDataEntryValue> getAll(USVString name);
  boolean has(USVString name);
  void set(USVString name, USVString value);
  void set(USVString name, Blob value, optional USVString filename);
  iterable<USVString, FormDataEntryValue>;
};
