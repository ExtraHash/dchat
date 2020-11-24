import React, { Component } from "react";
import Dropzone from "react-dropzone";
import { faArrowCircleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { chatWindowSize } from "../utils/chatWindowSize";
import { ws } from "..";
import { getAvatar } from "./userProfile";
import ax from "axios";

export type Message = {
    type: string;
    id: string;
    text: any;
    file: File;
    time: string;
    username: string;
};

type Props = {
    match: any;
    leftBarOpen: boolean;
    rightBarOpen: boolean;
    viewportWidth: number;
    scrollLock: boolean;
    openModal: (el: JSX.Element) => void;
    closeModal: () => void;
    scrollToBottom: () => void;
    changeNickname: () => void;
    setScrollLock: (state: boolean) => void;
};

type State = {
    chatHistory: Message[];
};

export class ChatWindow extends Component<Props, State> {
    state: State;

    constructor(props: Props) {
        super(props);
        this.state = {
            chatHistory: [],
        };
        this.incoming = this.incoming.bind(this);
    }

    componentDidMount() {
        ws.onmessage = this.incoming;
    }

    componentDidUpdate() {
        if (this.props.scrollLock) {
            this.props.scrollToBottom();
        }
    }

    async incoming(event: any) {
        const blob = event.data;
        let msg: Message;

        const data = await blob.text();
        console.log();

        try {
            msg = JSON.parse(data);
            console.log(msg);
            switch (msg.type) {
                case "message":
                    const chatHistory = this.state.chatHistory;
                    chatHistory.push(msg);
                    this.setState(
                        {
                            chatHistory,
                        },
                        () => {
                            console.log(this.state.chatHistory);
                        }
                    );
                    break;
            }
        } catch (err) {
            console.error(err);
            return;
        }
    }

    render() {
        return (
            <Dropzone
                onDrop={async (acceptedFiles) => {
                    if (acceptedFiles) {
                        const formData = new FormData();
            
                        let totalSize = 0;
                        for (let i = 0; i < acceptedFiles.length; i++) {
                            formData.append("file", acceptedFiles[i], acceptedFiles[i].name);
                            totalSize += acceptedFiles[i].size;
                        }
                        if (totalSize > 1048576) {
                            console.warn("File is too big.");
                            return;
                        }
            
                        await ax.post(
                            "http://" + process.env.REACT_APP_API_URL + "/file",
                            formData
                        );
                    }
                }}
            >
                {({ getRootProps, getInputProps }) => (
                    <section>
                        <div {...getRootProps()}>
                            <div
                                id="chat-window"
                                className={`${chatWindowSize(
                                    this.props.leftBarOpen,
                                    this.props.rightBarOpen,
                                    this.props.viewportWidth
                                )} chat-window has-background-black-ter`}
                                onScroll={(event) => {
                                    const chatWindowHeight = (event.target as HTMLInputElement)
                                        .offsetHeight;
                                    const scrollHeight = (event.target as HTMLInputElement)
                                        .scrollHeight;
                                    const scrollTop = (event.target as HTMLInputElement)
                                        .scrollTop;
                                    const vScrollPosition =
                                        scrollHeight -
                                        (scrollTop + chatWindowHeight);

                                    if (vScrollPosition === 0) {
                                        this.props.setScrollLock(true);
                                    }

                                    if (vScrollPosition > 150) {
                                        this.props.setScrollLock(false);
                                    }
                                }}
                            >
                                {!this.props.scrollLock && (
                                    <div className="chat-window-snap-to-bottom">
                                        <FontAwesomeIcon
                                            icon={faArrowCircleDown}
                                            onClick={() => {
                                                this.props.setScrollLock(true);
                                                this.props.scrollToBottom();
                                            }}
                                        />
                                    </div>
                                )}

                                <div className="chat-message-wrapper">
                                    {this.state.chatHistory.map((message) => {
                                        return (
                                            <article
                                                className="media chat-message"
                                                key={
                                                    "chat-message-block-" +
                                                    message.id
                                                }
                                            >
                                                <figure className="media-left">
                                                    <p className="image is-48x48">
                                                        {getAvatar()}
                                                    </p>
                                                </figure>
                                                <div className="media-content">
                                                    <div>
                                                        <span className="message-username has-text-weight-bold">
                                                            {message.username}
                                                            <span className="translucent">
                                                                #0000
                                                            </span>
                                                        </span>{" "}
                                                        <small>
                                                            {new Date(
                                                                message.time
                                                            ).toLocaleTimeString()}
                                                        </small>
                                                        <br />
                                                        {message.text}
                                                    </div>
                                                </div>
                                                <div className="media-right"></div>
                                            </article>
                                        );
                                    })}
                                    <div
                                        id={"messagesEnd"}
                                        style={{ float: "left", clear: "both" }}
                                    />
                                </div>
                            </div>
                        </div>
                    </section>
                )}
            </Dropzone>
        );
    }
}
