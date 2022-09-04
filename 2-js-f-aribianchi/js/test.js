/**
 * Web Atelier 2020 2 - JavaScript
 */

const jsc = window.jsc;
const xmlParser = new window.DOMParser();
const utils = jsc_utils(jsc);
const arbs = arbitrary_utils(jsc);
const propEqual = utils.propEqual;
const propNotEqual = utils.propNotEqual;
const property = jsc.property;

function vectorSum(arr1, arr2) { return _.zipWith(arr1, arr2, _.add); }

window.vectorSum = vectorSum;

function compose(f, g) { return x => f(g(x)); }


describe('Task 1', function() {
    describe('scalar_product', function() {
        it('should return undefined', function() {

            should(scalar_product()).be.undefined;

        });

        it('should return undefined', function() {

            let a = [1, 2, 3];

            should(scalar_product(a)).be.undefined;
        });

        property(
            "doesn't change the source array",
            "array number", "number",
            function(arr, num) {
                let copy = _.cloneDeep(arr);
                let t = scalar_product(copy, num);
                return propEqual(copy, arr, `scalar_product([${copy}],${num})`, `[${arr}]`);
            });

        property(
            "preserves the length of the array",
            "array number", "number",
            function(arr, num) {
                return propEqual(scalar_product(arr, num).length, arr.length, `scalar_product([${arr}],${num}).length`, `${arr}.length`);
            });
        property(
            "returns zero array if the factor is zero",
            "array number",
            function(arr) {
                let z = _.cloneDeep(arr);
                _.fill(z, 0);
                return propEqual(scalar_product(arr, 0), z, `scalar_product([${arr}],0)`, `[${z}]`);
            });
        property(
            "preserves the array if the factor is one",
            "array number",
            function(arr) {
                let c = _.cloneDeep(arr);
                return propEqual(scalar_product(arr, 1), c, `scalar_product([${arr}],1))`, `[${c}]`);
            });
        property(
            "allows factors to be combined",
            "array integer", "integer", "integer",
            function(arr, n1, n2) {
                return propEqual(scalar_product(scalar_product(arr, n1), n2),
                    scalar_product(arr, n1 * n2), `scalar_product(scalar_product([${arr}],${n1}),${n2})`, `scalar_product([${arr}], ${n1}*${n2})`);
            });
        property(
            "distributes over scalar addition",
            "array integer", "integer", "integer",
            function(arr, n1, n2) {
                return propEqual(scalar_product(arr, n1 + n2),
                    vectorSum(scalar_product(arr, n1),
                        scalar_product(arr, n2)), `scalar_product([${arr}], ${n1}+${n2})`, `vectorSum(scalar_product([${arr}], ${n1}), scalar_product([${arr}], ${n2}))`);
            });
        property(
            "distributes over vector addition",
            arbs.equalLengthArrays(jsc.integer, jsc.integer), "integer",
            function(arrs, n) {
                let [a1, a2] = arrs;
                return propEqual(scalar_product(vectorSum(a1, a2), n),
                    vectorSum(scalar_product(a1, n),
                        scalar_product(a2, n)), `scalar_product(vectorSum([${a1}],[${a2}]), ${n})`, `vectorSum(scalar_product([${a1}],${n}), scalar_product([${a2}],${n}))`);
            });
        property(
            "returns undefined if first argument is not an array",
            jsc.suchthat(arbs.anything, x => !_.isArray(x)), arbs.anything,
            function(notArr, x) {
                return propEqual(scalar_product(notArr, x), undefined, `scalar_product(${notArr}, ${x})`, `undefined`);
            });
        property(
            "if factor is not passed, array is returned as is",
            "array number",
            function(arr) {
                return propEqual(scalar_product(arr), arr, `scalar_product([${arr}])`, `[${arr}]`);
            });
    });


    describe('inner_product', function() {
        property(
            "doesn't change the source arrays",
            arbs.equalLengthArrays(jsc.number, jsc.number),
            function(arrs) {
                let [a1, a2] = arrs;
                let copy1 = _.cloneDeep(a1);
                let copy2 = _.cloneDeep(a2);
                var t = inner_product(a1, a2);
                return propEqual(a1, copy1) && propEqual(a2, copy2, `inner_product([${a1}],[${a2}])`);
            });
        property(
            "is symmetric",
            arbs.equalLengthArrays(jsc.number, jsc.number),
            function(arrs) {
                let [a1, a2] = arrs;
                return propEqual(inner_product(a1, a2), inner_product(a2, a1), `inner_product([${a1}],[${a2}])`, `inner_product([${a2}],[${a1}])`);
            });
        property(
            "returns non-negative number when multiplying vector to itself",
            "array number",
            function(arr) {
                return inner_product(arr, arr) >= 0;
            });
        property(
            "returns 0 if one of the vectors is a zero-filled [0,...,0] vector",
            "array number",
            function(arr) {
                let z = new Array(arr.length);
                _.fill(z, 0);
                return propEqual(inner_product(arr, z), 0, `inner_product([${arr}],[${z}])`, `0`);
            });
        property(
            "is linear wrt scalar product and vector addition",
            arbs.equalLengthArrays(jsc.integer, jsc.integer, jsc.integer),
            "integer", "integer",
            function(arrs, x, y) {
                let [a1, a2, a3] = arrs;
                return propEqual(inner_product(a1,
                        vectorSum(scalar_product(a2, x),
                            scalar_product(a3, y))),
                    x * inner_product(a1, a2) + y * inner_product(a1, a3), `inner_product([${a1}], vectorSum(scalar_product([${a2}],${x}), scalar_product([${a3}],${y})))`, `${x}*inner_product([${a1}],[${a2}]) + ${y}*inner_product([${a1}],[${a3}])`);
            });
        property(
            "if either argument is not an array, returns undefined",
            jsc.suchthat(arbs.anything, x => !_.isArray(x)), jsc.array(arbs.anything),
            function(notArr, arr) {
                return propEqual(inner_product(notArr, arr), undefined) &&
                    propEqual(inner_product(arr, notArr), undefined);
            });
        property(
            "if argument arrays sizes don't match, returns undefined",
            jsc.array(arbs.anything),
            function(arr1) {
                return jsc.forall(
                    jsc.suchthat(jsc.array(arbs.anything),
                        x => x.length !== arr1.length),
                    function(arr2) {
                        return propEqual(inner_product(arr1, arr2), undefined, `inner_product([${arr1}],[${arr2}])`, `undefined`);
                    });
            });
    });

    describe('map_reduce', function() {
        // mapReduce is pretty agnostic to the array contents
        // so we could use "json" arbitrary instead of "number"
        // to get better coverage
        // Unfortunately, it is also quite slower
        property(
            "doesn't change the source array",
            "array integer", "integer -> integer",
            function(arr, f) {
                let copy = _.cloneDeep(arr);
                let t = mapReduce(copy, f);
                return propEqual(copy, arr, `[${copy}]`, `[${arr}]`);
            });
        property(
            "mapReduce([],f,g,seed) == seed",
            "integer -> integer", arbs.fn2(jsc.integer), "integer",
            function(f, combine, seed) {
                return propEqual(mapReduce([], f, combine, seed), seed, `mapReduce([],${f},${combine},${seed})`, `${seed}`);
            });
        property(
            "mapReduce([x].concat(arr),f,combine,seed) == " +
            "mapReduce(arr,f,combine,combine(seed,f(x)))",
            "integer", "array integer", "integer -> integer",
            arbs.fn2(jsc.integer), "integer",
            function(x, arr, f, combine, seed) {
                return propEqual(mapReduce([x].concat(arr), f, combine, seed),
                    mapReduce(arr, f, combine, combine(seed, f(x))), `mapReduce([${x}].concat([${arr}]),${f},${combine},${seed})`, `mapReduce([${arr}],${f},${combine},${combine}(${seed},${f}(${x})))`);
            });
        property(
            "mapReduce(arr,identity,combine,seed) == reduce(arr,combine,seed)",
            "array integer", arbs.fn2(jsc.integer), "integer",
            function(arr, combine, seed) {
                return propEqual(mapReduce(arr, _.identity, combine, seed),
                    _.reduce(arr, combine, seed), `mapReduce([${arr}],${_.identity},${combine},${seed})`, `_.reduce([${arr}],${combine},${seed})`);
            });
        property(
            "mapReduce(map(arr,g),f,combine,seed) == " +
            "mapReduce(arr,compose(f,g),combine,seed)",
            "array integer", "integer -> integer", "integer -> integer",
            arbs.fn2(jsc.integer), "integer",
            function(arr, f, g, combine, seed) {
                return propEqual(
                    mapReduce(_.map(arr, g), f, combine, seed),
                    mapReduce(arr, compose(f, g), combine, seed), `mapReduce(_.map([${arr}],${g}),${f},${combine},${seed})`, `mapReduce([${arr}],${compose}(${f},${g}),${combine},${seed})`);
            });
        property(
            "mapReduce(arr,f,combine,seed) == " +
            "mapReduce(arr,identity,(a,x) => combine(a,f(x)),f(seed))",
            "array integer", "integer -> integer", arbs.fn2(jsc.integer),
            "integer",
            function(arr, f, combine, seed) {
                return propEqual(
                    mapReduce(arr, f, combine, seed),
                    mapReduce(arr, _.identity, (a, x) => combine(a, f(x)), seed), `mapReduce([${arr}],${f},${combine},${seed})`, `mapReduce([${arr}],${_.identity},(a,x) => ${combine}(a,${f}(x)),${seed})`);
            });
        property(
            "mapReduce(arr1.concat(arr2),f) == mapReduce(arr1,f) + mapReduce(arr2,f)",
            "array integer", "array integer", "integer -> integer",
            function(arr1, arr2, f) {
                return propEqual(
                    mapReduce(arr1.concat(arr2), f),
                    mapReduce(arr1, f) + mapReduce(arr2, f), `mapReduce([${arr1}].concat([${arr2}]),${f})`, `mapReduce([${arr1}],${f}) + mapReduce([${arr2}],${f})`);
            });
        property(
            "mapReduce(arr1.concat(arr2),f,+,0) == " +
            "mapReduce(arr1,f,+,0) + mapReduce(arr2,f,+,0)",
            "array integer", "array integer", "integer -> integer",
            function(arr1, arr2, f) {
                return propEqual(
                    mapReduce(arr1.concat(arr2), f, _.add, 0),
                    mapReduce(arr1, f, _.add, 0) + mapReduce(arr2, f, _.add, 0), `mapReduce([${arr1}].concat([${arr2}]),${f}, ${_.add}, 0)`, `mapReduce([${arr1}],${f},${_.add},0) + mapReduce([${arr2}],${f},${_.add},0)`);
            });
        property(
            "mapReduce(arr1.concat(arr2),(a,x) => a.concat(x),[]) == " +
            "mapReduce(arr1,f,(a,x) => a.concat(x),[])." +
            "concat(mapReduce(arr2,f,(a,x) => a.concat(x),[]))",
            "array integer", "array integer", "integer -> array integer",
            function(arr1, arr2, f) {
                return propEqual(
                    mapReduce(arr1.concat(arr2), f, (a, x) => a.concat(x), []),
                    mapReduce(arr1, f, (a, x) => a.concat(x), []).concat(mapReduce(arr2, f, (a, x) => a.concat(x), [])), `mapReduce([${arr1}].concat([${arr2}]),${f},(a,x) => a.concat(x), [])`, `mapReduce([${arr1}],${f},(a,x) => a.concat(x),[]).concat(mapReduce([${arr2}],${f},(a,x) => a.concat(x),[]))`);
            });
        property(
            "mapReduce(arr,f,(a,x) => a.concat([x]),[]) == map(arr,f)",
            "array integer", "integer -> integer",
            function(arr, f) {
                return propEqual(mapReduce(arr, f, (a, x) => a.concat([x]), []),
                    _.map(arr, f), `mapReduce([${arr}],${f},(a,x) => a.concat([x]), [])`, `${_.map(arr,f)}`);
            });
        property(
            "mapReduce(arr,f,(a,x) => [x].concat(a),[]) == map(reverse(arr),f)",
            "array integer", "integer -> integer",
            function(arr, f) {
                let revArr = _.cloneDeep(arr);
                _.reverse(revArr);
                return propEqual(mapReduce(arr, f, (a, x) => a.concat([x]), []),
                    _.map(arr, f), `mapReduce([${arr}],${f},(a,x) => a.concat([x]), [])`, `[${_.map(arr,f)}]`);
            });
        property(
            "mapReduce(arr,f,(a,x) => a.concat(x),[]) == flatMap(arr,f)",
            "array integer", "integer -> array integer",
            function(arr, f) {
                return propEqual(mapReduce(arr, f, (a, x) => a.concat(x), []),
                    _.flatMap(arr, f), `mapReduce([${arr}],${f},(a,x) => a.concat(x),[])`,
                    `[${_.flatMap(arr,f)}]`);
            });
        property(
            "mapReduce([1,2,3],f,g,0) == g(g(g(0,f(1)),f(2)),f(3))",
            "integer -> integer", arbs.fn2(jsc.integer),
            function(f, g) {
                return propEqual(mapReduce([1, 2, 3], f, g, 0),
                    g(g(g(0, f(1)), f(2)), f(3)), `mapReduce([1,2,3],${f},${g},0)`, `${g(g(g(0,f(1)),f(2)),f(3))}`);
            });
        property(
            "if the first argument is not an array, returns undefined",
            jsc.suchthat(arbs.anything, x => !Array.isArray(x)),
            "number -> number",
            function(notArr, f) {
                return propEqual(mapReduce(notArr, f), undefined);
            });
        property(
            "if the second argument is not a function, returns undefined",
            "array integer", jsc.suchthat(arbs.anything, x => typeof x !== 'function'),
            function(arr, notF) {
                return propEqual(mapReduce(arr, notF), undefined);
            });
        property(
            "if the third argument is present and is not a function, " +
            "returns undefined",
            "array integer", "integer -> integer",
            jsc.suchthat(arbs.anything,
                x => typeof x !== 'function' && x !== undefined),
            arbs.anything,
            function(arr, f, notF, seed) {
                return propEqual(mapReduce(arr, f, notF, seed), undefined);
            });
    });

    describe('merge_sorted_arrays', function() {
        property(
            "doesn't change the source arrays",
            arbs.sortedArray(jsc.integer), arbs.sortedArray(jsc.integer),
            function(a, b) {
                let copy1 = _.cloneDeep(a);
                let copy2 = _.cloneDeep(b);
                let t = merge_sorted_arrays(copy1, copy2);
                return propEqual(copy1, a) && propEqual(copy2, b);
            });
        property(
            "is symmetric",
            arbs.sortedArray(jsc.integer), arbs.sortedArray(jsc.integer),
            function(a, b) {
                return propEqual(merge_sorted_arrays(a, b), merge_sorted_arrays(b, a), `merge_sorted_arrays([${a}],[${b}])`, ` merge_sorted_arrays([${b}],[${a}])`);
            });
        property(
            "produces sorted results",
            arbs.sortedArray(jsc.integer), arbs.sortedArray(jsc.integer),
            function(a, b) {
                let t = merge_sorted_arrays(a, b);
                return propEqual(t, _.sortBy(t), `[${t}]`, `merge_sorted_arrays([${a}],[${b}])`);
            });
        property(
            "has length equal to the sum of individual lengths",
            arbs.sortedArray(jsc.integer), arbs.sortedArray(jsc.integer),
            function(a, b) {
                return propEqual(merge_sorted_arrays(a, b).length, a.length + b.length, `merge_sorted_arrays([${a}],[${b}]).length`, `[${a}].length + [${b}].length`);
            });
        property(
            "is the same as concatenating and then sorting",
            arbs.sortedArray(jsc.integer), arbs.sortedArray(jsc.integer),
            function(a, b) {
                return propEqual(merge_sorted_arrays(a, b), _.sortBy(a.concat(b)), `merge_sorted_arrays([${a}],[${b}])`, `_.sortBy([${a}].concat([${b}]))}`);
            });
        property(
            "if either of arguments is not an array, returns undefined",
            "array integer", jsc.suchthat(arbs.anything, x => !_.isArray(x)),
            jsc.suchthat(arbs.anything, x => !_.isArray(x)),
            function(arr, notA, notB) {
                return propEqual(merge_sorted_arrays(notA, arr), undefined) &&
                    propEqual(merge_sorted_arrays(arr, notB), undefined) &&
                    propEqual(merge_sorted_arrays(notA, notB), undefined);
            });
    });

    describe('range', function() {
        property(
            "results in undefined if step is zero",
            "integer", "integer",
            function(x, y) {
                return propEqual(range(x, y, 0), undefined, `range(${x},${y},0)`, undefined, `[${range(x,y,0)}]`);
            });
        property(
            "results in empty array if x > y and step > 0 or x < y and step < 0",
            "integer",
            function(x) {
                return jsc.forall(
                    jsc.suchthat(jsc.integer, y => y != x), arbs.posInteger,
                    function(y, stepMod) {
                        let s = x > y ? stepMod : -stepMod
                        return propEqual(range(x, y, s), [], `range(${x},${y},${s})`, undefined, `[${range(x,y,s)}]`);
                    });
            });
        property(
            "range(x,y) = reverse(range(y,x,-1))",
            "integer", "integer",
            function(x, y) {
                return propEqual(range(x, y), _.reverse(range(y, x, -1)), `range(${x},${y})`, `_.reverse(range(${y},${x},-1)`);
            });
        property(
            "produces results sorted according to the step sign",
            "integer", "integer", jsc.suchthat(jsc.integer, x => x != 0),
            function(x, y, step) {
                let r = range(x, y, step);
                if (step > 0) return propEqual(r, _.sortBy(r), `range(${x},${y},${step})`, undefined, `[${range(x,y,step)}]`);
                return propEqual(r, _.sortBy(r, x => -x), `range(${x},${y},${step})`, undefined, `[${range(x,y,step)}]`);
            });
        property(
            "produces array without repetitions",
            "integer", "integer", jsc.suchthat(jsc.integer, x => x != 0),
            function(x, y, step) {
                let r = range(x, y, step);
                return propEqual(r.length, _.uniq(r).length, `range(${x},${y},${step})`, undefined, `[${range(x,y,step)}]`);
            });
        property(
            "produces array with all elements >= min(x,y)",
            "integer", "integer", jsc.suchthat(jsc.integer, x => x != 0),
            function(x, y, step) {
                let r = range(x, y, step);
                let l = _.min([x, y]);
                return propEqual(_.every(r, a => a >= l), true, `range(${x},${y},${step})`, undefined, `[${range(x,y,step)}]`);
            });
        property(
            "produces array with all elements <= max(x,y)",
            "integer", "integer", jsc.suchthat(jsc.integer, x => x != 0),
            function(x, y, step) {
                let r = range(x, y, step);
                let h = _.max([x, y]);
                return propEqual(_.every(r, a => a <= h), true, `range(${x},${y},${step})`, undefined, `[${range(x,y,step)}]`);
            });
        property(
            "produces array with length max(0,1 + floor((y-x) / step))",
            "integer", "integer", jsc.suchthat(jsc.integer, x => x != 0),
            function(x, y, step) {
                let r = range(x, y, step);
                return propEqual(r.length,
                    _.max([0, 1 + Math.floor((y - x) / step)]), `range(${x},${y},${step})`, undefined, `[${range(x,y,step)}]`);
            });
        property(
            "produces array where nth element is x + n*step",
            "integer", "integer", jsc.suchthat(jsc.integer, x => x != 0), "nat",
            function(x, y, step, ind_) {
                let r = range(x, y, step);
                if (r.length == 0) return true; // vacuously
                let ind = ind_ % r.length;
                return propEqual(r[ind], x + ind * step, `range(${x},${y},${step})`, undefined, `[${range(x,y,step)}]`);
            });
        property(
            "returns undefined, if either argument is not a number",
            "number", "number", jsc.suchthat(jsc.number, x => x != 0),
            jsc.suchthat(arbs.anything, x => !_.isNumber(x) || _.isNaN(x)),
            jsc.suchthat(arbs.anything, x => !_.isNumber(x) || _.isNaN(x)),
            jsc.suchthat(arbs.anything, x => !_.isNumber(x) || _.isNaN(x)),
            jsc.suchthat(arbs.anything, x => !_.isUndefined(x) &&
                (!_.isNumber(x) || _.isNaN(x))),
            function(x, y, step, nN1, nN2, nN3, nN4) {
                return propEqual(range(nN1, nN2, step), undefined) &&
                    propEqual(range(nN1, y, step), undefined) &&
                    propEqual(range(x, nN2, step), undefined) &&
                    propEqual(range(nN1, nN2, nN3), undefined) &&
                    propEqual(range(x, y, nN4), undefined) &&
                    propEqual(range(nN1, y, nN3), undefined) &&
                    propEqual(range(x, nN2, nN3), undefined);
            });
    });

    describe('array_intersect', function() {
        property(
            "intersect with empty array gives an empty array",
            "array number",
            function(arr) {
                return propEqual(array_intersect(arr, []), [], `array_intersect([${arr}],[]))`, `[]`);
            });
        property(
            "intersect with same array gives the same array",
            "array number",
            function(arr) {
                return propEqual(array_intersect(arr, arr), arr, `array_intersect([${arr}],[${arr}]))`, `[${arr}]`);
            });
        property(
            "intersect with augmented array gives the original array",
            "array number", "array number",
            function(arr, extra) {
                let e = arr.concat(extra);
                return propEqual(array_intersect(arr, e), arr, `array_intersect([${arr}],[${e}]))`, `[${arr}]`);
            });
        property(
            "intersect with non array is undefined",
            "array number", "number",
            function(arr, nat) {
                return propEqual(array_intersect(arr, nat), undefined, `array_intersect([${arr}],${nat}))`);
            });
        property(
            "intersect with non array is undefined",
            "array number", "number",
            function(arr, nat) {
                return propEqual(array_intersect(nat, arr), undefined, `array_intersect([${arr}],${nat}))`);
            });
        property(
            "length of result is always smaller than smallest input array",
            "array number", "array number",
            function(arr, bis) {
                return propEqual((array_intersect(arr, bis).length <= Math.min(arr.length, bis.length)), true, `array_intersect([${arr}],[${bis}])).length <= ${Math.min(arr.length, bis.length)}`, 'true');
            });
        property(
            "result contains at least one common element",
            "array number", "array number", "number",
            function(arr, bis, common) {
                arr.push(common);
                bis.push(common);
                return propEqual((array_intersect(arr, bis).indexOf(common) >= 0), true, `array_intersect([${arr}],[${bis}])).indexOf(${common}) >= 0`, 'true');
            });
        property(
            "is symmetric",
            "array number", "array number",
            function(a1, a2) {
                return propEqual(array_intersect(a1, a2), array_intersect(a2, a1), `array_intersect([${a1}],[${a2}])`, `array_intersect([${a2}],[${a1}])`);
            });
    });

    describe('array_difference', function() {
        property(
            "difference with empty array gives original array",
            "array number",
            function(arr) {
                return propEqual(array_difference(arr, []), arr, `array_difference([${arr}],[]))`, `[${arr}]`);
            });
        property(
            "difference with same array gives empty array",
            "array number",
            function(arr) {
                return propEqual(array_difference(arr, arr), [], `array_difference([${arr}],[${arr}]))`, `[]`);
            });
        property(
            "difference with augmented array gives the original array",
            "array number", "array number",
            function(arr, extra) {
                let e = arr.concat(extra);
                return propEqual(array_difference(e, extra), arr, `array_difference([${e}],[${extra}]))`, `[${arr}]`);
            });
        property(
            "difference with non array is undefined",
            "array number", "number",
            function(arr, nat) {
                return propEqual(array_difference(arr, nat), undefined, `array_difference([${arr}],${nat}))`);
            });
        property(
            "difference with non array is undefined",
            "array number", "number",
            function(arr, nat) {
                return propEqual(array_difference(nat, arr), undefined, `array_difference([${arr}],${nat}))`);
            });
        property(
            "length of result is always smaller than length of the first array",
            "array number", "array number",
            function(arr, bis) {
                return propEqual((array_difference(arr, bis).length <= arr.length), true, `array_difference([${arr}],[${bis}])).length <= ${arr.length}`, 'true');
            });
        property(
            "result does not contain at least one common element",
            "array number", "array number", "number",
            function(arr, bis, common) {
                arr.push(common);
                bis.push(common);
                return propEqual(array_difference(arr, bis).indexOf(common), -1, `array_difference([${arr}],[${bis}])).indexOf(${common})`, '-1');
            });
        property(
            "is not symmetric",
            "array number", "array number", "number",
            function(a1, a2, extra) {
                a1.push(extra);
                return propNotEqual(array_difference(a1, a2), array_difference(a2, a1), `array_difference([${a1}],[${a2}])`, `array_difference([${a2}],[${a1}])`);
            });
    });

});


