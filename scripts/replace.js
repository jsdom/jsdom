const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '../lib/jsdom/living/generated/HTMLFormElement.js');
const searchText = 'return Object.create(proto);';
const replaceText = `return new globalObject.Proxy(Object.create(proto), {
    get(target, propKey, receiver) {
      if (typeof propKey === 'string' && target.children.namedItem(propKey)) {
        return target.children.namedItem(propKey);
      }
      return globalObject.Reflect.get(target, propKey, receiver);
    }
  });`;

fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('读取文件时出错：', err);
    return;
  }

  if (data.split(searchText).length !== 2) {
    console.error('要替换的文本未出现或者出现了多次，请手动处理。');
    return;
  }

  const modifiedData = data.replace(searchText, replaceText);

  fs.writeFile(filePath, modifiedData, 'utf8', (err) => {
    if (err) {
      console.error('写入文件时出错：', err);
      return;
    }
  });
});
