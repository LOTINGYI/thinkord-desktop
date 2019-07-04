import React, { Component } from 'react';
import ControlBarButton from '../components/ControlBarButton'
import './css/ControlBar.css';

import { NoteManager } from '../renderer/note-manager';
import { notePath } from '../components/ControlBarMain';

import OKButton from '../asset/check.png';
import CancelButton from '../asset/remove.png';

const { ipcRenderer } = require('electron');

export class TextWindow extends Component {
    constructor(props) {
        super(props);

        this.myRef = React.createRef();
        this.handleOK = this.handleOK.bind(this);
    }

    state = {
        textwindow_value: "",
        textwindow_button: [
            { id: "ok", src: OKButton },
            { id: "cancel", src: CancelButton }
        ]
    }

    handleOK = () => {
        const noteManager = new NoteManager();
        const textarea = this.myRef.current;

        noteManager.addBlock(notePath, {"text": textarea.value});

        ipcRenderer.send('ok-click');
    }

    handleCancel = () => {
        ipcRenderer.send('cancel-click');
    }

    render() {
        return (
            <div className="textdiv">
                <label>Add your annotation:</label>
                <br />
                <textarea
                    rows="2"
                    cols="30"
                    value={this.state.textwindow_value}
                    ref={this.myRef}
                    placeholder="Enter some thoughts here ..."
                    onChange={(event) => {
                        this.setState({
                            textwindow_value: event.target.value
                        });
                    }}
                ></textarea>
                <div className="textbtndiv">
                    {this.state.textwindow_button.map(button =>
                        <ControlBarButton
                            key={button.id}
                            button={button}
                            onOK={this.handleOK}
                            onCancel={this.handleCancel}
                        />)}
                </div>
            </div>
        )
    }
}

export default TextWindow;