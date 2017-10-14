let inst = 0;
export function getInstance() {
  inst += 1;
  return inst.toString(36);
}

export function guardCallback(component, promise) {
  const origInstance = component.state.instance;
  return new Promise((resolve, reject) => {
    promise.then(
      val => {
        if (component.state.instance !== origInstance) {
          return;
        }
        resolve(val);
      },
      err => {
        if (component.state.instance !== origInstance) {
          return;
        }
        reject(err);
      },
    );
  });
}

export function decodeFileObject(fileObj) {
  if (typeof FileReader === 'undefined') {
    return Promise.reject(new Error('No FileReader available'));
  }
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = e => {
      resolve(e.target.result);
    };
    fr.onerror = err => reject(err);
    fr.readAsArrayBuffer(fileObj);
  });
}

export function downloadAsArrayBuffer(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'arraybuffer';
    xhr.open('GET', url, true);
    xhr.send();

    xhr.onload = () => {
      if (xhr.status !== 200) {
        reject(new Error('Non-200 response code'));
        return;
      }
      const response = xhr.response;
      response.type = xhr.getResponseHeader('content-type');
      response.size = parseFloat(xhr.getResponseHeader('content-length'));
      resolve(response);
    };
    xhr.onerror = () => {
      reject(new Error('Could not download asset'));
    };
  });
}
