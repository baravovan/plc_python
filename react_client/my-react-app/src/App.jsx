import {useState, useEffect} from 'react'
import axios from 'axios';
import Tags from '../components/Tags';
import Ping from '../components/Ping';
import { DateTime } from '../components/DateTime';
import Global from "./Global";

import './App.css'

export default function App() {

  const stateEnum = { Connected: 'Connected', Disconnected: 'Disconnected'};

  const [plcs, setPlcs] = useState([]);
  const[tagValue, setTagValue] = useState("");
  const[programValue, setProgramValue] = useState("");
  const [tagNames, setTagNames] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [backendConnectState, setbackendConnectState] = useState([stateEnum.Disconnected]);
  const [plcConnectState, setPlcConnectState] = useState([stateEnum.Disconnected]);

  useEffect(() => {
    getPLC();
  }, []);

function setBackendStateToDisconnected(){
  setbackendConnectState(stateEnum.Disconnected);
  setPlcConnectState(stateEnum.Disconnected);
}

function setBackendStateToConnected(){
  setbackendConnectState(stateEnum.Connected);
}

function setPlcStateToDisconnected(){
  setPlcConnectState(stateEnum.Disconnected);
}

function setPlcStateToConnected(){
  setPlcConnectState(stateEnum.Connected);
}

function getPLC() {
    axios.get(Global.baseUrl)
      .then(plcResponse => {
        setPlcs(plcResponse.data);
        setbackendConnectState(stateEnum.Connected);
        
        axios.get(Global.baseUrl + '/v1/plcProgramsList')
          .then(programsResponse => {
            setPrograms(programsResponse.data);

            axios.get(Global.baseUrl + '/v1/plcTagslist')
              .then(response => {
                setPlcConnectState(stateEnum.Connected);
                setTagNames(response.data);
              })
              .catch(() => {
                setPlcConnectState(stateEnum.Disconnected);
            }); 
          })
          .catch(() => {
            setPlcConnectState(stateEnum.Disconnected);
        });

    })
    .catch(error => {
        console.error(error);
        setbackendConnectState(stateEnum.Disconnected);
    });
}

  return (
    <section>
      <div><label>Backend: </label><label style={{ color: `${checkColor(backendConnectState)}` }}>{backendConnectState}</label>
      <label>  PLC: </label><label style={{ color: `${checkColor(plcConnectState)}` }}>{plcConnectState}</label></div>
      <DateTime/>
      <ul>
        {
          <div>
            <div>
              DeviceID: {plcs[1]} | IP adress: {plcs[3]} | Revision: {plcs[4]} | ProductName: {plcs[2]} <button onClick={saveExcel}>Save to excel</button>
            </div>
            <div className='inputWithButton'>
              <label>Program name:</label>
              <select onChange={onProgramChange}>
                <option value=''></option>
                {
                programs && programs.map((program, index) => {
                    return <option key={index}>
                      {program}
                    </option>
                  })
                }
              </select>
            </div>
            <div className='inputWithButton'>
                <label>Tag name:</label>
                <select onChange={(e) => {setTagValue(e.target.value)}}>
                  {
                  tagNames && tagNames.map((option, index) => {
                      return <option key={index}>
                        {option.TagName}
                      </option>
                    })
                  }
                </select>

                <button onClick={addTag}>ADD</button>
                <button onClick={deleteTag}>DEL</button>
            </div>
          </div>
        }
      </ul>
      <Tags key={plcs[1]} plcID={plcs[1]} stateChangerToDisconnect={setBackendStateToDisconnected} stateChangerToConnect={setBackendStateToConnected}/>
      <Ping stateChangerToDisconnect={setPlcStateToDisconnected} stateChangerToConnect={setPlcStateToConnected}/>
    </section>
  )

  function checkColor(state){
    if (state == stateEnum.Connected) {
      return "#04AA6D";
    } else {
      return "#f44336";
    }
  }

  function onProgramChange(event){
    setProgramValue(event.target.value)

    if (event.target.value.trim() == "") {
      axios.get(Global.baseUrl + '/v1/plcTagslist')
        .then(response => {
          setTagNames(response.data);
        })
        .catch(() => {
          setPlcConnectState(stateEnum.Disconnected);
        });
    } else {
      axios.get(Global.baseUrl + '/v1/plcProgramTagList/' + event.target.value)
      .then(response => {
        setTagNames(response.data);
      })
      .catch(() => {
        setPlcConnectState(stateEnum.Disconnected);
      });
    }
  }

  function deleteTag() {
    axios.delete(Global.baseUrl + "/v1/deleteTag/" + tagValue)
      .then();
  }

  function addTag() {
    const tag = { tag_name: tagValue, plc_id:  plcs.DeviceID};
    axios.post(Global.baseUrl + "/v1/addtag", tag)
      .then();
  }

  function saveExcel() {
    axios.get(Global.baseUrl + "/v1/saveToExcel", {
      method: 'GET',
      responseType: 'blob', // important
    })
          .then(response => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', "plc_" + plcs[1] + "_" + `${Date.now()}.xlsx`);
            document.body.appendChild(link);
            link.click();
          })
          .catch(error => {
            console.error(error);
          });
  }
};
