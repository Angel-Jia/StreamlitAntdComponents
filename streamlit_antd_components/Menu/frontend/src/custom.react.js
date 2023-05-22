import React from "react";
import "bootstrap-icons/font/bootstrap-icons.css";

//deep copy object func
const deepCopy = (obj) => {
    return JSON.parse(JSON.stringify(obj))
}
//recurve str property to react node
const strToNode = (obj) => {
    if (Array.isArray(obj)) {
        return obj.map(obj_ => strToNode(obj_))
    } else {
        let obj_copy = deepCopy(obj);
        const icon = obj_copy.icon;
        const href = obj_copy.href;
        if (obj_copy.hasOwnProperty('children')) {
            obj_copy.children = obj_copy.children.map(obj_ => strToNode(obj_))
        }
        if (icon) {
            obj_copy.icon = <span><i className={`bi bi-${icon}`}/></span>
        }
        if (href) {
            obj_copy.label = <a href={href} target='_blank' rel='noreferrer'>{obj_copy.label}</a>
        }
        return obj_copy
    }
}

//all parent keys
const getParent = (k, obj) => {
    let allParentKeys = []
    //get one parent key
    const getParentKey = (key, tree) => {
        let parentKey;
        for (let i = 0; i < tree.length; i++) {
            const node = tree[i];
            if (node.children) {
                if (node.children.some((item) => item.key === key)) {
                    parentKey = node.key;
                } else if (getParentKey(key, node.children)) {
                    parentKey = getParentKey(key, node.children);
                }
            }
        }
        return parentKey;
    }
    const getParentKey_ = (k, obj) => {
        let key = getParentKey(k, obj)
        if (key) {
            allParentKeys.push(key)
            getParentKey_(key, obj)
        }
    }
    getParentKey_(k, obj)
    return allParentKeys
}

const menuHeight = (open_keys, items) => {

    const showItem_ = (open_keys, item) => {
        let h = 48
        const showItem = (open_keys, item) => {
            if (item.hasOwnProperty('key') && open_keys) {
                if (item.hasOwnProperty('children')) {
                    if (open_keys.includes(item['key']) || item.hasOwnProperty('type')) {
                        h += item['children'].length * 45
                        item['children'].map(item_ => showItem(open_keys, item_))
                    }
                }
            }
            if (item.hasOwnProperty('dashed')) {
                h = 2
            }
        }
        showItem(open_keys, item)
        return h
    }

    function sum(arr) {
        let s = 0;
        for (let i = arr.length - 1; i >= 0; i--) {
            s += arr[i];
        }
        return s;
    }

    let n_arr = items.map(item => showItem_(open_keys, item))
    return sum(n_arr)
}


const getHrefKeys = (items) => {
    let keys = []

    const getKey = (obj) => {
        if (Array.isArray(obj)) {
            obj.map(obj_ => getKey(obj_))
        } else {
            if (obj.hasOwnProperty('children')) {
                obj.children.map((obj_) => getKey(obj_))
            }
            if (obj.href != null) {
                keys.push(obj.key)
            }
        }
    }
    getKey(items)
    return keys
}

const getCollapseKeys = (items) => {
    let keys = []

    const getKey = (obj) => {
        if (Array.isArray(obj)) {
            obj.map(obj_ => getKey(obj_))
        } else {
            if (obj.hasOwnProperty('children')) {
                obj.children.map((obj_) => getKey(obj_))
                if (!obj.hasOwnProperty('type')){
                    keys.push(obj.key)
                }
            }
        }
    }
    getKey(items)
    return keys
}

const AlphaColor = (varColor = '--primary-color', alpha = 0.1) => {
    const getColorComponents = (color) => {
        // Handle hexadecimal color format
        const hexMatch = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
        if (hexMatch.test(color)) {
            let hex = color.substring(1);
            if (hex.length === 3) {
                hex = hex.split('').map((char) => char + char).join('');
            }
            const [r, g, b] = hex.match(/.{2}/g).map((c) => parseInt(c, 16));
            return [r, g, b];
        }

        // Handle RGB and RGBA color formats
        const rgbMatch = /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)$/;
        const match = color.match(rgbMatch);
        if (match) {
            const [_, r, g, b] = match.map(Number);
            return [r, g, b];
        }

        // Handle other color formats or invalid colors
        return null;
    };

    const color = getComputedStyle(document.documentElement).getPropertyValue(varColor).trim();
    const colorComponents = getColorComponents(color);

    if (colorComponents) {
        const [r, g, b] = colorComponents;
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    } else {
        // Handle invalid colors
        return 'defaultColor';
    }
};


export {strToNode, AlphaColor, getParent, getHrefKeys, getCollapseKeys, menuHeight}