# fsm
Library for managing execution of tree of finite state machines.

# Overview

The `Fsm` class serves as the base class for chainable finite state machines.

Each machine begins in the FSM_STARTING state. The `tick` function on the class gets scheduled to be called whenever
the state changes (through the class function `setState`).

A subclass overrides the `tick` function to run the machine through its state transitions.

Additionally, a finite state machine can `waitOn` another state machine. When that machine is marked complete (either `FSM_DONE` or
`FSM_ERROR`), any machines waiting on that state machine get scheduled to have their `tick` function called.

A machine is "ready" when all `Fsm`'s it is waiting on have been marked complete.

The `tick` function of a dependent state machine is called whenever any machine it is waiting on completes,
but normally the `tick` function only performs activity when the machine is "ready".

Most usage involves the `tick` function first testing if it is `ready` before doing any activity,
although a usage that wanted to take action whenever any waitedOn dependent completes might omit that test
(e.g. to use whichever result completes first or immediately complete if any one of several dependents fail).

For example, this is typical usage:

```javascript
tick(): void
{
  if (this.ready)
  {
    // all dependents are complete, take action now
  }
}
```

Of course, a state machine might go from `ready` to not `ready` as many times as necessary simply by waiting on
some new `Fsm`.

Normally a Fsm-based class does not fire off any activity until the first time its `tick` function is called (rather than
in the constructor).

So,

```javascript
constructor(env: Environment)
{
  super(env);
  // Don't do any real work here.
}

tick(): void
{
  if (this.ready)
  {
    switch (this.state)
    {
      case FSM_STARTING:
        // Kick off activity here
        break;
    }
  }
}
```

That is not a requirement but increases flexibility by allowing clients to construct the Fsm and
then add dependents it must wait on before any activity is kicked off.

The infrastructure only cares about the completion states `FSM_ERROR` and `FSM_DONE`. Any other state values can
be used internally to a state machine to manage walking through different active states prior to completion.
For convenenience, the names `FSM_CUSTOM1` through `FSM_CUSTOM9` are predefined and internal states can use these
values (typically renamed to something semantically meaningful) however they wish.

The state `FSM_PENDING` has no special meaning but is defined for convenience since many state machines go through
a single intermediate state (`FSM_STARTING` to `FSM_PENDING` to `FSM_DONE`).

Callbacks can be integrated easily by having the callback set the `Fsm` state, which allows either completion
notification to any other waiting state machines or the next step in the current state machine to be executed.

```javascript
tick(): void
{
  if (this.ready)
  {
    switch (this.state)
    {
      case FSM_STARTING:
        asyncAPIWithCallback((err: any, result: any) => {
            if (err)
              this.setState(FSM_ERROR);
            else
              this.setState(FSM_DONE);
          });
        break;
    }
  }
}
```

or

```javascript
tick(): void
{
  if (this.ready)
  {
    switch (this.state)
    {
      case FSM_STARTING:
        asyncAPIWithCallback((err: any, result: any) => {
            if (err)
              this.setState(FSM_ERROR);
            else
              this.setState(FSM_PENDING);
          });
        break;

      case FSM_PENDING:
        // Do more stuff here now that callback has completed.
        break;
    }
  }
}
```


### isDependentError

When an `Fsm` that is being waited on completes with an error, any waiting `Fsm`'s get the `isDependentError` flag set
and of course get a chance to run their `tick` function (since the dependent `Fsm` has completed).

They can decide if the semantics of the relationship then requires them to propagate, consume or otherwise handle the
error. No other error propagation happens automatically.
So:

```javascript
tick(): void
{
  if (this.isDependentError)
    this.setState(FSM_ERROR);
  else if (this.ready)
  {
    // Normal code here
  }
}
```

### Reuse

An `Fsm` can be reused and transition from done to not done, although care must be taken that any dependent state
machines get a chance to run and notice the `done` state (asynchronously) before it transitions back.

### FsmOnDone

A simple utility class `FsmOnDone` provides a way of integrating a callback with an Fsm-based infrastructor.

So, in example below we are constructing a new `Fsm` that is waiting on some other `Fsm` and when that completes
will launch the callback with the provided fsm as an argument.


```javascript
let fsm = new FsmOnDone(env, fsmWait, (fsmWait: Fsm) => {
    /* do stuff with fsmWait since it is now complete */
  });
```

### FsmSleep

A simple utility class that creates a dependency that is marked done after the number of milliseconds passed to the constructor.

```javascript
this.waitOn(new FsmSleep(env, 1000));
```

## Comparison with Promises
