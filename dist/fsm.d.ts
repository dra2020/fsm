import * as Util from '@dra2020/util';
export declare const FSM_STARTING: number;
export declare const FSM_PENDING: number;
export declare const FSM_DONE: number;
export declare const FSM_ERROR: number;
export declare const FSM_RELEASED: number;
export declare const FSM_CUSTOM1: number;
export declare const FSM_CUSTOM2: number;
export declare const FSM_CUSTOM3: number;
export declare const FSM_CUSTOM4: number;
export declare const FSM_CUSTOM5: number;
export declare const FSM_CUSTOM6: number;
export declare const FSM_CUSTOM7: number;
export declare const FSM_CUSTOM8: number;
export declare const FSM_CUSTOM9: number;
export declare type FsmIndex = {
    [key: number]: Fsm;
};
export declare class FsmManager {
    theId: number;
    theEpoch: number;
    bTickSet: boolean;
    theTickList: FsmIndex;
    theBusyLoopCount: number;
    constructor();
    forceTick(fsm: Fsm): void;
    doTick(): void;
}
export interface FsmEnvironment {
    fsmManager: FsmManager;
}
export declare class Fsm {
    id: number;
    state: number;
    dependentError: boolean;
    epochDone: number;
    _env: FsmEnvironment;
    _waitOn: FsmIndex;
    _waitedOn: FsmIndex;
    constructor(env: FsmEnvironment);
    get env(): FsmEnvironment;
    get manager(): FsmManager;
    get done(): boolean;
    get ready(): boolean;
    get iserror(): boolean;
    get isDependentError(): boolean;
    setDependentError(): void;
    clearDependentError(): void;
    get ticked(): boolean;
    get nWaitOn(): number;
    get nWaitedOn(): number;
    waitOn(fsm: Fsm | Fsm[]): Fsm;
    setState(state: number): void;
    end(state?: number): void;
    preTick(): void;
    tick(): void;
}
export declare class FsmOnDone extends Fsm {
    cb: any;
    fsm: Fsm | Fsm[];
    constructor(env: FsmEnvironment, fsm: Fsm | Fsm[], cb: any);
    tick(): void;
}
export declare class FsmSleep extends Fsm {
    delay: number;
    constructor(env: FsmEnvironment, delay: number);
    tick(): void;
}
export declare type SerializerIndex = {
    [key: string]: Fsm;
};
export declare class FsmSerializer extends Fsm {
    index: SerializerIndex;
    constructor(env: FsmEnvironment);
    serialize(id: string, fsm?: Fsm): Fsm;
    tick(): void;
}
declare type FsmArrayMap = {
    [key: string]: Fsm[];
};
export declare class FsmTracker {
    env: FsmEnvironment;
    map: FsmArrayMap;
    constructor(env: FsmEnvironment);
    _track(uid: string, fsm: Fsm): void;
    _untrack(uid: string, fsm: Fsm): void;
    track(uid: string, fsm: Fsm): Fsm;
    maybeWait(uid: string, fsm: Fsm): void;
}
export interface LoopOptions {
    minRepeatInterval?: number;
    exitOnError?: boolean;
}
export declare const DefaultLoopOptions: {
    minRepeatInterval: number;
    exitOnError: boolean;
};
export declare class FsmLoop extends Fsm {
    fsm: Fsm;
    options: LoopOptions;
    elapsed: Util.Elapsed;
    constructor(env: FsmEnvironment, fsm: Fsm, options?: LoopOptions);
    tick(): void;
}
export interface ISet {
    test: (o: any) => boolean;
    reset: () => void;
}
export declare class FsmArray extends Fsm {
    a: any[];
    iset: ISet;
    constructor(env: FsmEnvironment, iset?: ISet);
    push(o: any): void;
    concat(a: any[]): void;
    splice(i?: number, n?: number): void;
    reset(): void;
}
export {};
