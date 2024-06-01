import { useState, useEffect } from 'react'
import axios from 'axios';
import Global from '../src/Global';

export default function Tags(props) {
    const [tags, setTags] = useState([]);

    var heading = ["Name of the tag", "Current/Latest value"];


    useEffect(() => {
        const getTagsData = () => {
            getData()
        }
        getTagsData()
        const interval = setInterval(() => {
            getTagsData()
        }, 10*1000);
        return () => clearInterval(interval);
      },[])
    
    function getData() {
        axios.get(Global.baseUrl + "/v1/getTags")
        .then(response => {
            setTags(response.data);
            props.stateChangerToConnect();
        })
        .catch(error => {
            props.stateChangerToDisconnect();
            console.error(error);
        });
    }

    var response;
    if (tags) {
        response =
            (<section>
                <h3>Tags from the PLC with ID: {props.plcID}</h3>
                {  
                <table>
                    <thead>
                        <tr>
                        {heading.map((head, i) => (
                            <th key={i}>{head}</th>
                        ))}
                        </tr>
                    </thead>
                    <tbody>

                    {   Object.keys(tags).map((keyName, i) => (
                        <tr key={keyName}>
                            <td key={i+1}>{keyName}</td>
                            <td key={i+2}>{tags[keyName]}</td>
                        </tr>
                    ))}
                    </tbody>
                </table> }
            </section>);
    } else {
        response =  (
            <h3>No tags in the list to read. Add the tag name. {tags}</h3>
        );
    }

    return response;
}