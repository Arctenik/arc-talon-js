parseAtjs = (function() {
				function parse(text, transformers) {
					let result = parseExprs(parseTokens(text), text);
					if (transformers) result = transform(result);
					return result;
					
					function transform(expr) {
						if (Array.isArray(expr)) {
							return expr.map(transform);
						} else if (expr) {
							let children = Array.isArray(expr.value) ? expr.value.map(transform) : expr.value;
							if (transformers[expr.type]) {
								return transformers[expr.type](children);
							} else {
								return {type: expr.type, value: children};
							}
						} else {
							return expr;
						}
					}
				}
				
				function parseExprs(tokens, text) {
					let i = 0,
						result = parse_statements();
					
					if (i < tokens.length || !result) badSyntax();
					
					return result[0];
					
					
					
					function parse_statements() {
						let result = initResult(i, "statements");
						
								while (collect(parse_closedstatement(), result)) {};
								
							
						return processResult(result);
						
						
					}
				

					function parse_closedstatement() {
						let result = initResult(i);
						
								
							if (collect(parse_blockstatement(), result)) {
								
								match("statementend")
								
							} else
						 {
									
								
							if (collect(parse_linestatement(), result)) {
								
								
								if (!(match("statementend"))) {
									badSyntax();
								}
							
								
							} else
						 {
									return false;
								}
							
								}
							
						return processResult(result);
						
						
					}
				

					function parse_blockstatement() {
						let result = initResult(i);
						
								if (!(collect(parse_if(), result))) {
									
								if (!(collect(parse_for(), result))) {
									
								if (!(collect(parse_while(), result))) {
									
								if (!(collect(parse_function(), result))) {
									return false;
								}
							
								}
							
								}
							
								}
							
						return processResult(result);
						
						
					}
				

					function parse_if() {
						let result = initResult(i, "if");
						
								
							if (match("if")) {
								
								
								if (!(match("("))) {
									badSyntax();
								}
							

								if (!(collect(parse_expression(), result))) {
									badSyntax();
								}
							

								if (!(match(")"))) {
									badSyntax();
								}
							

								if (!(collect(parse_codeblock(), result))) {
									badSyntax();
								}
							
parseGroup0()
								
							} else
						 {
									return false;
								}
							
						return processResult(result);
						
						
							function parseGroup1() {
								
								if (!(collect(parse_codeblock(), result))) {
									
								if (!(collect(parse_if(), result))) {
									return false;
								}
							
								}
							
								return true;
							}
						

							function parseGroup0() {
								
								
							if (match("else")) {
								
								
								if (!(parseGroup1())) {
									badSyntax();
								}
							
								
							} else
						 {
									return false;
								}
							
								return true;
							}
						
					}
				

					function parse_for() {
						let result = initResult(i, "for");
						
								
							if (match("for")) {
								
								
								if (!(match("("))) {
									badSyntax();
								}
							

								if (!(collect(match("name"), result))) {
									badSyntax();
								}
							

								if (!(match("in"))) {
									badSyntax();
								}
							

								if (!(collect(parse_expression(), result))) {
									badSyntax();
								}
							

								if (!(match(")"))) {
									badSyntax();
								}
							

								if (!(collect(parse_codeblock(), result))) {
									badSyntax();
								}
							
								
							} else
						 {
									return false;
								}
							
						return processResult(result);
						
						
					}
				

					function parse_while() {
						let result = initResult(i, "while");
						
								
							if (match("while")) {
								
								
								if (!(match("("))) {
									badSyntax();
								}
							

								if (!(collect(parse_expression(), result))) {
									badSyntax();
								}
							

								if (!(match(")"))) {
									badSyntax();
								}
							

								if (!(collect(parse_codeblock(), result))) {
									badSyntax();
								}
							
								
							} else
						 {
									return false;
								}
							
						return processResult(result);
						
						
					}
				

					function parse_function() {
						let result = initResult(i, "function");
						
								
							if (match("fun")) {
								
								
								if (!(collect(match("name"), result))) {
									badSyntax();
								}
							

								if (!(match("("))) {
									badSyntax();
								}
							

								if (!(collect(parse_params(), result))) {
									badSyntax();
								}
							

								if (!(match(")"))) {
									badSyntax();
								}
							

								if (!(collect(parse_codeblock(), result))) {
									badSyntax();
								}
							
								
							} else
						 {
									return false;
								}
							
						return processResult(result);
						
						
					}
				

					function parse_params() {
						let result = initResult(i, "params");
						
								parseGroup0()
								
							
						return processResult(result);
						
						
							function parseGroup1() {
								
								
							if (match(",")) {
								
								
								if (!(collect(match("name"), result))) {
									badSyntax();
								}
							
								
							} else
						 {
									return false;
								}
							
								return true;
							}
						

							function parseGroup0() {
								
								
							if (collect(match("name"), result)) {
								
								while (parseGroup1()) {};
								
							} else
						 {
									return false;
								}
							
								return true;
							}
						
					}
				

					function parse_linestatement() {
						let result = initResult(i);
						
								if (!(collect(match("break"), result))) {
									
								
							if (match("ret")) {
								
								collect(parse_expression(), result)
								result.type = "return";
							} else
						 {
									
								
							if (match("this")) {
								
								
								if (!(collect(match("name"), result))) {
									badSyntax();
								}
							
parseGroup6()
								result.type = "declare";
							} else
						 {
									
								
							if (collect(match("name"), result)) {
								
								
								if (!(parseGroup3())) {
									badSyntax();
								}
							
								
							} else
						 {
									
								
							if (match("@")) {
								
								
								if (!(parseGroup0())) {
									badSyntax();
								}
							
parseGroup1()
parseGroup2()
								result.type = "extimport";
							} else
						 {
									return false;
								}
							
								}
							
								}
							
								}
							
								}
							
						return processResult(result);
						
						
							function parseGroup0() {
								
								
							if (collect(match("name"), result)) {
								
								collect(parse_propref(), result)
								
							} else
						 {
									
								if (!(collect(parse_propref(), result))) {
									return false;
								}
							
								}
							
								return true;
							}
						

							function parseGroup1() {
								
								
							if (collect(match("("), result)) {
								
								
								if (!(match(")"))) {
									badSyntax();
								}
							
								
							} else
						 {
									return false;
								}
							
								return true;
							}
						

							function parseGroup2() {
								
								
							if (match(":")) {
								
								
								if (!(collect(match("name"), result))) {
									badSyntax();
								}
							
								
							} else
						 {
									return false;
								}
							
								return true;
							}
						

							function parseGroup4() {
								
								if (!(collect(match("assignop"), result))) {
									
								if (!(collect(match("="), result))) {
									return false;
								}
							
								}
							
								return true;
							}
						

							function parseGroup5() {
								
								if (!(collect(match("assignop"), result))) {
									
								if (!(collect(match("="), result))) {
									return false;
								}
							
								}
							
								return true;
							}
						

							function parseGroup3() {
								
								
							if (match("(")) {
								
								
								if (!(collect(parse_args(), result))) {
									badSyntax();
								}
							

								if (!(match(")"))) {
									badSyntax();
								}
							
								result.type = "call";
							} else
						 {
									
								
							if (parseGroup5()) {
								
								
								if (!(collect(parse_expression(), result))) {
									badSyntax();
								}
							
								result.type = "assign";
							} else
						 {
									
								
							if (match("[")) {
								
								
								if (!(collect(parse_expression(), result))) {
									badSyntax();
								}
							

								if (!(match("]"))) {
									badSyntax();
								}
							

								if (!(parseGroup4())) {
									badSyntax();
								}
							

								if (!(collect(parse_expression(), result))) {
									badSyntax();
								}
							
								result.type = "listassign";
							} else
						 {
									return false;
								}
							
								}
							
								}
							
								return true;
							}
						

							function parseGroup6() {
								
								
							if (match("=")) {
								
								
								if (!(collect(parse_expression(), result))) {
									badSyntax();
								}
							
								
							} else
						 {
									return false;
								}
							
								return true;
							}
						
					}
				

					function parse_propref() {
						let result = initResult(i, "propref");
						
								
							if (parseGroup0()) {
								while(parseGroup0()) {};
								
								
							} else
						 {
									return false;
								}
							
						return processResult(result);
						
						
							function parseGroup0() {
								
								
							if (match(".")) {
								
								
								if (!(collect(match("name"), result))) {
									badSyntax();
								}
							
								
							} else
						 {
									return false;
								}
							
								return true;
							}
						
					}
				

					function parse_codeblock() {
						let result = initResult(i);
						
								
							if (match("{")) {
								
								
								if (!(collect(parse_statements(), result))) {
									badSyntax();
								}
							

								if (!(match("}"))) {
									badSyntax();
								}
							
								
							} else
						 {
									return false;
								}
							
						return processResult(result);
						
						
					}
				

					function parse_expression() {
						let result = initResult(i);
						
								if (!(collect(parse_or(), result))) {
									return false;
								}
							
						return processResult(result);
						
						
					}
				

					function parse_or() {
						let result = initResult(i, "or");
						
								
							if (collect(parse_and(), result)) {
								
								
								if (!(parseGroup0())) {
									badSyntax();
								}
							
								
							} else
						 {
									return false;
								}
							
						return processResult(result);
						
						
							function parseGroup1() {
								
								
							if (match("||")) {
								
								
								if (!(collect(parse_and(), result))) {
									badSyntax();
								}
							
								
							} else
						 {
									return false;
								}
							
								return true;
							}
						

							function parseGroup0() {
								
								
							if (parseGroup1()) {
								while(parseGroup1()) {};
								
								
							} else
						 {
									
								
								result.type = undefined;
							
								}
							
								return true;
							}
						
					}
				

					function parse_and() {
						let result = initResult(i, "and");
						
								
							if (collect(parse_compare(), result)) {
								
								
								if (!(parseGroup0())) {
									badSyntax();
								}
							
								
							} else
						 {
									return false;
								}
							
						return processResult(result);
						
						
							function parseGroup1() {
								
								
							if (match("&&")) {
								
								
								if (!(collect(parse_compare(), result))) {
									badSyntax();
								}
							
								
							} else
						 {
									return false;
								}
							
								return true;
							}
						

							function parseGroup0() {
								
								
							if (parseGroup1()) {
								while(parseGroup1()) {};
								
								
							} else
						 {
									
								
								result.type = undefined;
							
								}
							
								return true;
							}
						
					}
				

					function parse_compare() {
						let result = initResult(i, "binop");
						
								
							if (collect(parse_sum(), result)) {
								
								
								if (!(parseGroup0())) {
									badSyntax();
								}
							
								
							} else
						 {
									return false;
								}
							
						return processResult(result);
						
						
							function parseGroup1() {
								
								
							if (collect(match("compareop"), result)) {
								
								
								if (!(collect(parse_sum(), result))) {
									badSyntax();
								}
							
								
							} else
						 {
									return false;
								}
							
								return true;
							}
						

							function parseGroup0() {
								
								
							if (parseGroup1()) {
								while(parseGroup1()) {};
								
								
							} else
						 {
									
								
								result.type = undefined;
							
								}
							
								return true;
							}
						
					}
				

					function parse_sum() {
						let result = initResult(i, "binop");
						
								
							if (collect(parse_product(), result)) {
								
								
								if (!(parseGroup0())) {
									badSyntax();
								}
							
								
							} else
						 {
									return false;
								}
							
						return processResult(result);
						
						
							function parseGroup2() {
								
								if (!(collect(match("+"), result))) {
									
								if (!(collect(match("-"), result))) {
									return false;
								}
							
								}
							
								return true;
							}
						

							function parseGroup1() {
								
								
							if (parseGroup2()) {
								
								
								if (!(collect(parse_product(), result))) {
									badSyntax();
								}
							
								
							} else
						 {
									return false;
								}
							
								return true;
							}
						

							function parseGroup0() {
								
								
							if (parseGroup1()) {
								while(parseGroup1()) {};
								
								
							} else
						 {
									
								
								result.type = undefined;
							
								}
							
								return true;
							}
						
					}
				

					function parse_product() {
						let result = initResult(i, "binop");
						
								
							if (collect(parse_exponent(), result)) {
								
								
								if (!(parseGroup0())) {
									badSyntax();
								}
							
								
							} else
						 {
									return false;
								}
							
						return processResult(result);
						
						
							function parseGroup1() {
								
								
							if (collect(match("productop"), result)) {
								
								
								if (!(collect(parse_exponent(), result))) {
									badSyntax();
								}
							
								
							} else
						 {
									return false;
								}
							
								return true;
							}
						

							function parseGroup0() {
								
								
							if (parseGroup1()) {
								while(parseGroup1()) {};
								
								
							} else
						 {
									
								
								result.type = undefined;
							
								}
							
								return true;
							}
						
					}
				

					function parse_exponent() {
						let result = initResult(i, "binop");
						
								
							if (collect(parse_range(), result)) {
								
								
								if (!(parseGroup0())) {
									badSyntax();
								}
							
								
							} else
						 {
									return false;
								}
							
						return processResult(result);
						
						
							function parseGroup0() {
								
								
							if (collect(match("^"), result)) {
								
								
								if (!(collect(parse_exponent(), result))) {
									badSyntax();
								}
							
								
							} else
						 {
									
								
								result.type = undefined;
							
								}
							
								return true;
							}
						
					}
				

					function parse_range() {
						let result = initResult(i, "range");
						
								
							if (collect(parse_listref(), result)) {
								
								
								if (!(parseGroup0())) {
									badSyntax();
								}
							
								
							} else
						 {
									return false;
								}
							
						return processResult(result);
						
						
							function parseGroup0() {
								
								
							if (collect(match("rangeop"), result)) {
								
								
								if (!(collect(parse_listref(), result))) {
									badSyntax();
								}
							
								
							} else
						 {
									
								
								result.type = undefined;
							
								}
							
								return true;
							}
						
					}
				

					function parse_listref() {
						let result = initResult(i, "listref");
						
								
							if (collect(parse_value(), result)) {
								
								
								if (!(parseGroup0())) {
									badSyntax();
								}
							
								
							} else
						 {
									return false;
								}
							
						return processResult(result);
						
						
							function parseGroup1() {
								
								
							if (match("[")) {
								
								
								if (!(collect(parse_listrefparam(), result))) {
									badSyntax();
								}
							

								if (!(match("]"))) {
									badSyntax();
								}
							
								
							} else
						 {
									return false;
								}
							
								return true;
							}
						

							function parseGroup0() {
								
								
							if (parseGroup1()) {
								while(parseGroup1()) {};
								
								
							} else
						 {
									
								
								result.type = undefined;
							
								}
							
								return true;
							}
						
					}
				

					function parse_listrefparam() {
						let result = initResult(i);
						
								
							if (match(":")) {
								
								
								if (!(collect(parse_empty(), result))) {
									badSyntax();
								}
							
collect(parse_expression(), result)
								result.type = "slice";
							} else
						 {
									
								
							if (collect(parse_expression(), result)) {
								
								parseGroup0()
								
							} else
						 {
									return false;
								}
							
								}
							
						return processResult(result);
						
						
							function parseGroup0() {
								
								
							if (match(":")) {
								
								collect(parse_expression(), result)
								result.type = "slice";
							} else
						 {
									return false;
								}
							
								return true;
							}
						
					}
				

					function parse_value() {
						let result = initResult(i);
						
								if (!(collect(match("number"), result))) {
									
								if (!(collect(match("string"), result))) {
									
								if (!(collect(match("true"), result))) {
									
								if (!(collect(match("false"), result))) {
									
								if (!(collect(parse_list(), result))) {
									
								
							if (match("-")) {
								
								
								if (!(collect(parse_value(), result))) {
									badSyntax();
								}
							
								result.type = "neg";
							} else
						 {
									
								
							if (match("+")) {
								
								
								if (!(collect(parse_value(), result))) {
									badSyntax();
								}
							
								result.type = "abs";
							} else
						 {
									
								
							if (match("!")) {
								
								
								if (!(collect(parse_value(), result))) {
									badSyntax();
								}
							
								result.type = "not";
							} else
						 {
									
								
							if (match("(")) {
								
								
								if (!(collect(parse_expression(), result))) {
									badSyntax();
								}
							

								if (!(match(")"))) {
									badSyntax();
								}
							
								
							} else
						 {
									
								
							if (collect(match("name"), result)) {
								
								parseGroup0()
								
							} else
						 {
									return false;
								}
							
								}
							
								}
							
								}
							
								}
							
								}
							
								}
							
								}
							
								}
							
								}
							
						return processResult(result);
						
						
							function parseGroup0() {
								
								
							if (match("(")) {
								
								
								if (!(collect(parse_args(), result))) {
									badSyntax();
								}
							

								if (!(match(")"))) {
									badSyntax();
								}
							
								result.type = "call";
							} else
						 {
									return false;
								}
							
								return true;
							}
						
					}
				

					function parse_args() {
						let result = initResult(i, "args");
						
								parseGroup0()
								
							
						return processResult(result);
						
						
							function parseGroup1() {
								
								
							if (match(",")) {
								
								
								if (!(collect(parse_expression(), result))) {
									badSyntax();
								}
							
								
							} else
						 {
									return false;
								}
							
								return true;
							}
						

							function parseGroup0() {
								
								
							if (collect(parse_expression(), result)) {
								
								while (parseGroup1()) {};
								
							} else
						 {
									return false;
								}
							
								return true;
							}
						
					}
				

					function parse_list() {
						let result = initResult(i, "list");
						
								
							if (match("[")) {
								
								parseGroup0()

								if (!(match("]"))) {
									badSyntax();
								}
							
								
							} else
						 {
									return false;
								}
							
						return processResult(result);
						
						
							function parseGroup2() {
								
								if (!(collect(parse_expression(), result))) {
									
								if (!(match("]", 0))) {
									return false;
								}
							
								}
							
								return true;
							}
						

							function parseGroup1() {
								
								
							if (match(",")) {
								
								
								if (!(parseGroup2())) {
									badSyntax();
								}
							
								
							} else
						 {
									return false;
								}
							
								return true;
							}
						

							function parseGroup0() {
								
								
							if (collect(parse_expression(), result)) {
								
								while (parseGroup1()) {};
								
							} else
						 {
									return false;
								}
							
								return true;
							}
						
					}
				

					function parse_empty() {
						let result = initResult(i, "empty");
						
								
								
							
						return processResult(result);
						
						
					}
				
					
					
					function processResult(result) {
						if (result.type === undefined) {
							return result.value;
						} else {
							result.index = tokens[result.index] ? tokens[result.index].index : text.length;
							return [result];
						}
					}
					
					function match(str, offset) {
						let j = i + (offset || 0);
						if (j < tokens.length && tokens[j].type === str) {
							if (offset === undefined) i++;
							return tokens[j];
						}
						return false;
					}
					
					function matchAny(offset) {
						let j = i + (offset || 0);
						if (j < tokens.length) {
							if (offset === undefined) i++;
							return tokens[j];
						}
						return false;
					}
					
					function badSyntax() {
						if (i < tokens.length) {
							let {line, indexInLine} = getLocationInfo(tokens[i].index, text);
							throw new Error("Unexpected" + (tokens[i].type === tokens[i].value ? "" : " " + tokens[i].type) + " token " + JSON.stringify(tokens[i].value) + " at line " + (line + 1) + " character " + (indexInLine + 1));
						} else {
							throw new Error("Unexpected end of input");
						}
					}
				}
				
				function parseTokens(text) {
					let i = 0,
						result = parse_tokens();
					
					if (i < text.length || !result) badSyntax();
					
					return result;
					
					
					
					function parse_tokens() {
						let result = initResult(i);
						
								collect(parse_anyws(), result)
while (parseGroup0()) {};
								
							
						return processResult(result);
						
						
							function parseGroup0() {
								
								
							if (collect(parse_tokenorgroup(), result)) {
								
								collect(parse_ws(), result)
								
							} else
						 {
									return false;
								}
							
								return true;
							}
						
					}
				

					function parse_curlygrouptokens() {
						let result = initResult(i);
						
								
							if (collect(match("{"), result)) {
								
								
								if (!(collect(parse_tokens(), result))) {
									badSyntax();
								}
							

								if (!(collect(match("}"), result))) {
									badSyntax();
								}
							
								
							} else
						 {
									return false;
								}
							
						return processResult(result);
						
						
					}
				

					function parse_othergrouptokens() {
						let result = initResult(i);
						
								
							if (collect(matchChars(/[\[(]/), result)) {
								
								
								if (!(collect(parse_crosslinetokens(), result))) {
									badSyntax();
								}
							

								if (!(collect(matchChars(/[\])]/), result))) {
									badSyntax();
								}
							
								
							} else
						 {
									return false;
								}
							
						return processResult(result);
						
						
					}
				

					function parse_crosslinetokens() {
						let result = initResult(i);
						
								collect(parse_anyws(), result)
while (parseGroup0()) {};
								
							
						return processResult(result);
						
						
							function parseGroup0() {
								
								
							if (collect(parse_tokenorgroup(), result)) {
								
								collect(parse_anyws(), result)
								
							} else
						 {
									return false;
								}
							
								return true;
							}
						
					}
				

					function parse_tokenorgroup() {
						let result = initResult(i);
						
								if (!(collect(parse_curlygrouptokens(), result))) {
									
								if (!(collect(parse_othergrouptokens(), result))) {
									
								if (!(collect(parse_token(), result))) {
									return false;
								}
							
								}
							
								}
							
						return processResult(result);
						
						
					}
				

					function parse_ws() {
						let result = initResult(i);
						
								
							if (parse_linews()) {
								
								parseGroup1()
								
							} else
						 {
									
								
							if (collect(parse_statementend(), result)) {
								
								collect(parse_anyws(), result)
								
							} else
						 {
									
								
							if (parseGroup0()) {
								
								
								if (!(collect(parse_emptyend(), result))) {
									badSyntax();
								}
							
								
							} else
						 {
									return false;
								}
							
								}
							
								}
							
						return processResult(result);
						
						
							function parseGroup0() {
								
								if (!(match("}", 0))) {
									
								if (!(!(matchAny(0)))) {
									return false;
								}
							
								}
							
								return true;
							}
						

							function parseGroup2() {
								
								if (!(match("}", 0))) {
									
								if (!(!(matchAny(0)))) {
									return false;
								}
							
								}
							
								return true;
							}
						

							function parseGroup1() {
								
								
							if (collect(parse_statementend(), result)) {
								
								collect(parse_anyws(), result)
								
							} else
						 {
									
								
							if (parseGroup2()) {
								
								
								if (!(collect(parse_emptyend(), result))) {
									badSyntax();
								}
							
								
							} else
						 {
									return false;
								}
							
								}
							
								return true;
							}
						
					}
				

					function parse_emptyend() {
						let result = initResult(i, "statementend");
						
								if (!(collect(match(""), result))) {
									return false;
								}
							
						return processResult(result);
						
						
					}
				

					function parse_statementend() {
						let result = initResult(i, "statementend");
						
								if (!(collect(matchChars(/[\n;]/), result))) {
									return false;
								}
							
						return processResult(result);
						
						
					}
				

					function parse_linews() {
						let result = initResult(i, "linews");
						
								
							if (parseGroup0()) {
								while(parseGroup0()) {};
								
								
							} else
						 {
									return false;
								}
							
						return processResult(result);
						
						
							function parseGroup0() {
								
								if (!(collect(matchChars(/[ \t\r]/), result))) {
									
								if (!(collect(parse_comment(), result))) {
									return false;
								}
							
								}
							
								return true;
							}
						
					}
				

					function parse_comment() {
						let result = initResult(i, "comment");
						
								
							if (collect(match("//"), result)) {
								
								while (collect(matchChars(/[^\n]/), result)) {};
								
							} else
						 {
									
								
							if (collect(match("/*"), result)) {
								
								while (parseGroup0()) {};

								if (!(collect(match("*/"), result))) {
									badSyntax();
								}
							
								
							} else
						 {
									return false;
								}
							
								}
							
						return processResult(result);
						
						
							function parseGroup0() {
								
								if (!(!(match("*/", 0)) && collect(matchAny(), result))) {
									return false;
								}
							
								return true;
							}
						
					}
				

					function parse_anyws() {
						let result = initResult(i);
						
								
							if (parseGroup0()) {
								while(parseGroup0()) {};
								
								
							} else
						 {
									return false;
								}
							
						return processResult(result);
						
						
							function parseGroup0() {
								
								if (!(matchChars(/[ \t\r\n]/))) {
									
								if (!(parse_comment())) {
									return false;
								}
							
								}
							
								return true;
							}
						
					}
				

					function parse_token() {
						let result = initResult(i);
						
								if (!(collect(parse_string(), result))) {
									
								if (!(collect(parse_specialsyntax(), result))) {
									
								if (!(collect(parse_numorsign(), result))) {
									
								if (!(collect(parse_symbol(), result))) {
									return false;
								}
							
								}
							
								}
							
								}
							
						return processResult(result);
						
						
					}
				

					function parse_specialsyntax() {
						let result = initResult(i);
						
								if (!(collect(match("||"), result))) {
									
								if (!(collect(match("&&"), result))) {
									
								if (!(collect(parse_assignop(), result))) {
									
								if (!(collect(parse_compareop2(), result))) {
									
								if (!(collect(match("="), result))) {
									
								if (!(collect(parse_compareop1(), result))) {
									
								if (!(collect(parse_productop(), result))) {
									
								if (!(collect(match("^"), result))) {
									
								if (!(collect(match("!"), result))) {
									
								if (!(collect(match(","), result))) {
									
								if (!(collect(match(":"), result))) {
									
								if (!(collect(match("@"), result))) {
									
								if (!(collect(match("."), result))) {
									return false;
								}
							
								}
							
								}
							
								}
							
								}
							
								}
							
								}
							
								}
							
								}
							
								}
							
								}
							
								}
							
								}
							
						return processResult(result);
						
						
					}
				

					function parse_assignop() {
						let result = initResult(i, "assignop");
						
								if (!(collect(match("+="), result))) {
									
								if (!(collect(match("-="), result))) {
									
								if (!(collect(match("*="), result))) {
									
								if (!(collect(match("/="), result))) {
									
								if (!(collect(match("^="), result))) {
									
								if (!(collect(match("%="), result))) {
									return false;
								}
							
								}
							
								}
							
								}
							
								}
							
								}
							
						return processResult(result);
						
						
					}
				

					function parse_compareop2() {
						let result = initResult(i, "compareop");
						
								if (!(collect(match("=="), result))) {
									
								if (!(collect(match("!="), result))) {
									
								if (!(collect(match("<="), result))) {
									
								if (!(collect(match(">="), result))) {
									return false;
								}
							
								}
							
								}
							
								}
							
						return processResult(result);
						
						
					}
				

					function parse_compareop1() {
						let result = initResult(i, "compareop");
						
								if (!(collect(match("<"), result))) {
									
								if (!(collect(match(">"), result))) {
									return false;
								}
							
								}
							
						return processResult(result);
						
						
					}
				

					function parse_productop() {
						let result = initResult(i, "productop");
						
								if (!(collect(match("*"), result))) {
									
								if (!(collect(match("/"), result))) {
									
								if (!(collect(match("%"), result))) {
									return false;
								}
							
								}
							
								}
							
						return processResult(result);
						
						
					}
				

					function parse_numorsign() {
						let result = initResult(i);
						
								
							if (collect(matchChars(/[+\-]/), result)) {
								
								parseGroup0()
								
							} else
						 {
									
								
							if (collect(parse_digits(), result)) {
								
								
								result.type = "number";
							} else
						 {
									return false;
								}
							
								}
							
						return processResult(result);
						
						
							function parseGroup0() {
								
								
							if (collect(parse_digits(), result)) {
								
								
								result.type = "number";
							} else
						 {
									return false;
								}
							
								return true;
							}
						
					}
				

					function parse_digits() {
						let result = initResult(i, "digits");
						
								
							if (collect(matchChars(/[0-9]/), result)) {
								while(collect(matchChars(/[0-9]/), result)) {};
								
								
							} else
						 {
									return false;
								}
							
						return processResult(result);
						
						
					}
				

					function parse_symbol() {
						let result = initResult(i);
						
								
							if (collect(parse_word(), result)) {
								
								parseGroup0()
								
							} else
						 {
									
								if (!(collect(parse_name(), result))) {
									return false;
								}
							
								}
							
						return processResult(result);
						
						
							function parseGroup0() {
								
								
							if (collect(parse_nametail(), result)) {
								
								
								result.type = "name";
							} else
						 {
									return false;
								}
							
								return true;
							}
						
					}
				

					function parse_word() {
						let result = initResult(i);
						
								if (!(collect(match("this"), result))) {
									
								if (!(collect(match("if"), result))) {
									
								if (!(collect(match("else"), result))) {
									
								if (!(collect(match("true"), result))) {
									
								if (!(collect(match("false"), result))) {
									
								if (!(collect(match("on"), result))) {
									
								if (!(collect(match("off"), result))) {
									
								if (!(collect(match("yes"), result))) {
									
								if (!(collect(match("no"), result))) {
									
								if (!(collect(match("for"), result))) {
									
								if (!(collect(match("in"), result))) {
									
								if (!(collect(match("while"), result))) {
									
								if (!(collect(match("to"), result))) {
									
								if (!(collect(match("upto"), result))) {
									
								if (!(collect(match("fun"), result))) {
									
								if (!(collect(match("ret"), result))) {
									
								if (!(collect(match("break"), result))) {
									return false;
								}
							
								}
							
								}
							
								}
							
								}
							
								}
							
								}
							
								}
							
								}
							
								}
							
								}
							
								}
							
								}
							
								}
							
								}
							
								}
							
								}
							
						return processResult(result);
						
						
					}
				

					function parse_name() {
						let result = initResult(i, "name");
						
								
							if (collect(matchChars(/[a-zA-Z_]/), result)) {
								
								collect(parse_nametail(), result)
								
							} else
						 {
									return false;
								}
							
						return processResult(result);
						
						
					}
				

					function parse_nametail() {
						let result = initResult(i, "nametail");
						
								
							if (collect(matchChars(/[a-zA-Z0-9_]/), result)) {
								while(collect(matchChars(/[a-zA-Z0-9_]/), result)) {};
								
								
							} else
						 {
									return false;
								}
							
						return processResult(result);
						
						
					}
				

					function parse_string() {
						let result = initResult(i, "string");
						
								
							if (collect(match("\""), result)) {
								
								while (collect(parse_dstritem(), result)) {};

								if (!(collect(match("\""), result))) {
									badSyntax();
								}
							
								
							} else
						 {
									
								
							if (collect(match("'"), result)) {
								
								while (collect(parse_sstritem(), result)) {};

								if (!(collect(match("'"), result))) {
									badSyntax();
								}
							
								
							} else
						 {
									return false;
								}
							
								}
							
						return processResult(result);
						
						
					}
				

					function parse_dstritem() {
						let result = initResult(i, "dstritem");
						
								
							if (collect(match("\\"), result)) {
								
								
								if (!(collect(matchAny(), result))) {
									badSyntax();
								}
							
								
							} else
						 {
									
								if (!(collect(matchChars(/[^"]/), result))) {
									return false;
								}
							
								}
							
						return processResult(result);
						
						
					}
				

					function parse_sstritem() {
						let result = initResult(i, "sstritem");
						
								
							if (collect(match("\\"), result)) {
								
								
								if (!(collect(matchAny(), result))) {
									badSyntax();
								}
							
								
							} else
						 {
									
								if (!(collect(matchChars(/[^']/), result))) {
									return false;
								}
							
								}
							
						return processResult(result);
						
						
					}
				
					
					
					function processResult(result) {
						if (result.type === undefined) {
							return result.value;
						} else {
							result.value = joinTokens(result.value);
							return [result];
						}
					}
					
					function joinTokens(tokens) {
						return tokens.map(t => t.value).join("");
					}
					
					function match(str, offset) {
						let j = i + (offset || 0);
						if (text.substring(j, j + str.length) === str) {
							if (offset === undefined) i += str.length;
							return {type: str, value: str, index: j};
						}
						return false;
					}
					
					function matchChars(re, offset) {
						let j = i + (offset || 0);
						if (j < text.length && re.test(text[j])) {
							if (offset === undefined) i++;
							return {type: text[j], value: text[j], index: j};
						}
						return false;
					}
					
					function matchAny(offset) {
						let j = i + (offset || 0);
						if (j < text.length) {
							if (offset === undefined) i++;
							return {type: text[j], value: text[j], index: j};
						}
						return false;
					}
					
					function badSyntax() {
						if (i < text.length) {
							let {line, indexInLine} = getLocationInfo(i, text);
							throw new Error("Invalid syntax at line " + (line + 1) + " character " + (indexInLine + 1));
						} else {
							throw new Error("Unexpected end of input");
						}
					}
				}
				
				function initResult(index, type) {
					return {type, value: [], index};
				}
					
				function collect(val, result) {
					if (val === false) return false;
					if (Array.isArray(val)) result.value.push(...val);
					else result.value.push(val);
					return true;
				}
				
				function getLocationInfo(index, code) {
					let i = code.indexOf("\n"),
						prevI = -1,
						j = 0;
					
					while (i < index && i !== -1) {
						prevI = i;
						i = code.indexOf("\n", i + 1);
						j++;
					}
					
					return {index, line: j, indexInLine: index - prevI - 1};
				}
				
				
				parse.parse = parse;
				
				parse.tokenize = function tokenize(text) {
					return parseTokens(text);
				}
				
				parse.getLocationInfo = getLocationInfo;
				
				
				return parse;
			})();
		