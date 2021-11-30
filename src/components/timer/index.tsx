import { useState, useEffect, useRef } from "react"
import Countdown from 'react-countdown'
import { useInterval } from "@/hooks/utils"


type GenericFunction = (params?: any) => any
interface IHandlerSet {
    [key: string]: GenericFunction
}

export const CountdownTimerDisplay = ({ epoch, type, size = "normal", title, handlers = {} }: 
    { epoch: number, type: string, title?: string, size?: string, handlers?: IHandlerSet }
) => {

    const {
        handleTimePassed = () => {},
        handleTick = () => {}
    } = handlers;

  const [ isCounting, setIsCounting ] = useState(true)
  const [ isPreparing, setIsPreparing ] = useState(true)
  const [ currentTime, setCurrentTime ] = useState(0)
  const [ now, justUpdate ] = useState(new Date().getTime())
  console.log("epoch", epoch * 1000, "currentTime", currentTime)

  const [ timerIntervalTime, setTimerIntervalTime ] = useState(1000)
  const timerIntervalTimeRef = useRef(timerIntervalTime)
  
  const timerInterval = useRef("timer-interval")

  useEffect(() => {
      if (epoch > 0) {
          setIsPreparing(false)
          setCurrentTime(epoch * 1000)
      }

      // checker.log((epoch * 1000), now)
      if ((epoch * 1000) > now) {
          setIsCounting(true)
      } else {
          setIsCounting(false)
      }

  }, [epoch])

  
  useInterval(timerInterval, () => {
      // if (isCounting) {
      justUpdate(new Date().getTime())
      handleTick()
      // checker.log("Tick",  isCounting, currentTime, new Date().getTime())
      // }
  }, timerIntervalTimeRef.current)

    interface IHandleCompleteParams {
        completed: boolean,
        days: number,
        hours: number,
        milliseconds: number,
        minutes: number,
        seconds: number,
        total: number
    }

    const handleOnComplete = (params: IHandleCompleteParams) => {
        handleTimePassed(params)
    }

  const rendererCountdown = (counter: any) => {
      return (<>
      {
          isPreparing
              ? (<>
                  <div>Getting Time</div>
              </>)
              : size === "mini"
              ? (<CountDownTimerMini { ...{ ...counter, type, isCounting, title }} />)
              : (<CountDownTimer { ...{ ...counter, type, isCounting, epoch }} />)
      }
      </>)
  }

  return (
      <Countdown
          date={new Date(currentTime)}
          renderer={rendererCountdown}
          onComplete={handleOnComplete}
      />
  )
}

function CountDownTimer({ days, hours, minutes, seconds, /* completed */type, isCounting, epoch }: any) {
    return (<div id="countdown-timer" className="countdown-timer">
        {
            isCounting ? (<>
                <div className="_title">
                    {
                        type === "starting" && (<>
                            <span>Starting in</span>
                        </>)
                    } 
                    {
                        type === "ending" && (<>
                            <span>Ending at {(new Date(epoch * 1000)).toDateString()}</span>
                        </>)
                    } 
                </div>
                <div className="countdown-timer-content">
                    <div className="countdown-timer-column">
                        <div className="value">in</div>
                    </div>
                    <div className="countdown-timer-column">
                        <div className="value">{days}</div>
                        <div className="unit">Days</div>
                    </div>
                    <div className="countdown-timer-column">
                        <div className="value">{hours}</div>
                        <div className="unit">Hours</div>
                    </div>
                    <div className="countdown-timer-column">
                        <div className="value">{minutes}</div>
                        <div className="unit">Minutes</div>
                    </div>
                    <div className="countdown-timer-column">
                        <div className="value">{seconds}</div>
                        <div className="unit">Seconds</div>
                    </div>
                </div>
            </>) : (<>
            
            </>)
        }
    </div>)
}

function CountDownTimerMini({ days, hours, minutes, seconds, /* completed */type, isCounting, title }: any) {
    return (<div className="countdown-timer mini">
    {
        isCounting ? (<>
            <div className="_title">
                {
                    type === "starting" && (<>
                        <span>{ title || "Starting in" }</span>
                    </>)
                } 
                {
                    type === "ending" && (<>
                        <span>{ title || "Ending in" }</span>
                    </>)
                } 
            </div>
            <div className="_clock">
                {
                  days > 0
                  ? (<>
                      <div className="_column">
                          <div className="value">{days} Days</div>
                      </div>
                      <div className="_column">
                          <div className="value">{hours} Hours</div>
                      </div>
                  </>)
                  : (<>
                      <div className="_column">
                          <div className="value">{hours}h</div>
                          {/* <div className="unit">Hours</div> */}
                      </div>
                      <div className="_column">
                          <div className="value">{minutes}m</div>
                          {/* <div className="unit">Minutes</div> */}
                      </div>
                      <div className="_column">
                          <div className="value">{seconds}s</div>
                          {/* <div className="unit">Seconds</div> */}
                      </div>
                  </>)
                }
            </div>
        </>) : (<>
        
        </>)
    }
</div>)
}