import React,
{ 
    Fragment, 
    useEffect, 
    useRef
} from 'react';

import delay from '../util/delay';
import './MessageAlert.css';

const MessageAlert = ({ messageProps, setMessageProps }) => {
    const badMailMessageAlert = useRef(null);
    const successMessageAlert = useRef(null);
    const { message, displayMessage, isSuccess } = messageProps;

    const handleMessageAlert = async (message) => {
        message.classList.remove("hide");
        message.classList.add("show");
        message.classList.add("anim_finished");
        await delay(3000);
        message.classList.add("hide");
        message.classList.remove("show");
        await delay(1500);
        setMessageProps({...messageProps, displayMessage: false});
    }

    useEffect(() => {
        if (displayMessage) {
            if (isSuccess){
                handleMessageAlert(successMessageAlert.current);
            } else {
                handleMessageAlert(badMailMessageAlert.current);
            }
        }

    }, [displayMessage])

    return (
        <Fragment>
            <div ref={successMessageAlert} className="successMessage hide">
                <span className="successMessage__check">
                    <svg version="1.1" id="Capa_1" x="0px" y="0px" width="20px" height="20px" viewBox="0 0 45.701 45.7" style={{ enableBackground: 'new 0 0 45.701 45.7' }} xmlSpace="preserve">
                        <g>
                            <g>
                                <path d="M20.687,38.332c-2.072,2.072-5.434,2.072-7.505,0L1.554,26.704c-2.072-2.071-2.072-5.433,0-7.504
        c2.071-2.072,5.433-2.072,7.505,0l6.928,6.927c0.523,0.522,1.372,0.522,1.896,0L36.642,7.368c2.071-2.072,5.433-2.072,7.505,0
        c0.995,0.995,1.554,2.345,1.554,3.752c0,1.407-0.559,2.757-1.554,3.752L20.687,38.332z" />
                            </g>
                        </g>
                    </svg>
                </span>
                <span className="successMessage__msg">{message}</span>
            </div>
            <div ref={badMailMessageAlert} className="errorMessage hide">
                <span className="errorMessage__check">
                    <svg version="1.1" id="Layer_1" x="0px" y="0px" width="20px" height="20px" viewBox="0 0 492 492" style={{ enableBackground: 'new 0 0 492 492' }} xmlSpace="preserve">
                        <g>
                            <g>
                                <path d="M300.188,246L484.14,62.04c5.06-5.064,7.852-11.82,7.86-19.024c0-7.208-2.792-13.972-7.86-19.028L468.02,7.872
			c-5.068-5.076-11.824-7.856-19.036-7.856c-7.2,0-13.956,2.78-19.024,7.856L246.008,191.82L62.048,7.872
			c-5.06-5.076-11.82-7.856-19.028-7.856c-7.2,0-13.96,2.78-19.02,7.856L7.872,23.988c-10.496,10.496-10.496,27.568,0,38.052
			L191.828,246L7.872,429.952c-5.064,5.072-7.852,11.828-7.852,19.032c0,7.204,2.788,13.96,7.852,19.028l16.124,16.116
			c5.06,5.072,11.824,7.856,19.02,7.856c7.208,0,13.968-2.784,19.028-7.856l183.96-183.952l183.952,183.952
			c5.068,5.072,11.824,7.856,19.024,7.856h0.008c7.204,0,13.96-2.784,19.028-7.856l16.12-16.116
			c5.06-5.064,7.852-11.824,7.852-19.028c0-7.204-2.792-13.96-7.852-19.028L300.188,246z" />
                            </g>
                        </g>
                    </svg>
                </span>
                <span className="errorMessage__msg">{message}</span>
            </div>
        </Fragment>
    )
}

export default MessageAlert;