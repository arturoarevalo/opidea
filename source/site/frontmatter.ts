import * as Moment from 'moment';

export class Frontmatter {
    private readonly metadata: Map<string, any>;

    static from(lines: string[]): Frontmatter;
    static from(metadata: Map<string, any>): Frontmatter;
    static from(anything: any): Frontmatter;
    static from(anything: string[] | Map<string, any> | any): Frontmatter {
        const map = new Map<string, any>();

        if (anything instanceof Map) {
            for (const [key, value] of anything as Map<string, any>) {
                map.set(key, value);
            }
        } else if (Array.isArray(anything)) {
            for (const line of anything as string[]) {
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

        } else {
            for (const key of Object.getOwnPropertyNames(anything)) {
                map.set(key, anything[key]);
            }
        }

        return new Frontmatter(map);
    }

    static get empty(): Frontmatter {
        return new Frontmatter();
    }

    protected constructor(metadata?: Map<string, any>) {
        this.metadata = metadata || new Map<string, any>();
    }

    clone(): Frontmatter {
        return Frontmatter.from(this.metadata);
    }

    get<T = any>(key: string, defaultValue?: T): T {
        return this.metadata.get(key) || defaultValue;
    }

    set<T = any>(key: string, value: T): this {
        this.metadata.set(key, value);
        return this;
    }

    has(key: string): boolean {
        return this.metadata.has(key);
    }

    get type(): string {
        return this.get<string>('type');
    }

    set type(value: string) {
        this.set('type', value);
    }

    get format(): string {
        return this.get<string>('format');
    }

    set format(value: string) {
        this.set('format', value);
    }

    get title(): string {
        return this.get<string>('title');
    }

    set title(value: string) {
        this.set('title', value);
    }

    get layout(): string {
        return this.get<string>('layout');
    }

    set layout(value: string) {
        this.set('layout', value);
    }

    get role(): string {
        return this.get<string>('role');
    }

    set role(value: string) {
        this.set('role', value);
    }

    get permalink(): string {
        return this.get<string>('permalink');
    }

    set permalink(value: string) {
        this.set('permalink', value);
    }

    get excerpt(): string {
        return this.get<string>('excerpt');
    }

    set excerpt(value: string) {
        this.set('excerpt', value);
    }

    get date(): Moment.Moment {
        return this.get<Moment.Moment>('date');
    }

    set date(date: Moment.Moment) {
        this.set('date', date);
    }

    get categories(): string[] {
        return this.get<string[]>('categories', []);
    }

    set categories(value: string[]) {
        this.set('categories', value);
    }

    get tags(): string[] {
        return this.get<string[]>('tags', []);
    }

    set tags(value: string[]) {
        this.set('tags', value);
    }

    extend(frontmatter: Frontmatter): this {
        for (const [key, value] of frontmatter.metadata) {
            if (this.metadata.has(key)) {
                if (key === 'categories' || key === 'tags') {
                    for (const item of value as string[]) {
                        this.get<string[]>(key).push(item);
                    }
                } else {
                    this.metadata.set(key, value);
                }
            } else {
                this.metadata.set(key, value);
            }
        }

        return this;
    }

    dump(): string {
        let str = '';
        let sep = '';

        for (const [key, value] of this.metadata) {
            if (Array.isArray(value)) {
                str += sep + key + ' => [' + value.join(', ') + ']';
            } else if (value instanceof Moment) {
                str += sep + key + ' => ' + (value as Moment.Moment).format();
            } else {
                str += sep + key + ' => ' + value;
            }

            sep = ', ';
        }

        return '(' + str + ')';
    }
}
