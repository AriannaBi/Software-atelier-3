/**
 * Web Atelier 2020 2 - JavaScript
 *
 * Student: __Arianna Bianchi__
 *
 */

//--------------------------------------------------------------------------------------
// Task 1
//--------------------------------------------------------------------------------------


 /**
 * @param {number[]} a - The array of numbers.
 * @param {number} c - The scalar multiplier.
 * @return {number[]} An array computed by multiplying each element of the input array `a`
 * with the input scalar value `c`.
 */
function scalar_product(a, c) {
    if (!Array.isArray(a)) {
        return;
    }
    if (c == undefined) {
        return a;
    }
    var a_copy = [];
    if (a !== undefined) {
        for (let i = 0; i < a.length; i++) {
            a_copy[i] = a[i] * c;
        }
    return a_copy;
    } else {
        return;
    }   
}


/**
 * @param {number[]} a - The first array of numbers.
 * @param {number[]} b - The second array of numbers.
 * @return {number} A value computed by summing the products of each pair
 * of elements of its input arrays `a`, `b` in the same position.
 */
function inner_product(a, b) {
    if (!Array.isArray(a) || !Array.isArray(b))  {
        return;
    }
    var result = 0;
    if ((a.length != b.length)) {
        return;
    } 

    for (let i = 0; i < a.length; i++) {
        result += a[i] * b[i];
    } return result;
}


/**
 * @param {array} a - The array.
 * @param {function} mapfn - The function for the map step.
 * @param {function} [reducefn= function(x,y) { return x+y; }] - The
 * function for the reduce step.
 * @param {string} [seed=""] - The accumulator for the reduce step.
 * @return {*} The reduced value after the map and reduce steps.
 */
function mapReduce(a, f, combine = function (x, y) { return x + y; }, seed = "") {
    // var a_copy = a.map(f);
    // return a_copy.reduce(combine, seed);

    if (!Array.isArray(a) || typeof f !== "function" || typeof combine !== "function") {
        return;
    }

    if (a.length == 0) {
        return seed;
    }

    var a_copy = a.map(f);
    for (let i = 0; i < a_copy.length; i++) {
        var result = combine(seed, a_copy[i]);
        seed = result;
    }
    

    return result;
    
}


/**
 * @param {number[]} a - The first sorted array of numbers.
 * @param {number[]} b - The second sorted array of numbers.
 * @return {number[]} A sorted array with all the elements from both `a` and `b`.
 */
function merge_sorted_arrays(a, b) {
    if (!Array.isArray(a) || !Array.isArray(b))  {
        return;
    }
    var new_array = [];
    var i = 0;
    var j = 0;

    while (new_array.length < a.length + b.length) {
        if (i >= a.length) {
            new_array.push(b[j]);
            j++;
        } else {
        if (j >= b.length) {
            new_array.push(a[i]);
            i++;
        } else {
        if (a[i] < b[j]) {
            new_array.push(a[i]);
            i++;
        } else {
            new_array.push(b[j]);
            j++;
        }}}
    } return new_array;
}

/**
* @param {integer} x - The first integer.
* @param {integer} y - The second integer.
* @param {integer} [step=1] - The value to add at each step.
* @return {integer[]} An array containing numbers x, x+step, … last, where:
*    - last equals x + n*step for some n,
*    - last <= y < last + step if step > 0 and
*    - last + step < y <= last if step < 0.
*/
function range(x, y, step = 1) {
    if (!Number.isInteger(x) || !Number.isInteger(y) || !Number.isInteger(step) || step === 0) {
        return;
    }

    if (x > y && step > 0 || x < y && step < 0) {
        return [];
    }

    if (x === y) {
        return [x];
    }

    let ar_copy = [];
    ar_copy.push(x);

    let value = x;

    if (step > 0) {
        while (value <= y) {
            value = value + step;
            if (value <= y) {                    
                ar_copy.push(value);
            }
        }    
    } else {
        while (value >= y) {
            value = value + step;
            if (value >= y) {                    
                ar_copy.push(value);
            }
        }
    } 
    return ar_copy;
}



