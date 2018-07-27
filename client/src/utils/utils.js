import moment from 'moment'; 

export function urlWithParams(urlString, params={}) {
  var url = new URL(urlString);
  var searchParams = new URLSearchParams();
  Object.keys(params).forEach((key) => {
    searchParams.append(key, params[key]);
  });
  url.search = searchParams.toString();
  return url.toString();
}

export function flattenObj(x, path) {
    var result = [];
    
    path = path || [];
    Object.keys(x).forEach(function (key) {
        if (!x.hasOwnProperty(key)) return;

        var newPath = path.slice();
        newPath.push(key);

        var vals = [];
        if (typeof x[key] == 'object' && x[key] != null) {
            vals = flattenObj(x[key], newPath);
        } else {
            vals.push({ path: newPath, val: x[key] });
        }
        vals.forEach(function (obj) {
            return result.push(obj);
        });
    });

    return result;
}

export function toQueryString(obj, urlEncode) {
    var parts = flattenObj(obj);

    parts = parts.map(function (varInfo) {
        if (varInfo.path.length == 1) varInfo.path = varInfo.path[0];else {
            var first = varInfo.path[0];
            var rest = varInfo.path.slice(1);
            varInfo.path = first + '[' + rest.join('][') + ']';
        }
        return varInfo;
    });

    var queryString = parts.map(function (varInfo) {
        return varInfo.path + '=' + varInfo.val;
    }).join('&');

    if (urlEncode) return encodeURIComponent(queryString);else return queryString;
}

/**
 * Handle form input changes to store data in state.
 * 
 * @param {object} event 
 * @memberof RequestModal
 */
export function handleInputChange(event) {
    const target = event.target;
    const name = target.name;
    const options = event.target.options;
    
    let value = target.type === 'checkbox' ? !target.checked : target.value;
    let files = {};
    
    // file detection
    if (event.target.files) {
        files = event.target.files;

        if(target.attributes['multiple'] != undefined) {
            value = [];
            for (var i = 0, l = event.target.files.length; i < l; i++) {
                value.push(event.target.files[i]);
            }
        } else {
            value = event.target.files[0];
        }
    }

    // detect multiple inputs
    if(options && target.attributes['multiple'] != undefined) {
        value = [];
        for (var i = 0, l = options.length; i < l; i++) {
            if (options[i].selected) {
                value.push(options[i].value);
            }
        }
    }

    // convert input array string to object
    if(name.indexOf('[') !== -1) {
        const dottedName = name.replace(/\]\[/g, ".").replace(/\]/g, "").replace(/\[/g, ".");
        
        return dotNotationToObject(dottedName, value);
    }

    return {[name]: value};
}

/**
 * Convert dot notaion to object value.
 * 
 * @param {string} str 
 * @param {any} val 
 * @returns 
 */
export function dotNotationToObject(str, val) {
    let i, obj = {}, strarr = str.split(".");
    let x = obj;

    for(i = 0; i < strarr.length-1; i++) {
        if(strarr[i] % 1 === 0) {
            x = x[strarr[i]] = {};
        } else {
            x = x[strarr[i]] = [];
        }
    }

    x[strarr[i]] = val;

    return obj;
}

export function isObject (value) {
    return value === Object(value)
}

export function isArray (value) {
    return Array.isArray(value)
}

export function isFile (value) {
    return value instanceof File
}

export function makeArrayKey (key) {
    if (key.length > 2 && key.lastIndexOf('[]') === key.length - 2) {
        return key
    } else {
        return key + '[]'
    }
}

export function objectToFormData(obj, form, namespace) {
    let fd = form || new FormData();
    let formKey;

    for(let property in obj) {
        if(obj.hasOwnProperty(property) && obj[property]) {
            if (namespace) {
                formKey = namespace + '[' + property + ']';
            } else {
                formKey = property;
            }

            // if the property is an object, but not a File, use recursivity.
            if (obj[property] instanceof Date) {
                fd.append(formKey, obj[property].toISOString());
            }
            else if (typeof obj[property] === 'object' && !(obj[property] instanceof File)) {
                objectToFormData(obj[property], fd, formKey);
            } else { // if it's a string or a File object
                fd.append(formKey, obj[property]);
            }
        }
    }

    return fd;
}

/**
 * @param num int 
 * @param size nuber needed lenght 
 * @return formated string 
 */
export function numberPad(num, size) {
    let s = num + "";
    while (s.length < size) {
      s = "0" + s;
    }
    return s;
}

/*
 * Convert bytes to size string.
 * 
 * @export
 * @param {int} bytes 
 * @returns string
 */
export function bytesToSize(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

    if (bytes == 0) {
         return '0 Byte';
    }

    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));

    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
};

/**
 * Image placeholder.
 * 
 * @export
 * @param {int} width 
 * @param {int} height 
 * @param {string} text 
 * @returns string
 */
export function imagePlaceholder(width = 100, height = 100, text = '') {
    let placeholderText = text ? '?text=' + text : '';

    return `http://via.placeholder.com/${width}x${height}${placeholderText}`;
};

/**
 * to Moment
 * 
 * @export
 * @param {mixed} date 
 * @returns moment(date) || null
 */
export function toMoment(date) {
    if (!date)
        return null;

    if (typeof date === 'string')    {
        return moment(date);
    }

    return date;
};

/**
 * @param {x} float 
 * @return formated string 
 */
export function numberWithCommas(num) {
  if (!num)
      return 0;
    
  var parts = num.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

/**
 * Number to human format
 * @param {x} float 
 * @return formated string 
 */
export function numberTHF(num, digits) {
  if (!num)
    return 0;
  
  var si = [
    { value: 1E18, symbol: "E" },
    { value: 1E15, symbol: "P" },
    { value: 1E12, symbol: "T" },
    { value: 1E9,  symbol: "G" },
    { value: 1E6,  symbol: "M" },
    { value: 1E3,  symbol: "K" }
  ], rx = /\.0+$|(\.[0-9]*[1-9])0+$/, i;
  for (i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
    }
  }
  return num.toFixed(digits).replace(rx, "$1");
}

/**
 * Get text width base on size and font.
 * 
 * @export
 * @param {string} text 
 * @param {string} font 
 * @returns 
 */
export function getTextWidth(text, font) {
    let canvas = document.createElement("canvas");
    let context = canvas.getContext("2d");
    context.font = font;
    let metrics = context.measureText(text);

    return metrics.width;
}

/**
 * Cunk text.
 * 
 * @export
 * @param {string} str 
 * @param {string} len 
 * @returns 
 */
export function chunkString(str, len) {
    let size = Math.ceil(str.length/len),
        ret  = new Array(size),
        offset;

    for (let i = 0; i < size; i++) {
        offset = i * len;
        ret[i] = str.substring(offset, offset + len);
    }

    return ret;
}

/**
 * Concat mapped objects.
 * 
 * @export
 * @param {any} map 
 * @param {any} iterables 
 */
export function concatMaps(...iterables) {
    let map = new Map();
    for (const iterable of iterables) {
        for (const item of iterable) {
            map.set(...item);
        }
    }

    return map;
}