describe('Task 2', function() {
    describe('iterator', function() {
        property(
            "iterator without array is undefined",
            "number",
            function(n) {
                return propEqual(iterator(n), undefined, `iterator(${n}))`);
            });
        property(
            "iterator without array is undefined",
            "falsy",
            function(n) {
                return propEqual(iterator(n), undefined, `iterator(${n}))`);
            });
        property(
            "iterator with array returns function",
            "array",
            function(a) {
                return propEqual(typeof iterator(a), 'function', `typeof iterator([${a}])`, 'function');
            });
    });
    describe('next', function() {
        property(
            "calling next() once returns the first element of the array",
            "number",
            function(n) {
                let a = [n];
                let next = iterator(a);
                return propEqual(next(), a[0], `iterator([${a}])()`, `${a[0]}`);
            });
        property(
            "calling next() twice returns the second element of the array",
            "array number",
            function(a) {
                if (a.length >= 2) {
                    let next = iterator(a);
                    next();
                    return propEqual(next(), a[1], `next = iterator([${a}]); next(); next();`, `${a[1]}`);
                }
                return true;
            });
        property(
            "calling next() multiple times returns every element of the array one by one",
            "array number",
            function(a) {
                let next = iterator(a);
                let check = a.map((e, i) => {
                    return propEqual(next(), e, `next = iterator([${a}]); next(); //${i} times`, `${e}`);
                });
                return check.every(e => e === true);
            });
        property(
            "calling next() beyond the end of the array throws an Error",
            "array number",
            function(a) {
                let next = iterator(a);
                a.forEach(e => { next(); });
                next.should.throw();
                return true;
            });
    });
    describe('next (advanced)', function() {
        property(
            "calling next(0) returns the initial position",
            "array number",
            function(a) {
                let next = iterator(a);
                return propEqual(next(0), 0, `iterator([${a}])(0)`, `0`);
            });
        property(
            "calling next(-1) and next() again should go back to the previous element",
            "array number",
            function(a) {
                if (a.length >= 1) {
                    let next = iterator(a);
                    let prev = next();
                    next(-1);
                    let again = next();
                    return propEqual(prev, again, `next = iterator([${a}]); prev = next(); next(-1); next()`, `${prev}`)
                } else return true;
            });
        property(
            "calling next([...]) returns next itself",
            "array number",
            function(a) {
                let next = iterator(a);
                return propEqual(next(a), next, `iterator([${a}])([${a}])`, `${next}`);
            });
        property(
            "calling next([...]) resets the iteration",
            "array number",
            function(a) {
                a.push('at least one element');
                let next = iterator(a);
                let c = next();
                next = next(a);
                let b = next();
                return propEqual(c, b, `iterator([${a}])()`, `iterator([${a}])([${a}])()`);
            });
        //TODO check that next([...]) resets from the beginning
    });
});

