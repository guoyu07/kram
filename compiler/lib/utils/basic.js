/**
 * @file basic.js 基础实用小工具
 * @author  tanglei (tanglei02@baidu.com)
 */

// *
//  * 拼合两个 object，并返回第一个 object
//  *
//  * @param {Object} a 待拼合对象
//  * @param {Object} b 待拼合对象
//  * @param {Object|undefined} options 参数
//  * @param {string} options.type 拼合类型 overwrite/append，默认为 b 覆盖 a 已有的属性
//  * @param {Array} options.ignore 忽略 b 的某些属性名
//  * @return {Object} 拼合好的 a 对象

// export function merge(a, b, {type = 'overwrite', ignore = []} = {}) {

export function merge(...args) {
    let arr;
    let options;

    if (Array.isArray(args[0])) {
        arr = args[0];
        options = args[1];
    }
    else {
        arr = args.slice(0, 2);
        options = args[2];
    }

    let {
        type = 'overwrite',
        ignore = [],
        proxy = false
    } = options || {};

    let keys = arr.reduce((res, obj) => res.concat(Object.keys(obj)), []);
    keys = Array.from(new Set(keys));

    if (isValidArray(ignore)) {
        keys = keys.filter(key => !contain(ignore, key));
    }

    if (type === 'append') {
        keys = keys.filter(key => arr[0][key] == null);
    }

    let [a, ...res] = arr[0];
    res = res.filter(obj => obj != null);

    return keys.reduce((a, key) => {
            let item = last(res, (item) => item.key != null);
            if (item && item !== a) {
                if (proxy) {
                    Object.defineProperty(a, key, {
                        get() {
                            return item[key];
                        },
                        set(val) {
                            item[key] = a;
                        }
                    });
                }
                else {
                    a[key] = item[key];
                }
            }
            return a;
        },
        a
    );
    // if (Array.isArray(args[0]) && args.length < 3) {
    //     let opts = mergeOptions(args[1]);
    //     return args[0].slice(1).reduce((a, b) => merge(a, b, opts), args[0][0]);
    // }

    // let [a, b, opts] = args;

    // if (!b || typeof b !== 'object') {
    //     return a;
    // }

    // let {ignore, type} = mergeOptions(opts);
    // ignore = ensureArray(ignore);

    // let keys = Object.keys(b);

    // if (isValidArray(ignore)) {
    //     keys = keys.filter(key => !contain(ignore, key));
    // }

    // if (type === 'append') {
    //     keys = keys.filter(key => a[key] == null);
    // }

    // return keys.reduce((res, key) => set(res, key, b[key]), a);
}

// export function mergeAll(arr, options) {
//     let {type, ignore} = mergeOptions(options);
//     let keys = arr.reduce((res, obj) => res.concat(Object.keys(obj)), []);
//     keys = Array.from(new Set(keys));

//     if (isValidArray(ignore)) {
//         keys = keys.filter(key => !contain(ignore, key));
//     }

//     if (type === 'append') {
//         keys = keys.filter(key => arr[0][key] == null);
//     }

//     let [a, ...res] = arr[0];
//     res = res.filter(obj => obj != null);

//     return keys.reduce((a, key) => {
//             let item = last(res, (item) => item.key != null);
//             if (item) {
//                 a[key] = item[key];
//             }
//             return a;
//         },
//         a
//     );
// }

// function mergeOptions(options) {
//     let {
//         type = 'overwrite',
//         ignore = [],
//         proxy = false
//     } = options || {};

//     return {type, ignore};
// }

/**
 * 安全获取多级属性的方法，省的去写各种容错判断
 * 如：a.b.c.d => get(a, 'b', 'c', 'd')
 *     a[1].b.c => get(a, 1, 'b', c)
 *
 * @param {Object} obj 待获取属性的对象
 * @param {...string|number} arr 属性名
 * @return {*|null} 属性值，拿不到属性的返回 null
 */
export function get(obj, ...arr) {
    for (let i = 0, max = arr.length; i < max; i++) {
        if (!obj || typeof obj !== 'object') {
            return null;
        }

        obj = obj[arr[i]];
    }

    return obj;
}

/**
 * 给对象属性赋值并返回该对象
 *
 * @param {Object} obj 待赋值对象
 * @param {string|number} key 属性名
 * @param {*} val 待赋的值
 * @return {Object} 待赋值对象
 */
export function set(obj, key, val) {
    obj[key] = val;
    return obj;
}

/**
 * 判断是否为非空数组
 *
 * @param {*} arr 待判断对象
 * @return {boolean} 是否为非空数组
 */
export function isValidArray(arr) {
    return Array.isArray(arr) && !!(arr.length);
}

/**
 * 确保返回对象为一个数组
 *
 * @param {*} arr 待测对象
 * @return {Array} 数组
 */
export function ensureArray(arr) {
    return Array.isArray(arr)
        ? arr
        : arr === undefined
            ? []
            : [arr];
}

/**
 * 判断字符串前缀是否匹配
 *
 * @param {string} str 待判断字符串
 * @param {string} start 前缀
 * @return {boolean} 判断前缀是否匹配
 */
export function startWith(str, start) {
    return str.slice(0, start.length) === start;
}

/**
 * 获取原型名称
 *
 * @param {*} obj 待测对象
 * @return {string} 原型名称
 */
export function getPrototype(obj) {
    return Object.prototype.toString.call(obj).slice(8, -1);
}

/**
 * 判断是否为 object
 *
 * @param {*} obj 待测对象
 * @return {boolean} 是否为 object
 */
export function isObject(obj) {
    return getPrototype(obj) === 'Object';
}

export function isFunction(obj) {
    return typeof obj === 'function';
}

export function isEmptyObject(obj) {
    return Object.keys(obj).length === 0;
}

/**
 * 判断是否包含某些值
 *
 * @param {Array|string} a 待判断对象
 * @param {*} b 待检测的值
 * @return {boolean} 是否包含
 */
export function contain(a, b) {
    return a.indexOf(b) > -1;
}

/**
 * 空方法
 */
export function noop() {}


/**
 * 数组分块
 *
 * @param {Array} arr 待分块数组
 * @param {number} size 分块大小
 * @return {Array} 分块后的数组
 */
export function chunk(arr, size) {
    let output = [];
    for (let i = 0, max = arr.length; i < max; i += size) {
        output.push(arr.slice(i, i + size));
    }

    return output;
}

export function toArray(obj) {
    return Object.keys(obj).map(key => obj[key]);
}

export function each(list, fn) {
    if (Array.isArray(list)) {
        list.forEach((item, i) => fn(item, i));
    }
    else {
        Object.keys(list).forEach(name => fn(name, list[name]));
    }
}

export function classify(list, fn) {
    return list.reduce((res, info) => {
        let type = fn(info);
        res[type] = res[type] || [];
        res[type].push(info);
        return res;
    }, {});
}

export function first(list, fn) {
    for (let i = 0; i < list.length; i++) {
        if (fn(list[i], i, list)) {
            return list[i];
        }
    }
}

export function last(list, fn) {
    for (let i = list.length - 1; i > -1; i--) {
        if (fn(list[i], i, list)) {
            return list[i];
        }
    }
}