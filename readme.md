A naïve compiler from [Talon](https://github.com/MystPi/talon) to JavaScript, based on (though not perfectly replicating) Talon v1.0.1.

The compiler, itself compiled from the three Talon scripts in the root of this repository, can be run here: https://arctenik.github.io/arc-talon-js

Caveats:
- This is not built for efficiency of any sort (though it doesn't run _badly_)
- Hopefully matches the interpreter in most behaviors, but one aspect that's lacking is that it fails to throw errors in many places where the interpreter would do so
	- One other notable place where it differs is that this implementation doesn't support `\N{name}` escape sequences
	- Blinking text isn't really possible in the JS console, so instead it's got a blurred shadow behind it, which doesn't look great but at least that means it's similarly obnoxious :-P
	- Not all features have really been tested so there may still be a few bugs
- Designed for up-to-date browsers (developed with Chrome and briefly tested in Firefox)

# Interop
The inspiration behind this compiler is "Talon for web development", so naturally there's interop with JS. Functions and global variables from a Talon program can be accessed externally, and Talon can import variables and properties from JavaScript.

NOTE: Certain values will be converted when transferred between JS and Talon -- numbers transferred from Talon to JS will lose their type distinctions (and numbers from JS will always be ints in Talon), and lists/arrays will be copied with their items converted. Otherwise, values are preserved.

## Accessing Talon from JS
When a Talon program is compiled, an "interop variable" is specified, which is a JavaScript variable in which to store an object representing the program. Multiple compiled files can share the same interop variable, in which case they'll run in the same environment and be available to each other for importing via Talon's `import` function.

The interop object has three properties: `files`, `vars`, and `funcs`.

### files
Each entry in `files` represents a source file. The `run` function `<interop>.files["<filename>"].run()` can be used to initiate a Talon program via JS.

### vars
`vars` contains global variables. Modifying the `value` property `<interop>.vars.<varname>.value` will modify the variable in the program.

### funcs
`<interop>.funcs.<funcname>.call(<args>)` can be used to call one of the program's functions.

## Accessing JS from Talon
Using a new syntax, Talon variables/functions can be created mirroring JS variables or properties of variables, and functions can be created that access properties of JS objects.

### Basic variables/properties
To import an external variable/property, its name can be prefixed with an `@`, e.g.:

`@location`

or

`@document.body`

The default name used for the Talon variable is the rightmost one in the JS name, so in these cases the variables created in Talon would be `location` and `body` respectively.

Properties can also be referenced with square brackets containing strings or integers:

`@someObject["property with spaces"]`

`@someArray[0]`

(In these cases, the Talon variables would be `someObject` and `someArray`.)

If the automatically-determined variable name is unsuitable, a colon can be used to change it:

`@location.hash : locationHash` will import JavaScript's `location.hash` as `locationHash`

(Specifying names like this will also work for the types of external imports described in the following sections.)

### Functions
If an imported value should be interpreted as a function, the JS name should have a pair of parentheses put after it:

`@document.getElementById()` will create a Talon function named `getElementById`

If the function is detected (via the `prototype` property) to be a constructor, it will automatically be called using the JavaScript `new` keyword, which enables the use of constructors such as `Blob()` that require `new`:

```
@Blob()

this blob = Blob(["stuff"])
```

### Generalized properties
If a property shared by multiple JS objects needs to be accessed, a property reference can be given without a leading variable name, e.g.:

`@.innerHTML`

This will create a Talon _function_ that can be used to get/set the property on an arbitrary object. In this case, `innerHTML(elem)` would return `elem`'s HTML content and `innerHTML(elem, "example<br>text")` would set the element's content.

If the source property is specified via parentheses to be a function, the function is called with the target object as its first argument:

`@.appendChild()` can be called as `appendChild(element, child)`

## Passing a Talon function to JS
Although Talon functions still aren't considered first-class in this implementation, a Talon function referenced in a value context will evaluate to a JavaScript function that proxies the Talon function, and can be stored in variables or passed to functions -- for example, a program containing this bit of code could be used to make a button do something:

```
fun onclick() {
	print("Click!")
}

addEventListener(button, onclick)
```

## Other notes on external imports
- `@` statements aren't evaluated like normal statements -- they take effect before the program is even run, regardless of where they are
- `compile.tal` uses references to JS values and so may provide useful examples

# Misc notes
The parser is implemented using [Parc](https://github.com/Arctenik/parc).