import React, { useState } from 'react'
import { usePostCallback } from "use-axios-react";
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import ReactTooltip from 'react-tooltip'
import { CSVLink } from "react-csv";
import WordTable from "./WordTable";
import Container from '@material-ui/core/Container';

function useInput(initialValue) {
    const [value,setValue] = useState(initialValue);

    function handleChange(e){
        setValue(e.target.value);
    }

    return [value, handleChange];
}

const NormalToken = (props) => {
    var token = props.token
    return (
        <span>
          <span className={"blue"} data-tip data-for={"id"+props.id}>{ token.Text }</span>
          <ReactTooltip className={"tooltip"} id={"id"+props.id} place="bottom" type="dark" effect="solid">
              { token.DictFormHiragana }{' '}<br/>
              { token.DictForm }{' '}<br/>
              { token.Meaning }{' '}<br/>
          </ReactTooltip>
        </span>
        /*
        <HtmlTooltip
            title={
                <React.Fragment>
                    { token.DictFormHiragana }{' '}<br/>
                    { token.DictForm }{' '}<br/>
                    { token.Meaning }{' '}<br/>
                </React.Fragment>
            }
        >
            <span className={"vocab"} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}><ruby><rb>{token.Text}</rb><rt className={color}>{ token.DictFormHiragana }</rt></ruby></span>
        </HtmlTooltip>

         */
    )
}

const JLPTToken = (props) => {
    var token = props.token
    return (
        <span className={"jlptn"+token.Level}>
          <span data-tip data-for={"id"+props.id}>{ token.Text }</span>
          <ReactTooltip className={"tooltip"} id={"id"+props.id} place="bottom" type="dark" effect="solid">
              N{ token.Level}{' '}<br/>
              { token.DictFormHiragana }{' '}<br/>
              { token.DictForm }{' '}<br/>
              { token.Meaning }{' '}<br/>
              { token.Class }{' '}<br/>
          </ReactTooltip>
        </span>
    )
}

function div(inner) {
    return (
        <div className="mb-3">
            {inner}
        </div>
    )
}

function csvToDict(csvData) {
    let items = csvData.split("\n");
    let words = [];
    for (var i=0; i<items.length; i++) {
        let cols = items[i].split(",")
        if (cols.length === 5) {
            if (cols[0] === "vocabulary") {
                continue
            }
            var entry = {};
            entry.vocab = cols[0];
            entry.hiragana = cols[1];
            entry.meaning = cols[2].replace(/['"]+/g, '');
            entry.jlpt = cols[3];
            entry.wordclass = cols[4];
            words.push(entry);
        }
    }
    return words;
}

const ConvertedText = (data) => {
    var sections = data.sections
    var out = []
    var count = 1
    if (!sections) {
        return (
            <span>Please enter some Japanese text...</span>
        )
    }
    for (var i=0; i<sections.length; i++) {
        var section = sections[i]
        var sectionOut = []
        for (var j=0; j<section.tokens.length; j++) {
            count = count + 1
            var token = section.tokens[j]
            if (token.Level > 0) {
                sectionOut.push(<JLPTToken id={count} key={count} token={token}/>)
            } else {
                // case not in JLPT vocabs
                if (token.Text !== token.DictFormHiragana && token.DictFormHiragana !== "") {
                    sectionOut.push(<NormalToken id={count} key={count} token={token}/>)
                } else {
                    sectionOut.push(token.Text)
                }
            }
        }
        out.push(div(sectionOut))
    }
    return (
        <Box className="converted">{out}</Box>
    )
}

const WordExtractor = () => {
    const [queryText, setQueryText] = useInput("");
    const query = {id: "", querytext: queryText}

    function postQueryRequest({ id, querytext }) {
        return {
            url: process.env.REACT_APP_API_DOMAIN + "/v1/job",
            data: {id, querytext}
        };
    }

    const StatusBar = ({loading, error}) => (
        <span>
            {loading && <span>Loading...</span>}
            {error && <span> Error sending requests...</span>}
        </span>
    );

    const [exec, loading, {error, data}] = usePostCallback(postQueryRequest);
    return (
        <Box my={3}>
            <Typography variant="h3" component="h3" gutterBottom>
                jpvocab.com
            </Typography>
            <Typography variant="h5" component="h5" gutterBottom>
                Extract Japanese Vocabulary From Text
            </Typography>
            <Box my={3}>
                <TextField variant="filled" label="Enter some Japanese text" multiline rows="10" fullWidth value={queryText} onChange={setQueryText}/>
            </Box>
            <Box my={3}>
                <Button variant="contained" onClick={() => exec(query)} color="primary">Extract Vocabulary</Button>
                {data && data.csvdata && <CSVLink data={data.csvdata}>Download vocabulary list in CSV file</CSVLink>}
            </Box>
            <Box my={3}>
                <StatusBar loading={loading} error={error}/>
            </Box>
            {data && <ConvertedText sections={data.sections} />}
            <Container maxWidth="md">
                {data && data.csvdata && csvToDict(data.csvdata) && <WordTable rows={csvToDict(data.csvdata)}/>}
            </Container>
        </Box>
    )
}

export default WordExtractor