var core = Object.create(require("./core").dom.level3.core),
    html = Object.create(require("../level2/html").dom.level2.html)

exports.dom = {
  level3 : {
    html : html,
    core : core
  }
};
