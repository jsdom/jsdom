// https://xhr.spec.whatwg.org/#interface-formdata
typedef (File or USVString) FormDataEntryValue;

[Exposed=(Window,Worker)]
interface FormData {
  constructor(optional HTMLFormElement form, optional HTMLElement? submitter = null);

  undefined append(USVString name, USVString value);
  undefined append(USVString name, Blob value, optional USVString filename);
  undefined delete(USVString name);
  FormDataEntryValue? get(USVString name);
  sequence<FormDataEntryValue> getAll(USVString name);
  boolean has(USVString name);
  undefined set(USVString name, USVString value);
  undefined set(USVString name, Blob value, optional USVString filename);
  iterable<USVString, FormDataEntryValue>;
};
