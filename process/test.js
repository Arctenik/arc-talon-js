(function(extImports) {if (typeof talon === "undefined") {talon = {files: {}, funcs: {print: 1, printf: 1, printc: 1, getstr: 1, format: 1, colored: 1, import: 1, int: 1, float: 1, round: 1, log: 1, sqrt: 1, sin: 1, cos: 1, tan: 1, asin: 1, acos: 1, atan: 1, atan2: 1, random: 1, randomint: 1, str: 1, len: 1, ord: 1, chr: 1, lower: 1, upper: 1, startswith: 1, endswith: 1, replace: 1, split: 1, list: 1, append: 1, pop: 1, push: 1, remove: 1, reverse: 1, sort: 1}, vars: {}}}; let groupEnv = talon; extImports.forEach(([name, isProp, isFunc, f1, f2]) => {if (isFunc || isProp) {if (groupEnv.funcs[name]) throw new Error("Can't import duplicate function " + JSON.stringify(name)); groupEnv.funcs[name] = {type: "external", isProp, func: f1, call(...args) {return this.func(...args)}}} else {if (groupEnv.vars[name]) throw new Error("Can't import duplicate variable " + JSON.stringify(name)); groupEnv.vars[name] = {type: "external", isProp, getData: f1, setData: f2, set value(v) {this.setData(v)}, get value() {return this.getData()}}}}); groupEnv.files["test.tal"] = {run(env = groupEnv) {}}; let styleCodes = {black: "30", red: "31", green: "32", yellow: "33", blue: "34", magenta: "35", cyan: "36", lightgray: "37", darkgray: "90", lightred: "91", lightgreen: "92", lightyellow: "93", lightblue: "94", lightmagenta: "95", lightcyan: "96", white: "97", bold: "1", dim: "2", italic: "3", underline: "4", blink: "5", reverse: "7", hidden: "8", bgblack: "40", bgred: "41", bggreen: "42", bgyellow: "43", bgblue: "44", bgmagenta: "45", bgcyan: "46", bglightgray: "47", bgdarkgray: "100", bglightred: "101", bglightgreen: "102", bglightyellow: "103", bglightblue: "104", bglightmagenta: "105", bglightcyan: "106", bgwhite: "107"}; groupEnv.files["test.tal"].run(); function f_print (...args) {console.log(...convertStyles(args.map(d => f_str(d)).join(" ")))}; function f_printf (string, list) {f_print(f_format(string, list))}; function f_printc (string) {f_print(f_colored(string))}; function f_getstr (message) {return prompt(message === undefined ? undefined : f_str(message))}; function f_format (string, list) {return string.replace(/%(%|-?\d+)/, (m, code) => code == "%" ? "%" : f_str(ref(list, parseInt(code))))}; function f_colored (string) {let currentStyles = [], result = ""; for (let i = 0; i < string.length; ) {let match = /^\[(\/?[a-z]*)\]/i.exec(string.substring(i)); if (match) {if (match[1][0] === "/") {currentStyles.pop(); result += "\x1b[0" + currentStyles.map(c => ";" + c) + "m"} else {let code = styleCodes[match[1]]; currentStyles.push(code); result += "\x1b[" + code + "m"}; i += match[0].length} else {result += string[i]; i++}}; return result}; function f_import (name) {groupEnv.files[name].run()}; function f_int (val, base) {if (isNum(val)) return Math.floor(val); else return parseInt(val, base)}; function f_float (val) {if (typeof val === "boolean") val = +val; let result = new Number(parseFloat(val)); result.isFloat = true; return result}; function f_round (n) {return Math.round(n)}; function f_log (n, base) {return f_float(base === undefined ? Math.log(n) : Math.log(n)/Math.log(base))}; function f_sqrt (n) {return f_float(Math.sqrt(n))}; function f_sin (n) {return f_float(Math.sin(n))}; function f_cos (n) {return f_float(Math.cos(n))}; function f_tan (n) {return f_float(Math.tan(n))}; function f_asin (n) {return f_float(Math.asin(n))}; function f_acos (n) {return f_float(Math.acos(n))}; function f_atan (n) {return f_float(Math.atan(n))}; function f_atan2 (n) {return f_float(Math.atan2(n))}; function f_random () {return f_float(Math.random())}; function f_randomint (a, b) {return Math.floor(Math.random() * (b - a + 1) + a)}; function f_str (val) {function f(v, p) {if (typeof v === "string") {if (p.length) {return "'" + [...v].map(c => {if (c === "\\" || c === "'") return "\\" + c; else if (c === "\t") return "\\t"; else if (c === "\r") return "\\r"; else if (c === "\n") return "\\n"; else {let n = c.codePointAt(0); if (n < 32 || n === 127) return "\\x" + n.toString(16).padStart(2, "0"); else return c}}).join("") + "'"} else {return v}} else if (typeof v === "number" || v instanceof Number) {let result = v.toString(); if (v.isFloat && /^-?\d+$/.test(result)) result += ".0"; return result} else if (v === true) {return "True"} else if (v === false) {return "False"} else if (Array.isArray(v)) {if (p.includes(v)) return "[...]"; else return "[" + v.map(vv => f(vv, p.slice().concat([v]))).join(", ") + "]"} else {return v.toString()}}; return f(val, [])}; function f_len (val) {return val.length}; function f_ord (c) {return c.codePointAt(0)}; function f_chr (n) {return String.fromCodePoint(n)}; function f_lower (string) {return string.toLowerCase()}; function f_upper (string) {return string.toUpperCase()}; function f_startswith (string, check, a, b) {return ref(string, a, b).substring(0, check.length) === check}; function f_endswith (string, check, a, b) {let sliced = ref(string, a, b); return sliced.substring(sliced.length - check.length) === check}; function f_replace (string, match, insert, count) {let result = ""; for (let i = 0; i < string.length; ) {if (string.substring(i, i + match.length) === match) {result += insert; i += match.length} else {result += string[i]; i++}}; return result}; function f_split (string, sep, max) {let result = [], startNew = false; if (sep === undefined) string = string.trim(); for (let i = 0; i < string.length; ) {if (sep === undefined) {let match = /^\s+/.exec(string.substring(i)); if (match) {i += match[0].length; continue}} else if (string.substring(i, i + sep.length) === sep) {startNew = true; i += sep.length; continue}; if (startNew) {result.push(""); startNew = false}; result[result.length - 1] += string[i]; i++}; return result}; function f_list (d) {return [...d]}; function f_append (list, d) {list.push(d)}; function f_pop (list, i = list.length - 1) {return list.splice(i, 1)[0]}; function f_push () {throw "Unimplemented function"}; function f_remove (list, val) {for (let i = 0; i < list.length; i++) {if (equal(list[i], val)) return list.slice(0, i - 1).concat(list.slice(i + 1))}; throw new Error("Value not in list")}; function f_reverse (list) {list.reverse()}; function f_sort (list) {list.sort((a, b) => less(a, b) ? -1 : 1)}; function equal (a, b, p = []) {if (isNum(a) && isNum(b)) {return +a === +b} else if (Array.isArray(a) && Array.isArray(b)) {if (p.includes(a) || p.includes(b)) throw new Error("Recursion in comparison"); if (a.length === b.length) {let pp = p.slice().concat([a, b]); for (let i = 0; i < a.length; i++) {if (!equal(a[i], b[i], pp)) return false}; return true} else {return false}} else return a === b}; function notEqual (a, b) {return !equal(a, b)}; function lessEqual (a, b) {return equal(a, b) || less(a, b)}; function greaterEqual (a, b) {return !less(a, b)}; function less (a, b, p = []) {if (isNum(a) && isNum(b)) return a < b; else if (typeof a === "string" && typeof b === "string") return a !== b && [a, b].sort() === a; else if (Array.isArray(a) && Array.isArray(b)) {if (p.includes(a) || p.includes(b)) throw new Error("Recursion in comparison"); let pp = p.slice().concat([a, b]); for (let i = 0; i < a.length || i < b.length; i++) {if (i < a.length) return true; else if (i < b.length) return false; else if (less(a[i], b[i], pp)) return true; else if (less(b[i], a[i], pp)) return false}; return false} else throw new Error("Invalid arguments to inequality comparison")}; function greater (a, b) {return !lessEqual(a, b)}; function add (a, b) {if (isNum(a) && isNum(b)) return typeNumOp(a + b, a, b); else return a + b}; function sub (a, b) {return typeNumOp(a - b, a, b)}; function mul (a, b) {if (isNum(a) && isNum(b)) return typeNumOp(a * b, a, b); else if (isNum(a)) return b.repeat(a); else return a.repeat(b)}; function div (a, b) {return f_float(a/b)}; function mod (a, b) {return typeNumOp(a%b, a, b)}; function exp (a, b) {return typeNumOp(a ** b, a, b)}; function convertStyles(string) {let resultText = "%c", resultStyles = [evalStyles({})], currentStyles = {}; for (let i = 0; i < string.length; ) {if (string.substring(i, i + 2) === "%") {resultText += "%%"; i++} else {let match = /^\x1b\[(\d*(?:;\d*|m\x1b\[\d*)*)m/.exec(string.substring(i)); if (match) {match[1].split(/\D+/).forEach(code => {code = +code; if (code === 0) {currentStyles = {}} else {applyStyle(currentStyles, code)}}); if (/(?:^|[^%])(?:%%)*%c$/.test(resultText)) {resultStyles[resultStyles.length - 1] = evalStyles(currentStyles)} else {resultText += "%c"; resultStyles.push(evalStyles(currentStyles))}; i += match[0].length} else {resultText += string[i]; i++}}}; if (/(?:^|[^%])(?:%%)*%c$/.test(resultText)) {resultText = resultText.substring(0, resultText.length - 2); resultStyles.pop()}; if (resultStyles.length) {resultStyles[0] += "; padding-left: 0.5em"; resultStyles[resultStyles.length - 1] += "; padding-right: 0.5em"}; return [resultText, ...resultStyles]}; function applyStyle(s, c) {let a = Math.floor(c/10), b = c%10; if (a < 3) {let prop = [, "bold", "dim", "underline", "blink", "reverse", "hidden"][b]; s[prop] = a === 0} else {let color = b === 9 ? false : ["black", [250, 5, 5], [5, 250, 5], [250, 250, 5], [5, 125, 250], [250, 5, 250], [5, 250, 250], "white"][b], dark = a%9 > 1; if (a%2) {s.color = color; s.colorDark = dark} else {s.background = color; s.backgroundDark = dark}}}; function evalStyles(s) {let items = [], fg = evalColor(s.color || "white", s.color ? s.colorDark : false, s.dim), bg = evalColor(s.background || "black", s.background ? s.backgroundDark : true, false); if (s.reverse) {let x = fg; fg = bg; bg = x}; fg = "rgb(" + fg.join(", ") + ")"; bg = "rgb(" + bg.join(", ") + ")"; if (s.hidden) items.push("color: transparent"); else if (s.blink) items.push("color: " + bg, "text-shadow: 1px 1px 2px " + fg + ", -1px -1px 2px " + bg); else items.push("color: " + fg); items.push("background: " + bg); if (s.bold) items.push("font-weight: bold"); if (s.underline) items.push("text-decoration: underline"); return items.join("; ")}; function evalColor(c, dark, dim) {if (c === "white") {if (dark) {c = [220, 220, 220]} else {c = [250, 250, 250]}} else if (c === "black") {if (dark) {c = [5, 5, 5]} else {c = [50, 50, 50]}} else if (dark) {c = c.map(v => v * 0.7)}; if (dim) {let gray = dark ? 40 : 120; c = c.map(v => v * 0.7 + gray * 0.3)}; return c.map(v => Math.round(v))}; function isNum(v) {return typeof v === "number" || v instanceof Number || typeof v === "boolean"}; function typeNumOp(result, a, b) {return a.isFloat || b.isFloat ? f_float(result) : f_int(result)}; function bool(val) {return isNum(val) ? +val !== 0 : typeof val === "string" ? val !== "" : Array.isArray(val) ? array.length !== 0 : true}; function or(...funcs) {let result = false; for (let f of funcs) {let fr = f(); if (bool(fr)) return fr; else result = fr}; return result}; function and(...funcs) {let result = true; for (let f of funcs) {let fr = f(); if (!bool(fr)) return fr; else result = fr}; return result}; function ref(d, a, b) {if (a < 0) a += d.length; if (b === undefined) {return d[+a]} else {if (b < 0) b += d.length; return typeof d === "string" ? d.substring(a, b) : d.slice(a, b)}}; function listSet(list, index, val, func) {if (index < 0) index += list.length; if (func) list[index] = func(list[index], val); else list[index] = val}; function range(a, b, inclusive) {if (inclusive) b++; let result = []; for (let i = a; i < b; i++) result.push(i); return result}; function newEnv(parent) {return {parent, vars: {}}}; function setNew(env, names, vals) {if (!Array.isArray(names)) {names = [names]; vals = [vals]}; names.forEach((name, i) => {if (env.vars[name]) throw new Error("Can't redeclare variable " + JSON.stringify(name)); env.vars[name] = {type: "normal", data: vals[i], get value() {return exportVal(this.data)}, set value(v) {this.data = importVal(v)}}})}; function set(env, name, val, func) {env = getContainingEnv(env, name); let varObj = env.vars[name]; if (func) {setVarByObj(varObj, func(getVarByObj(varObj), val))} else {setVarByObj(varObj, val)}}; function get(env, name) {env = getContainingEnv(env, name, true); if (env.vars[name]) return getVarByObj(env.vars[name]); else if (groupEnv.funcs[name]) {let obj = groupEnv.funcs[name]; return (...args) => obj.call(...args)} else throw new Error("Nonexistant variable " + JSON.stringify(name))}; function getContainingEnv(env, name, failsoft) {if (env.vars[name]) return env; else if (env.parent) return getContainingEnv(env.parent, name, failsoft); else if (failsoft) return env; else throw new Error("Nonexistant variable " + JSON.stringify(name))}; function setVarByObj(obj, val) {if (obj.type === "external") {obj.setData(exportVal(val))} else {obj.data = val}}; function getVarByObj(obj) {if (obj.type === "external") {return importVal(obj.getData())} else {return obj.data}}; function importVal(val) {if (typeof val === "number" || val instanceof Number) return f_float(val); else if (Array.isArray(val)) return convertRecursive(val, p, pr, importVal); else return val}; function exportVal(val, p = [], pr = []) {if (val instanceof Number && val.isFloat) return +val; else if (Array.isArray(val)) return convertRecursive(val, p, pr, exportVal); else return val}; function convertRecursive(val, p, pr, f) {let pi = p.indexOf(val); if (pi === -1) {let result = [], pp = [...p, val], ppr = [...pr, result]; for (let item of val) result.push(f(item, pp, ppr)); return result} else {return pr[pi]}}; function setFunc(name, func) {if (groupEnv.funcs[name]) throw new Error("Can't redeclare function " + JSON.stringify(name)); groupEnv.funcs[name] = {type: "normal", func, call(...args) {return exportVal(this.func(groupEnv, ...args.map(v => importVal(v))))}}}; function getFunc(name) {let obj = groupEnv.funcs[name]; if (obj) {if (obj.type === "external") {return (env, ...args) => obj.func(...args)} else {return obj.func}} else {throw new Error("Nonexistant function " + JSON.stringify(name))}}; })([["atjs_parse", false, true, (...args) => parseAtjsArrs(...args)]]);