describe('Task 3', function() {
    describe('slideshow', function() {
        it('should initially display the first image', function() {

            let dom = {}; //fake <img element>
            let advance = init_slideshow(['images/campus1.jpg', 'images/campus2.jpg'], dom);
            dom.src.should.be.equal('images/campus1.jpg');

        });
        it('should manually advance to the next image and start again from the first', function() {

            let dom = {}; //fake <img element>
            let advance = init_slideshow(['images/campus1.jpg', 'images/campus2.jpg'], dom);
            dom.src.should.be.equal('images/campus1.jpg');
            advance();
            dom.src.should.be.equal('images/campus2.jpg');
            advance();
            dom.src.should.be.equal('images/campus1.jpg');

        });
        it('should automatically advance to the next image', function(done) {

            let dom = {}; //fake <img element>
            let advance = init_slideshow(['images/campus1.jpg', 'images/campus2.jpg'], dom, true, 50);
            dom.src.should.be.equal('images/campus1.jpg');
            setTimeout(() => {
                dom.src.should.be.equal('images/campus2.jpg');
                done();
            }, 60);

        });
        it('should support multiple slideshows', function() {

            let dom1 = {}; //fake <img element>
            let dom2 = {}; //fake <img element>
            let advance1 = init_slideshow(['images/campus1.jpg', 'images/campus2.jpg'], dom1);
            let advance2 = init_slideshow(['images/campus3.jpg', 'images/campus4.jpg'], dom2);
            dom1.src.should.be.equal('images/campus1.jpg');
            dom2.src.should.be.equal('images/campus3.jpg');
            advance1();
            dom1.src.should.be.equal('images/campus2.jpg');
            dom2.src.should.be.equal('images/campus3.jpg');
            advance2();
            dom1.src.should.be.equal('images/campus2.jpg');
            dom2.src.should.be.equal('images/campus4.jpg');
            advance1();
            advance2();
            dom1.src.should.be.equal('images/campus1.jpg');
            dom2.src.should.be.equal('images/campus3.jpg');

        });
    });

});

