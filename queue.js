'use strict';

class QueueIterator {
    /**
     *
     * @param {Queue} queue
     */

    constructor(queue,) {
        this._queue = queue;
        this._current = 0;
    }

    next() {
        return {
            value: this._queue._queue[this._current],
            done: this._current++ === this._queue.size,
        }
    }
}


/**
 * FIFO
 */
class Queue {
    constructor() {
        this._queue = {};
        this._size = 0;
    }

    enqueue(...elements) {
        for (const element of elements) {
            this._queue[this._size++] = element;
        }
        return this._size;
    }

    dequeue() {
        const dequeueElement = this._queue[0];

        for (let i = 0; i < this._size; i++) {
            this._queue[i] = this._queue[i + 1];
        }

        delete (this._queue[--this._size]);

        return dequeueElement;
    }

    front() {
        return this._queue[0];
    }

    get isEmpty() {
        return this._size === 0;
    }

    get size() {
        return this._size;
    }

    [Symbol.iterator]() {

        return new QueueIterator(this);
    }
}

const queue = new Queue();

console.log('queue.enqueue(\'one\', 2, {}, Symbol, \'five\', true, undefined, null, 9n)');
console.log(queue.enqueue('one', 2, {}, Symbol, 'five', true, undefined, null, 9n));
console.log('');

queue.dequeue();
console.log('queue.dequeue()');
console.table(queue);
console.log('');

console.log(`queue.front() = ${queue.front()}`)
console.log('');

console.log(`queue.isEmpty = ${queue.isEmpty}`)
console.log('');

console.log(`queue.size = ${queue.size}`)
console.log('');
console.log('');


class PriorityQueue extends Queue {
    constructor() {
        super();
    }

    enqueue(value, priority) {
        if (priority === undefined && value?._queue[0]?.priority === undefined) {
            throw new ReferenceError(`Element doesn\'t matter "priority"`)
        }

        if (value instanceof PriorityQueue) {
            for (const priorityQueueElement of value) {
                this._queue[this._size++] = priorityQueueElement;
            }
        } else {
            this._queue[this._size++] = {value: value, priority: priority};
        }

        const arrayObjectEntries = Object.entries(this._queue).sort((a, b) => a[1].priority - b[1].priority);

        for (let i = 0; i < arrayObjectEntries.length; i++) {
            this._queue[i] = arrayObjectEntries[i][1];
        }

        return this._size;
    }
}


const priorityQueue1 = new PriorityQueue();
priorityQueue1.enqueue(undefined, 7);
priorityQueue1.enqueue(false, 2);
priorityQueue1.enqueue(null, 5);
console.log('priorityQueue1');
console.table(priorityQueue1._queue);
console.log('');


const priorityQueue = new PriorityQueue();

priorityQueue.enqueue('seven', 7);
priorityQueue.enqueue({name: 'eight'}, 8);
priorityQueue.enqueue(1, 1);
priorityQueue.enqueue(12n, 12);
priorityQueue.enqueue(priorityQueue1);
priorityQueue.enqueue(3, 3);


console.log('priorityQueue.enqueue((\'seven\', 7), ({name: \'eight\'}, 8), (1, 1), (12n, 12), (priorityQueue1), (3, 3)) =>');
console.table(priorityQueue._queue);
console.log('');

console.log('priorityQueue.dequeue() =>');
priorityQueue.dequeue();
console.table(priorityQueue._queue);
console.log('');

console.log('priorityQueue.enqueue(Symbol,6)');
priorityQueue.enqueue(Symbol, 6);
console.table(priorityQueue._queue);
console.log('');

for (const priorityQueueElement of priorityQueue) {
    console.log(priorityQueueElement)
}