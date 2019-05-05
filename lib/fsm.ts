// Shared libraries
import * as Util from '@terrencecrowley/util';

// States
export const FSM_STARTING: number = 0;
export const FSM_PENDING: number  = 1<<0;
export const FSM_DONE: number     = 1<<1;
export const FSM_ERROR: number    = 1<<2;
export const FSM_RELEASED: number = 1<<3;
export const FSM_CUSTOM1: number  = 1<<4;
export const FSM_CUSTOM2: number  = 1<<5;
export const FSM_CUSTOM3: number  = 1<<6;
export const FSM_CUSTOM4: number  = 1<<7;
export const FSM_CUSTOM5: number  = 1<<8;
export const FSM_CUSTOM6: number  = 1<<9;
export const FSM_CUSTOM7: number  = 1<<10;
export const FSM_CUSTOM8: number  = 1<<11;
export const FSM_CUSTOM9: number  = 1<<12;

function FsmDone(s: number): boolean
{
  return ((s & FSM_DONE) != 0) || ((s & FSM_ERROR) != 0) || ((s & FSM_RELEASED) != 0);
}

function FsmStateToString(state: number): string
{
  let a: string[] = [];

  if (state == FSM_STARTING)
    return 'starting';
  else
  {
    if (state & FSM_PENDING) a.push('pending');
    if (state & FSM_DONE) a.push('done');
    if (state & FSM_ERROR) a.push('error');
    if (state & FSM_RELEASED) a.push('released');
    if (state & FSM_CUSTOM1) a.push('custom1');
    if (state & FSM_CUSTOM2) a.push('custom2');
    if (state & FSM_CUSTOM3) a.push('custom3');
    if (state & FSM_CUSTOM4) a.push('custom4');
    if (state & FSM_CUSTOM5) a.push('custom5');
    if (state & FSM_CUSTOM6) a.push('custom6');
    if (state & FSM_CUSTOM7) a.push('custom7');
    if (state & FSM_CUSTOM8) a.push('custom8');
    if (state & FSM_CUSTOM9) a.push('custom9');
    return a.join('|');
  }
}

export type FsmIndex = { [key: number]: Fsm };

export class FsmManager
{
  theId: number;
  theEpoch: number;
  bTickSet: boolean;
  theTickList: FsmIndex;
  theBusyLoopCount: number;

  constructor()
  {
    this.theId = 0;
    this.theEpoch = 0;
    this.bTickSet = false;
    this.theTickList = {};
    this.theBusyLoopCount = 0;
    this.doTick = this.doTick.bind(this);
  }

  forceTick(fsm: Fsm): void
  {
    this.theTickList[fsm.id] = fsm;
    if (! this.bTickSet)
    {
      this.bTickSet = true;
      setImmediate(this.doTick);
    }
  }

  doTick(): void
    {
      this.bTickSet = false;
      let nLoops: number = 0;

      while (nLoops < 1 && !Util.isEmpty(this.theTickList))
      {
        nLoops++;
        let thisTickList = this.theTickList;
        this.theTickList = {};

        for (let id in thisTickList) if (thisTickList.hasOwnProperty(id))
        {
          let f = thisTickList[id];
          f.preTick();
          f.tick();
        }
      }

      if (Util.isEmpty(this.theTickList))
        this.theBusyLoopCount = 0;
      else
        this.theBusyLoopCount++;

      this.theEpoch++;
    }

}

export interface FsmEnvironment
{
  fsmManager: FsmManager;
}

export class Fsm
{
  id: number;
  state: number;
  epochDone: number;
  _env: FsmEnvironment;
  _waitOn: FsmIndex;
  _waitedOn: FsmIndex;

  constructor(env: FsmEnvironment)
    {
      this._env = env;
      this.id = this.manager.theId++;
      this.state = FSM_STARTING;
      this.epochDone = -1;
      this._waitOn = null;
      this._waitedOn = null;
      this.manager.forceTick(this);
    }

  get env(): FsmEnvironment { return this._env; }
  get manager(): FsmManager { return this.env.fsmManager; }

  get done(): boolean
    {
      return FsmDone(this.state);
    }

  get ready(): boolean
    {
      return !this.done && this._waitOn == null;
    }

  get iserror(): boolean
    {
      return (this.state & FSM_ERROR) != 0;
    }

  // Override
  get isChildError(): boolean
    {
      return false;
    }

  get ticked(): boolean
    {
      return this.done && this.manager.theEpoch > this.epochDone;
    }

  waitOn(fsm: Fsm | Fsm[]): Fsm
    {
      if (fsm == null)
        return this;
      else if (Array.isArray(fsm))
      {
        for (let i: number = 0; i < fsm.length; i++)
          this.waitOn(fsm[i]);
      }
      else
      {
        if (fsm.done)
        {
          // If dependency is already done, don't add to waitOn list but ensure that
          // this Fsm gets ticked during next epoch. This is because the dependent tick
          // only happens when the dependency state is changed.
          this.manager.forceTick(this);
        }
        else
        {
          if (this._waitOn == null) this._waitOn = {};
          this._waitOn[fsm.id] = fsm;
          if (fsm._waitedOn == null) fsm._waitedOn = {};
          fsm._waitedOn[this.id] = this;
        }
      }
      return this;
    }