describe('Task 4', function() {
    describe('mini_md', function() {

        it('plain text should not change', function() {
            let input = `This is just a plain
    text and should be returned
as is
    because it does not have any empty lines`;
            should(mini_md(input)).be.equal(input);
        });

        it('one paragraph', function() {
            let input = `
This is just a plain
    text but since it starts with an empty line it should be wrapped into <p></p> elements
`;
            let output = `<p>
This is just a plain
    text but since it starts with an empty line it should be wrapped into <p></p> elements
</p>`;
            should(mini_md(input)).be.equal(output);
        });

        it('two paragraphs', function() {
            let input = `
This is just a plain text but it starts with an empty line so it
belongs
in a pagraph, which will end at the next empty line.

Here is the next paragraph, which is also the last one.
`;
            let output = `<p>
This is just a plain text but it starts with an empty line so it
belongs
in a pagraph, which will end at the next empty line.
</p><p>
Here is the next paragraph, which is also the last one.
</p>`;
            should(mini_md(input)).be.equal(output);
        });

        it('heading 1', function() {
            let input = `# Title`;
            let output = `<h1>Title</h1>`;
            should(mini_md(input)).be.equal(output);
        });

        it('heading 2', function() {
            let input = `## SubTitle`;
            let output = `<h2>SubTitle</h2>`;
            should(mini_md(input)).be.equal(output);
        });

        it('both headings', function() {
            let input = `# Main Title
## SubTitle`;
            let output = `<h1>Main Title</h1>
<h2>SubTitle</h2>`;
            should(mini_md(input)).be.equal(output);
        });

        it('more complex example', function() {
            let input = `# Main Title

First Paragraph

## SubTitle

Second Paragraph
`;
            let output = `<h1>Main Title</h1>
<p>
First Paragraph
</p><p>
<h2>SubTitle</h2>
</p><p>
Second Paragraph
</p>`;
            should(mini_md(input)).be.equal(output);
        });

    });
});