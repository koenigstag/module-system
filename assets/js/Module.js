/* 
  MyModule system
  Promise API is intentionally not used
*/

// TODO classes
function ModulesCore() {
  this.version = '0.0.1';
  this.codename = 'myModule';
}

ModulesCore.prototype = Object.assign(ModulesCore.prototype, {
  isDefaultCode: function(codename) {
    return window.modules.codename === codename;
  },
  getPathParts: function (path) {
    return window.pathParse(path);
  },
  getFileName: function (path) {
    return this.getPathParts(path).base;
  },
  getModuleName: function (path) {
    return this.getPathParts(path).name;
  },
  getFileExt: function (path) {
    return this.getPathParts(path).ext;
  },
  calcAbsPath: function (here = '/', path = '.') {
    return new URL(`${here}/${path}`, window.location.origin).pathname;
  },
});

function ModuleNamespace(name) {
  this.name = name;
  this.definitions = {};
  this.meta = {};
}

function ModuleMeta(codename, namespace, path = null) {
  this.codename = codename;
  this.namespace = namespace;
  this.path = path;
  this.type = 'text/javascript';
}

// init modules
if (!(window.modules instanceof ModulesCore)) {
  window.modules = new ModulesCore();
}

window.defineModule = async function createModule(moduleName, imports, callback, options = { type: window.modules.codename, namespace: 'main' }) {
  // init manespace
  if (!window.modules[options.namespace]) {
    window.modules[options.namespace] = new ModuleNamespace(options.namespace);
  }

  const namespace = window.modules[options.namespace];

  // module function
  async function definition () {
    'use strict';

    if (definition.cache) {
      // return export data for import method
      return definition.cache;
    }

    // calc imports
    const importedValuesArray = await window.importModules(imports, options);

    // calc export data
    const exportObj = await callback(importedValuesArray);

    // cache export
    definition.cache = exportObj;

    // return export data for import method
    return exportObj;
  }

  namespace.definitions[moduleName] = definition;

  // module meta
  namespace.meta[moduleName] = new ModuleMeta(options.type, options.namespace);
}

window.initModule = async function initModule (moduleName, absPath = '/', options = { type: window.modules.codename, namespace: 'main' }) {
  const namespace = window.modules[options.namespace];

  if(!namespace) {
    throw new Error('Cannot find requested namespace');
  }

  const moduleDefinition = namespace.definitions[moduleName];

  if (!moduleDefinition) {
    throw new Error(`Module ${moduleName} not found in namespace '${options.namespace}'`);
  }

  if (namespace.meta?.[moduleName]) {
    namespace.meta[moduleName].path = absPath;
  }

  return await moduleDefinition();
}

window.importModules = function importModules(path = null, options = { type: window.modules.codename, namespace: 'main' }) {
  const namespace = window.modules[options.namespace];

  if (!namespace) {
    throw new Error(`Cannot find definition of '${options.namespace}' namespace`);
  }

  const pathArray = [];
  if (path === null) {
    return;
  } else if (Array.isArray(path)) {
    Object.assign(pathArray, path);
  } else if (typeof path === 'string') {
    pathArray.push(path);
  } else {
    throw new TypeError('Path argument should be either an Array or string type');
  }

  const importPromises = [];
  for (const path of pathArray) {
    // TODO calcAbsPath
    // const absPath = window.modules.calcAbsPath(here, path);
    const absPath = path;
    const fileExt = window.modules.getFileExt(path);
    const moduleName = window.modules.getModuleName(path);

    // if module is not defined
    const script = document.createElement('script');

    script.setAttribute('src', absPath);

    // other attributes depending on options
    if (fileExt === '.js' && window.modules.isDefaultCode(options.type)) {
      script.setAttribute('type', 'text/javascript');

      const loadPromise = new Promise((resolve, reject) => {
        script.addEventListener('load', async function importOnLoad() {
          resolve(await window.initModule(moduleName, absPath));

          if (namespace.meta?.[moduleName]) {
            namespace.meta[moduleName].path = absPath;
          }
        });
        script.addEventListener('error', function importOnError() {
          reject(new Error(`Failed to load module file '${moduleName}' of type '${options.type}'`));
        });
      });
      
      importPromises.push(loadPromise);
    } else if (fileExt === '.cjs' || fileExt === '.mjs') {
      // INFO: This may change in future updates
      throw new Error(`Cannot load script of ${fileExt} file extension. Only .js allowed`);
    } else {
      throw new Error(`Cannot load script of ${fileExt} file extension`);
    }

    document.head.append(script);
  }

  return Promise.all(importPromises).then(importedValuesArray => {
    if (importedValuesArray.length === 0) {
      return null;
    }
    return importedValuesArray.length === 1 ? importedValuesArray[0] : importedValuesArray;
  });
}