  setState(state: number): void
    {
      this.state = state;
      if (this.done)
      {
        while (this._waitedOn)
        {
          let on = this._waitedOn;
          this._waitedOn = null;
          for (let id in on) if (on.hasOwnProperty(id))
            this.manager.forceTick(on[id]);
        }

        this.epochDone = this.manager.theEpoch;
      }
      this.manager.forceTick(this);
    }

  // Can override if need to do more here
  end(): void
    {
      this.setState(FSM_DONE);
    }

  // Cleans up _waitOn
  preTick(): void
    {
      if (this._waitOn == null) return;
      let bMore: boolean = false;
      for (let id in this._waitOn) if (this._waitOn.hasOwnProperty(id))
      {
        let fsm = this._waitOn[id];
        if (fsm.done)
          delete this._waitOn[id];
        else
          bMore = true;
      }
      if (!bMore) this._waitOn = null;
    }

  tick(): void
    {
    }
}

export class FsmOnDone extends Fsm
{
  cb: any;
  fsm: Fsm | Fsm[];

  constructor(env: FsmEnvironment, fsm: Fsm | Fsm[], cb: any)
    {
      super(env);
      this.waitOn(fsm);
      this.fsm = fsm;
      this.cb = cb;
    }

  get isChildError(): boolean
    {
      if (this.fsm)
      {
        if (Array.isArray(this.fsm))
        {
          for (let i: number = 0; i < this.fsm.length; i++)
            if (this.fsm[i].iserror)
              return true;
          return false;
        }
        else
          return this.fsm.iserror;
      }
      else
        return false;
    }

  tick(): void
    {
      if (this.ready && this.state == FSM_STARTING)
      {
        this.setState(this.isChildError ? FSM_ERROR : FSM_DONE);
        this.cb(this.fsm);
      }
    }
}


export type SerializerIndex = { [key: string]: Fsm };

export class FsmSerializer extends Fsm
{
  index: SerializerIndex;

  constructor(env: FsmEnvironment)
    {
      super(env);
      this.index = {};
    }

  serialize(id: string, fsm?: Fsm): Fsm
    {
      let prev = this.index[id];
      if (prev && !fsm) return prev;
      if (prev !== undefined)
        fsm.waitOn(prev);
      this.index[id] = fsm;
      if (this.done)
        this.setState(FSM_STARTING);
      this.waitOn(fsm);
      return prev;
    }

  tick(): void
    {
      // If fully quiescent, take advantage to clear the waiting cache.
      if (this.ready && this.state == FSM_STARTING)
      {
        this.index = {};
        this.setState(FSM_DONE);
      }
    }
}


// The FsmTracker class provides a mechanism for serializing a set of finite state
// machines identified by a consistent unique identifier. A finite state machine is
// "tracked" until completion. If any other finite state machine calls "maybeWait"
// while any other are tracked and pending, that FSM will wait for the others to
// complete.
//

class FsmTrackerWrap extends Fsm
{
  index: FsmTracker;
  uid: string;
  fsm: Fsm;

  constructor(env: FsmEnvironment, index: FsmTracker, uid: string, fsm: Fsm)
    {
      super(env);
      this.index = index;
      this.uid = uid;
      this.fsm = fsm;
      index._track(uid, fsm);
      this.waitOn(fsm);
    }

  tick(): void
    {
      if (this.ready && this.state == FSM_STARTING)
      {
        this.index._untrack(this.uid, this.fsm);
        this.setState(FSM_DONE);
      }
    }
}

type FsmArrayMap = { [key: string]: Fsm[] };

export class FsmTracker
{
  env: FsmEnvironment;
  map: FsmArrayMap;

  constructor(env: FsmEnvironment)
    {
      this.env = env;
      this.map = {};
    }

  _track(uid: string, fsm: Fsm): void
    {
      let a = this.map[uid];
      if (a === undefined)
      {
        a = [];
        this.map[uid] = a;
      }
      a.push(fsm);
    }

  _untrack(uid: string, fsm: Fsm): void
    {
      let a = this.map[uid];
      if (a)
      {
        for (let i: number = 0; i < a.length; i++)
          if (a[i] === fsm)
          {
            if (a.length == 1)
              delete this.map[uid];
            else
              a.splice(i, 1);
            break;
          }
      }
    }

  track(uid: string, fsm: Fsm): Fsm
    {
      return new FsmTrackerWrap(this.env, this, uid, fsm);
    }

  maybeWait(uid: string, fsm: Fsm): void
    {
      fsm.waitOn(this.map[uid]);
    }
}
