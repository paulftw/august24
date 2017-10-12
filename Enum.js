
try {
  let s = Symbol('asd')
} catch (e) {
  var Symbol = function(a) { return '' + a }
}

try {
  let s = new Proxy({}, {})
} catch (e) {
  var Proxy = (o, p) => p
}
/**/

function proxyHandler(args) {
  const names = Array.from(args).reduce((sum, el) => Object.assign(sum, {[el.name]: true}), {})
  return {
    get: function(target, property, receiver) {
      if (!names[property]) {
        throw new Error('Enum has no element ' + property)
      }
      return target[property]
    }
  }
}

export default function Enum() {
  let res = {}
  const symbols = Array.from(arguments).map(name => ({
    name: name,
    symbol: Symbol(name),
  }))

  symbols.forEach(sym => Object.defineProperty(res, sym.name, {
    enumerable: true,
    value: sym.symbol,
  }))
  return new Proxy(res, proxyHandler(symbols, symbols))
}
