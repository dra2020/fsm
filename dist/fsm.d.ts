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
    readonly env: FsmEnvironment;
    readonly manager: FsmManager;
    readonly done: boolean;
    readonly ready: boolean;
    readonly iserror: boolean;
    readonly isDependentError: boolean;
    setDependentError(): void;
    clearDependentError(): void;
    readonly ticked: boolean;
    waitOn(fsm: Fsm | Fsm[]): Fsm;
    setState(state: number): void;
    end(): void;
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
export {};
