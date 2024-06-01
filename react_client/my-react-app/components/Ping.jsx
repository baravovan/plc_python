import { useEffect } from 'react'
import axios from 'axios';
import Global from '../src/Global';

export default function Ping(props) {

    useEffect(() => {
        const ping = () => {
            pingPLC()
        }
        ping()
        const interval = setInterval(() => {
            ping()
        }, 10*1000);
        return () => clearInterval(interval);
      },[])
    
    function pingPLC() {
        axios.get(Global.baseUrl + "/v1/ping")
        .then(() => {
            props.stateChangerToConnect();
        })
        .catch(() => {
            props.stateChangerToDisconnect();
        });
    }
}