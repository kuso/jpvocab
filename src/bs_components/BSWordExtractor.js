import React from "react";
import { useState, useEffect } from 'react';
import useAxios from 'axios-hooks'
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import { Button } from "react-bootstrap";
import Tooltip from "react-bootstrap/Tooltip";
import { OverlayTrigger } from "react-bootstrap";
import BSWordTable from "./BSWordTable";

function useInput(initialValue) {
    const [value,setValue] = useState(initialValue);

    function handleChange(e){
        setValue(e.target.value);
    }

    return [value, handleChange];
}

function splitLines(content) {
    var out = [];
    var lines = content.split(";");
    for (var i=0; i<lines.length; i++) {
        out.push(<div style={{padding:"3px"}}>{lines[i]}</div>);
    }
    return out;
}

const NormalToken = (props) => {
    var token = props.token;
    return (
        <OverlayTrigger placement="bottom"
                        overlay={
                            <Tooltip style={{padding:"3px"}} id={`tooltip-jtoken-` + props.id}>
                                <div style={{padding:"5px", background:"black", color:"white"}}>
                                    vocab
                                </div>
                                <div style={{padding:"5px", background:"white", color:"black"}}>
                                    {token.DictForm}
                                </div>

                                <div style={{padding:"5px", background:"black", color:"white"}}>
                                    reading
                                </div>
                                <div style={{padding:"5px", background:"white", color:"black"}}>
                                    {token.DictFormHiragana}
                                </div>

                                <div style={{padding:"5px", background:"black", color:"white"}}>
                                    meaning
                                </div>
                                <div style={{padding:"5px", fontSize:"16px", textAlign:"left", background:"white", color:"black"}}>
                                    {splitLines(token.Meaning)}
                                </div>
                            </Tooltip>
                        }>
          <span className={"blue"}>{ token.Text }</span>
        </OverlayTrigger>
    )
}

const JLPTToken = (props) => {
    var token = props.token;
    return (
        <OverlayTrigger placement="bottom"
                        overlay={
                            <Tooltip style={{padding:"3px"}} id={`tooltip-jtoken-` + props.id}>
                                <div style={{padding:"5px", background:"black", color:"white"}}>
                                    vocab
                                </div>
                                <div style={{padding:"5px", background:"white", color:"black"}}>
                                    {token.DictForm}
                                </div>

                                <div style={{padding:"5px", background:"black", color:"white"}}>
                                    reading
                                </div>
                                <div style={{padding:"5px", background:"white", color:"black"}}>
                                    {token.DictFormHiragana}
                                </div>

                                <div style={{padding:"5px", background:"black", color:"white"}}>
                                    meaning
                                </div>
                                <div style={{padding:"5px", fontSize:"16px", textAlign:"left", background:"white", color:"black"}}>
                                    {splitLines(token.Meaning)}
                                </div>

                                <div style={{padding:"5px", background:"black", color:"white"}}>
                                    JLPT level
                                </div>
                                <div style={{padding:"5px", background:"white", color:"black"}}>
                                    {token.Level}
                                </div>

                                <div style={{padding:"5px", background:"black", color:"white"}}>
                                    word class
                                </div>
                                <div style={{padding:"5px", background:"white", color:"black"}}>
                                    {token.Class}
                                </div>
                            </Tooltip>
                        }>
          <span className={"jlptn"+token.Level}>
              {token.Text}
          </span>
        </OverlayTrigger>
    )
}

function div(inner) {
    return (
        <div style={{ marginTop: "10px" }}>
            {inner}
        </div>
    )
}

const ConvertedText = (data) => {
    var sections = data.sections;
    var out = [];
    var count = 1;
    if (!sections) {
        return (
            <div style={{ marginTop: "15px" }}>
                Please enter some Japanese text...
            </div>
        )
    }
    for (var i=0; i<sections.length; i++) {
        var section = sections[i]
        var sectionOut = []
        for (var j=0; j<section.tokens.length; j++) {
            count = count + 1
            var token = section.tokens[j]
            if (token.Level > 0) {
                sectionOut.push(<JLPTToken id={count} key={count} token={token}/>);
            } else {
                // case not in JLPT vocabs
                if (token.Text !== token.DictFormHiragana && token.DictFormHiragana !== "") {
                    sectionOut.push(<NormalToken id={count} key={count} token={token}/>);
                } else {
                    sectionOut.push(token.Text);
                }
            }
        }
        out.push(div(sectionOut));
    }
    return (
        <div style={{fontSize:"25px", marginTop:"30px"}}>
            {out}
        </div>
    )
}

const BSWordExtractor = () => {
    const [queryText, setQueryText] = useInput("");
    const [myError, setMyError] = useState("");
    const [{ data, loading, error }, executePost] = useAxios({
            url: process.env.REACT_APP_API_DOMAIN + "/v1/job",
            method: 'post',
        },
        { manual: true }
    );

    useEffect(() => {
        if (data && data.sections) {
            console.log(data);
            setMyError("");
        }
        if (error) {
            console.log(error);
            setMyError("error sending requests...");
        }
        return () => {
            // exec before running the effects next time
        }
    }, [data, error, loading]);

    const ExtractVocabs = () => {
        executePost({
            data: {
                queryText: queryText,
            },
            validateStatus: (status) => {
                console.log("response status code, " + status);
                setMyError("error response...");
                return true; // I'm always returning true, you may want to do it depending on the status received
            },
            headers: {'Content-Type':'application/json'}
        });
    };

    return (
        <>
        <Form.Group controlId="textarea1">
            <Form.Label>Please enter some japanese text</Form.Label>
            <Form.Control as="textarea" rows="10" onChange={setQueryText} />
        </Form.Group>
        <Button variant="primary" onClick={()=>{ExtractVocabs()}}>
            Extract Vocabulary
        </Button>
            {loading && <Alert style={{marginTop:"10px"}} variant="success">{"Extracting..."}</Alert>}
            {myError && <Alert style={{marginTop:"10px"}} variant="danger">{myError}</Alert>}
            {data && <ConvertedText sections={data.sections} />}
            {data && data.sections && <BSWordTable csvData={data.csvdata} />}
        </>
    )
};

export default BSWordExtractor;
