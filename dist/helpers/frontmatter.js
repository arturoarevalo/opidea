"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Moment = require("moment");
class Frontmatter {
    static from(anything) {
        const map = new Map();
        if (anything instanceof Map) {
            for (const [key, value] of anything) {
                map.set(key, value);
            }
        }
        else if (Array.isArray(anything)) {
            for (const line of anything) {
                const parts = line.split(':', 2);
                const key = parts[0].trim();
                if (parts.length > 0) {
                    const value = parts[1].trim();
                    switch (key) {
                        case 'date': {
                            map.set('date', Moment(value, ['YYYY-MM-DD', 'YYYY-MM-DD HH:mm']));
                            break;
                        }
                        case 'categories': {
                            map.set('categories', value.split(',').map(v => v.trim()));
                            break;
                        }
                        case 'tags': {
                            map.set('tags', value.split(',').map(v => v.trim()));
                            break;
                        }
                        default: {
                            map.set(key, value);
                        }
                    }
                }
            }
        }
        else {
            for (const key of Object.getOwnPropertyNames(anything)) {
                map.set(key, anything[key]);
            }
        }
        return new Frontmatter(map);
    }
    static get empty() {
        return new Frontmatter();
    }
    constructor(metadata) {
        this.metadata = metadata || new Map();
    }
    clone() {
        return Frontmatter.from(this.metadata);
    }
    get(key, defaultValue) {
        return this.metadata.get(key) || defaultValue;
    }
    set(key, value) {
        this.metadata.set(key, value);
        return this;
    }
    has(key) {
        return this.metadata.has(key);
    }
    get type() {
        return this.get('type');
    }
    set type(value) {
        this.set('type', value);
    }
    get format() {
        return this.get('format');
    }
    set format(value) {
        this.set('format', value);
    }
    get title() {
        return this.get('title');
    }
    set title(value) {
        this.set('title', value);
    }
    get layout() {
        return this.get('layout');
    }
    set layout(value) {
        this.set('layout', value);
    }
    get role() {
        return this.get('role');
    }
    set role(value) {
        this.set('role', value);
    }
    get permalink() {
        return this.get('permalink');
    }
    set permalink(value) {
        this.set('permalink', value);
    }
    get excerpt() {
        return this.get('excerpt');
    }
    set excerpt(value) {
        this.set('excerpt', value);
    }
    get date() {
        return this.get('date');
    }
    set date(date) {
        this.set('date', date);
    }
    get categories() {
        return this.get('categories', []);
    }
    set categories(value) {
        this.set('categories', value);
    }
    get tags() {
        return this.get('tags', []);
    }
    set tags(value) {
        this.set('tags', value);
    }
    extend(frontmatter) {
        for (const [key, value] of frontmatter.metadata) {
            if (this.metadata.has(key)) {
                if (key === 'categories' || key === 'tags') {
                    for (const item of value) {
                        this.get(key).push(item);
                    }
                }
                else {
                    this.metadata.set(key, value);
                }
            }
            else {
                this.metadata.set(key, value);
            }
        }
        return this;
    }
    dump() {
        let str = '';
        let sep = '';
        for (const [key, value] of this.metadata) {
            if (Array.isArray(value)) {
                str += sep + key + ' => [' + value.join(', ') + ']';
            }
            else if (value instanceof Moment) {
                str += sep + key + ' => ' + value.format();
            }
            else {
                str += sep + key + ' => ' + value;
            }
            sep = ', ';
        }
        return '(' + str + ')';
    }
}
exports.Frontmatter = Frontmatter;