/**
 * @param {number[]} a - The first array of numbers.
 * @param {number[]} b - The second array of numbers.
 * @return {number[]} An array with the elements found both in `a` and `b`.
 */
function array_intersect(a, b) {
    if (!Array.isArray(a) || !Array.isArray(b))  {
        return;
    }

    let intersection = a.filter(x => b.includes(x));
    return intersection;
}



/**
 * @param {number[]} a - The first array of numbers.
 * @param {number[]} b - The second array of numbers.
 * @return {number[]} An array with the elements found in `a` but not in `b`.
 */
function array_difference(a, b) {
    if (!Array.isArray(a) || !Array.isArray(b))  {
        return;
    }
    let difference = a.filter(x => !b.includes(x));
    return difference;
}


//--------------------------------------------------------------------------------------
// Task 2
//--------------------------------------------------------------------------------------

/**
 * @param {number[]} a - The array over which to iterate.
 * @return {function} - call this function to retrieve the next element of the array. 
 * The function throws an error if called again after it reaches the last element.
 */
function iterator(a) {
    if (!Array.isArray(a))  {
        return;
    }
    let n = 0;
    //inner function
    return function next(b) {
        if (Array.isArray(b)) {
            b = a.slice();
            n = 0;
            return next;
        }
        if (!isNaN(b)) {
            n = n + b;
            if (n < 0) {
                return n = a.length-1;
            } else {
                return n;
            }
        } else if (n >= a.length) {
            throw 'index out of range';
        }
        if (b == undefined) {
            n++;
            return a[n-1];
        }
    } 
}


//--------------------------------------------------------------------------------------
// Task 3
//--------------------------------------------------------------------------------------

function init_slideshow(image_urls, dom, automatic = false, delay = 3000) {
    let it = iterator(image_urls);
    let image;
    var i;
    let pausa = false;
    let reverse = false;

    nextImg();
    function nextImg(string) {
        if (string === "prv") {
            it(-2);
            image = it();
        } else if (string === "pse") {
            clearInterval(i);
            pausa = true;
        } else if (string === "rsm") {
            if (pausa) {
                i = setInterval(nextImg, delay);
                pausa = false;
            }
        } else if (string === "reverse") {
            it(-2);
            image = it();
            reverse = !reverse;
            console.log(reverse);
        } else {
            if (reverse) {
                try {
                    image = it(-2);
                } catch (error) {
                    it(image_urls);
                    image = it();
                }
            }
            try {
                image = it();
            } catch (error) {
                it(image_urls);
                image = it();
            }   
        }
        dom.src = image;
    }

    if (automatic) {
        i = setInterval(nextImg, delay);
    }
    return nextImg;
}

//--------------------------------------------------------------------------------------
// Task 4
//--------------------------------------------------------------------------------------

function mini_md(text) {
    var line = text.split("\n");
    var str = "";
    var flag = false;
    var openParag = false;
    
    line.forEach(elem => {
        if ((flag && !openParag)) {
            if (elem.startsWith('##')) {
                str = str + '<p>' + "\n" + '<h2>' + elem.substring(3) + '</h2>';
            } else if (elem.startsWith('#')) {
                str = str + '<p>' + "\n" + '<h1>' + elem.substring(3) + '</h1>';
            } else {
                str = str + '<p>' + "\n" + elem;
            }
            openParag = true;     
        } else if (elem.startsWith('##')) {
            str = str + '<h2>' + elem.substring(3) + '</h2>';
            if (elem != line[line.length - 1]) {
                str = str + "\n";
            }
        } else if (elem.startsWith('#')) {
            str = str + '<h1>' + elem.substring(2) + '</h1>';
            if (elem != line[line.length - 1]) {
                str = str + "\n";
            }
        } else if (elem === "") {
            if(elem === line[0] && !openParag){
                flag = true;
            } else if(openParag){
                str = str + "\n" + '</p>';
                openParag = false;
            } else {
                flag = true;
            }
        } else {
            if (elem != line[0]) {
                str = str + "\n" + elem;
            } else {
                str = str + elem;
            }
        }
    }); 
    return str;
}