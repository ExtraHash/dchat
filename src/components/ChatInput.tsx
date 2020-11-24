import React, { Component, Fragment } from "react";
import { IEmoji } from "libvex";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperclip } from "@fortawesome/free-solid-svg-icons";
import { v4 as uuidv4 } from "uuid";
import { ws } from "..";
import ax from "axios";

type Props = {
    scrollLock: boolean;
    scrollToBottom: () => void;
    match: any;
    setEmojiList: (emojis: IEmoji[]) => void;
};

type State = {
    inputValue: string;
};

export class ChatInput extends Component<Props, State> {
    state: State;

    constructor(props: Props) {
        super(props);
        this.state = {
            inputValue: "",
        };
    }

    render() {
        let fileUploadRef: HTMLInputElement | null;

        return (
            <Fragment>
                <div
                    className="chat-input-wrapper has-background-grey-darker"
                    onFocus={() => {
                        if (this.props.scrollLock) {
                            this.props.scrollToBottom();
                        }
                    }}
                >
                    <input
                        type="file"
                        style={{ display: "none" }}
                        ref={(ref) => (fileUploadRef = ref)}
                        onChange={async (fileEvent) => {
                            const acceptedFiles = fileEvent.target.files;
                            if (acceptedFiles) {
                                const formData = new FormData();

                                let totalSize = 0;
                                for (let i = 0; i < acceptedFiles.length; i++) {
                                    formData.append(
                                        "file",
                                        acceptedFiles[i],
                                        acceptedFiles[i].name
                                    );
                                    totalSize += acceptedFiles[i].size;
                                }
                                if (totalSize > 1048576) {
                                    console.warn("File is too big.");
                                    return;
                                }

                                await ax.post(
                                    "https://" +
                                        process.env.REACT_APP_API_URL +
                                        "/file",
                                    formData
                                );
                            }
                        }}
                    />
                    <span
                        className="chat-input-attach-button pointer-cursor"
                        onClick={() => {
                            fileUploadRef?.click();
                        }}
                    >
                        <FontAwesomeIcon icon={faPaperclip} />
                    </span>
                    <textarea
                        className="chat-input"
                        value={this.state.inputValue}
                        onChange={async (event) => {
                            this.setState({
                                inputValue: event.target.value,
                            });
                        }}
                        onKeyPress={async (event) => {
                            event.persist();
                            if (event.key === "Enter" && !event.shiftKey) {
                                event.preventDefault();

                                if (this.state.inputValue.trim() === "") {
                                    return;
                                }
                                ws.send(
                                    JSON.stringify({
                                        type: "message",
                                        text: this.state.inputValue,
                                        id: uuidv4(),
                                        username: "Anonymous",
                                    })
                                );
                                this.setState({
                                    inputValue: "",
                                });
                            }
                        }}
                    />
                </div>
            </Fragment>
        );
    }
}
