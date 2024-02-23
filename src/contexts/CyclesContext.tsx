import { ReactNode, createContext, useState, useReducer, useEffect } from "react";
import { Cycle, cyclesReducer } from "../reducers/cycles/reducer";
import { ActionTypes, addNewCycleAction, interruptCurrentCycleAsFinishedAction } from "../reducers/cycles/actions";
import { differenceInSeconds } from "date-fns";

interface CreateCycleData {
  task: string
  minutesAmount: number
}

interface CycleContextType {
  cycles: Cycle[]
  activeCycle: Cycle | undefined;
  activeCycleId: string | null
  amountSecondsPassed: number
  interruptCurrentCycle: () => void;
  markCurrentCycleAsFinished: () => void;
  setSecondPassed: (seconds: number) => void
  createNewCycle: (data: CreateCycleData) => void;
}
export const CyclesContext = createContext({} as CycleContextType)

interface CyclesContextProviderProps {
  children: ReactNode
}

export function CyclesContextProvider({ children }: CyclesContextProviderProps) {

  const [cyclesState, dispatch] = useReducer(cyclesReducer, {
    cycles: [],
    activeCycleId: null,
  }, (initialState) => {
    const storageStateAsJSON = localStorage.getItem('@RocketSeat-Timer-Projeto-02-Alyson-proexweb.com:cycles-state-1.0.0');

    if (storageStateAsJSON) {
      return JSON.parse(storageStateAsJSON)
    }

    return initialState
  })

  const { cycles, activeCycleId } = cyclesState
  const activeCycle = cycles.find(cycle => cycle.id === activeCycleId)

  const [amountSecondsPassed, setAmountSecondsPassed] = useState(() => {
    if (activeCycle) {
      return differenceInSeconds(new Date(), new Date(activeCycle.startDate))
    }

    return 0
  })


  useEffect(() => {
    const stateJSON = JSON.stringify(cyclesState)

    localStorage.setItem('@RocketSeat-Timer-Projeto-02-Alyson-proexweb.com:cycles-state-1.0.0', stateJSON)
  }, [cyclesState])


  function setSecondPassed(seconds: number) {
    setAmountSecondsPassed(seconds)
  }

  function createNewCycle(data: CreateCycleData) {
    const uuid = self.crypto.randomUUID();

    const newCycle: Cycle = {
      id: uuid,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }

    dispatch(addNewCycleAction(newCycle))

    setAmountSecondsPassed(0)
  }

  function markCurrentCycleAsFinished() {
    dispatch(markCurrentCycleAsFinished())
  }


  function interruptCurrentCycle() {
    dispatch(interruptCurrentCycleAsFinishedAction())
  }

  return (
    <CyclesContext.Provider value={{
      cycles,
      activeCycle,
      activeCycleId,
      markCurrentCycleAsFinished,
      amountSecondsPassed,
      setSecondPassed,
      createNewCycle,
      interruptCurrentCycle
    }}>
      {children}
    </CyclesContext.Provider>
  )
}