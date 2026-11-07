let frameCounter = 0

const BOOTSTRAP = `
(function () {
  function serialize(value) {
    try {
      if (typeof value === 'undefined') return '__undefined__';
      if (typeof value === 'function') return '__function__';
      return JSON.parse(JSON.stringify(value));
    } catch (err) {
      return String(value);
    }
  }

  window.addEventListener('message', function (event) {
    var data = event.data || {};
    if (!data.id) return;

    var results = [];
    var error = null;

    try {
      var tests = data.tests || [];
      var body =
        data.code +
        '\\n;return tests.map(function (test) { try { var actual = eval(test.expr); var a = serialize(actual); var expected = serialize(test.expected); return { pass: JSON.stringify(a) === JSON.stringify(expected), actual: a, expected: expected, expr: test.expr }; } catch (inner) { return { pass: false, error: String(inner), expr: test.expr }; } });';
      var runner = new Function('tests', 'serialize', body);
      var output = runner(tests, serialize);
      if (!Array.isArray(output)) {
        error = 'Your code returned early. Use return only inside a function.';
        results = [];
      } else {
        results = output;
      }
    } catch (err) {
      error = String(err);
    }

    parent.postMessage({ id: data.id, result: { error: error, results: results } }, '*');
  });
})();
`

export function runCodeInSandbox(code, tests, timeoutMs = 2500) {
  return new Promise((resolve) => {
    if (typeof document === 'undefined') {
      resolve({ error: 'Code execution is not available here.', results: [] })
      return
    }

    const id = `ck-sandbox-${Date.now()}-${++frameCounter}`
    const iframe = document.createElement('iframe')
    iframe.setAttribute('sandbox', 'allow-scripts')
    iframe.style.cssText =
      'position:absolute;width:0;height:0;border:0;opacity:0;pointer-events:none;'
    iframe.srcdoc = `<!doctype html><html><body><script>${BOOTSTRAP}</script></body></html>`

    let settled = false
    let timer = null

    const cleanup = () => {
      window.removeEventListener('message', onMessage)
      if (timer) clearTimeout(timer)
      if (iframe.parentNode) iframe.parentNode.removeChild(iframe)
    }

    const finish = (result) => {
      if (settled) return
      settled = true
      cleanup()
      resolve(result)
    }

    function onMessage(event) {
      if (event.source !== iframe.contentWindow) return
      const data = event.data
      if (!data || data.id !== id) return
      finish(data.result)
    }

    window.addEventListener('message', onMessage)
    iframe.onload = () => {
      try {
        iframe.contentWindow.postMessage({ id, code, tests }, '*')
      } catch (error) {
        finish({ error: String(error), results: [] })
      }
    }

    timer = setTimeout(() => {
      finish({
        error: 'Your code took too long. Check for an infinite loop.',
        timedOut: true,
        results: [],
      })
    }, timeoutMs)

    document.body.appendChild(iframe)
  })
}

export function normalizeAnswer(value) {
  return String(value ?? '')
    .trim()
    .replace(/\s+/g, ' ')
}

export function isBlankCorrect(input, answers = [], ignoreCase = false) {
  const cleaned = normalizeAnswer(input)
  return answers.some((answer) => {
    const target = normalizeAnswer(answer)
    return ignoreCase
      ? cleaned.toLowerCase() === target.toLowerCase()
      : cleaned === target
  })
}

export function normalizeCode(value) {
  return String(value ?? '')
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .trim()
}
