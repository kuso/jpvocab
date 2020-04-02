import React from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import BSWordExtractor from "./BSWordExtractor";

class BSApp extends React.Component {
    navbar_style = {
        position: "static",
        top: 0,
        right: 0,
        left: 0,
    };

    content = {
        paddingTop: "10px",
        paddingLeft: "10px",
        paddingRight: "10px",
    }

    render() {
        const { children } = this.props;
        return (
            <React.Fragment>
                <Container style={{ maxWidth:"100%", justifyContent: "center", margin:"0 auto", padding:"0px" }}>
                    <Navbar style={this.navbar_style} collapseOnSelect expand="lg" bg="dark" variant="dark">
                        <Navbar.Brand href="http://jpvocab.com">JPVocab.com</Navbar.Brand>
                    </Navbar>
                    <Container style={this.content}>
                        <BSWordExtractor/>
                        {children}
                    </Container>
                </Container>
            </React.Fragment>
        );
    }
}

export default BSApp;
