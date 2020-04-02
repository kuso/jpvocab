import React from "react";
import { Table } from "react-bootstrap";

function makeRow(count, word) {
    return (
        <tr>
            <td>{count}</td>
            <td>{word.vocab}</td>
            <td>{word.hiragana}</td>
            <td>{word.meaning}</td>
            <td>{word.jlpt}</td>
            <td>{word.wordclass}</td>
        </tr>
    )
}

function csvToDict({csvData}) {
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

const BSWordTable = (csvData) => {

    const makeTable = (words) => {
        var rows = [];
        var count = 1;
        for (var i=0;i<words.length;i++) {
            var row = makeRow(count, words[i]);
            rows.push(row);
            count++;
        }

        return (
            <Table responsive striped bordered hover size="sm" style={{ fontSize:"25px", width:"100%", marginTop:"30px", overflow:"auto" }}>
                <thead>
                <tr>
                    <th>#</th>
                    <th>Vocabulary</th>
                    <th>Reading</th>
                    <th style={{ width:"35%" }}>Meaning</th>
                    <th>JLPT</th>
                    <th>Class</th>
                </tr>
                </thead>
                <tbody>
                {rows}
                </tbody>
            </Table>
        )
    }

    return (
        <>
            {makeTable(csvToDict(csvData))}
        </>
    )
};

export default BSWordTable;