type IntersectionObserverCallback = (arg1: IntersectionObserverEntry[]) => void;

export type { IntersectionObserverCallback };

export class MockedObserver {
    cb: IntersectionObserverCallback;
    options: IntersectionObserverInit;
    elements: HTMLElement[];

    constructor(
        cb: IntersectionObserverCallback,
        options: IntersectionObserverInit
    ) {
        this.cb = cb;
        this.options = options;
        this.elements = [];
    }

    unobserve(elem: HTMLElement): void {
        this.elements = this.elements.filter((en) => en !== elem);
    }

    observe(elem: HTMLElement): void {
        this.elements = [...new Set(this.elements.concat(elem))];
    }

    disconnect(): void {
        this.elements = [];
    }

    fire(arr: IntersectionObserverEntry[]): void {
        this.cb(arr);
    }
}

export function traceMethodCalls(obj: object | Function, calls: any = {}) {
    const handler: ProxyHandler<object | Function> = {
        get(target, propKey, receiver) {
            const targetValue = Reflect.get(target, propKey, receiver);
            if (typeof targetValue === 'function') {
                return function (...args: any[]) {
                    calls[propKey] = (calls[propKey] || []).concat(args);
                    return targetValue.apply(this, args);
                };
            } else {
                return targetValue;
            }
        },
    };
    return new Proxy(obj, handler);
}
