typedef (File or USVString) FormDataEntryValue;

[Constructor(optional HTMLFormElement form),
 Exposed=(Window,Worker)]
interface FormData {
  // webidl2js doesn't support resolving overloads yet. Give it some help, and handle `value` differentiation manually.
  // https://github.com/jsdom/webidl2js/issues/29
  // void append(USVString name, USVString value);
  // void append(USVString name, Blob value, optional USVString filename);
  void append(USVString name, any value, optional USVString filename);
  void delete(USVString name);
  FormDataEntryValue? get(USVString name);
  sequence<FormDataEntryValue> getAll(USVString name);
  boolean has(USVString name);
  // See above.
  // void set(USVString name, USVString value);
  // void set(USVString name, Blob value, optional USVString filename);
  void set(USVString name, any value, optional USVString filename);
  iterable<USVString, FormDataEntryValue>;
};
