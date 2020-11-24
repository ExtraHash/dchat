/* eslint-disable jsx-a11y/anchor-is-valid */

import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Swipeable } from "react-swipeable";
import { isImageType } from "../constants/mimeTypes";
import { EventEmitter } from "events";
import { ChatInput } from "../components/ChatInput";
import { Topbar } from "../components/Topbar";
import { Channelbar } from "../components/Channelbar";
import { ChatWindow } from "../components/ChatWindow";
import { desktop, tablet } from "../constants/responsiveness";
import { chatWindowSize } from "../utils/chatWindowSize";
import { OnlineUserbar } from "../components/OnlineUserbar";
import { Userbar } from "../components/Userbar";
import { Utils, IChannel, IUser } from "libvex";

export const imageLoadMonitor = new EventEmitter();

type State = {
    leftBarAnimation: string;
    rightBarAnimation: string;
    inputValue: string;
    modalIsActive: boolean;
    modalContents: JSX.Element;
    joinedRooms: string[];
    channelList: IChannel[];
    viewportWidth: number;
    viewportHeight: number;
    widthHistory: number[];
    leftBarOpen: boolean;
    redirect: string | null;
    rightBarOpen: boolean;
    leftBarClosing: boolean;
    rightBarClosing: boolean;
    scrollLock: boolean;
    initialLoad: boolean;
    unreadMessageCounts: Record<string, number>;
    userInfo: IUser | null;
    onlineLists: Record<string, IUser[]>;
};

type Props = {
    match: any;
};

export class Chat extends Component<Props, State> {
    currentChannel = "";
    imagesLoaded: HTMLSpanElement[];
    messagesEnd: any = React.createRef();

    constructor(props: Props) {
        super(props);
        this.state = {
            inputValue: "",
            leftBarAnimation: "",
            rightBarAnimation: "",
            modalIsActive: false,
            scrollLock: true,
            modalContents: <span />,
            joinedRooms: [],
            redirect: null,
            viewportWidth: window.innerWidth,
            viewportHeight: window.innerHeight,
            widthHistory: [window.innerWidth],
            leftBarOpen: window.innerWidth > tablet,
            rightBarOpen: window.innerWidth > desktop,
            rightBarClosing: false,
            leftBarClosing: false,
            initialLoad: true,
            unreadMessageCounts: {},
            channelList: [],
            userInfo: null,
            onlineLists: {},
        };
        this.imagesLoaded = [];
        this.scrollToBottom = this.scrollToBottom.bind(this);
        this.changeNickname = this.changeNickname.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.openRightBar = this.openRightBar.bind(this);
        this.closeRightBar = this.closeRightBar.bind(this);
        this.toggleRightBar = this.toggleRightBar.bind(this);
        this.openLeftBar = this.openLeftBar.bind(this);
        this.closeLeftBar = this.closeLeftBar.bind(this);
        this.toggleLeftBar = this.toggleLeftBar.bind(this);
        this.pasteHandler = this.pasteHandler.bind(this);
        this.setScrollLock = this.setScrollLock.bind(this);
        this.setMessagesEnd = this.setMessagesEnd.bind(this);
    }

    setMessagesEnd(ref: any) {
        this.messagesEnd = ref;
    }

    toggleRightBar() {
        if (this.state.rightBarOpen) {
            this.closeRightBar();
        } else {
            this.openRightBar();
        }
    }

    toggleLeftBar() {
        if (this.state.leftBarOpen) {
            this.closeLeftBar();
        } else {
            this.openLeftBar();
        }
    }

    pasteHandler(e: any) {
        if (e.clipboardData) {
            var items = e.clipboardData.items;

            if (items) {
                for (var i = 0; i < items.length; i++) {
                    if (isImageType(items[i].type)) {
                        // upload image
                    }
                }
            }
        }
    }

    updateWindowDimensions() {
        const { innerWidth, innerHeight } = window;
        const { widthHistory } = this.state;

        // leftBarOpen: window.innerWidth > tablet,
        // rightBarOpen: window.innerWidth > desktop,

        if (widthHistory[0] <= tablet && innerWidth > tablet) {
            this.openLeftBar();
        }

        if (widthHistory[0] >= tablet && innerWidth < tablet) {
            this.closeLeftBar();
        }

        if (widthHistory[0] <= desktop && innerWidth > desktop) {
            this.openRightBar();
        }

        if (widthHistory[0] >= desktop && innerWidth < desktop) {
            this.closeRightBar();
        }

        widthHistory.unshift(innerWidth);
        if (widthHistory.length > 100) {
            widthHistory.pop();
        }

        this.setState({
            viewportWidth: innerWidth,
            viewportHeight: innerHeight,
            widthHistory,
        });
    }

    componentDidMount() {
        if (
            !this.props.match.params.id &&
            !this.props.match.params.resourceType &&
            localStorage.getItem("currentChannel")
        ) {
            this.setState({
                redirect: `/channel/${localStorage.getItem("currentChannel")!}`,
            });
        }

        imageLoadMonitor.on("imageLoad", (ref) => {
            this.imagesLoaded.push(ref);
            if (!this.state.initialLoad) {
                return;
            }

            if (
                document
                    .getElementById("chat-window")
                    ?.getElementsByClassName("chat-image-wrapper").length ===
                this.imagesLoaded.length
            ) {
                this.scrollToBottom();
                this.setState({
                    initialLoad: false,
                });
            }
        });

        if (this.props.match.params.id) {
            this.currentChannel = this.props.match.params.id;
            localStorage.setItem("currentChannel", this.props.match.params.id);
        }
        window.addEventListener("resize", this.updateWindowDimensions);
        window.addEventListener("paste", this.pasteHandler);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateWindowDimensions);
    }

    async componentDidUpdate() {
        if (this.state.scrollLock) {
            this.scrollToBottom();
        }
    }

    setScrollLock(state: boolean) {
        this.setState({
            scrollLock: state,
        });
    }

    scrollToBottom = () => {
        document.getElementById("messagesEnd")?.scrollIntoView();
    };

    changeNickname() {
        let inputRef: any = React.createRef();
        const nicknameChanger = (
            <form
                onSubmit={async (event) => {
                    event.preventDefault();
                    if (inputRef.value === "") {
                        return;
                    }
                    this.closeModal();
                    // nick function here
                }}
            >
                <p className="has-text-white">CHANGE NICKNAME</p>
                <br />
                <input
                    autoFocus
                    ref={(ref) => (inputRef = ref)}
                    placeholder={"Enter new nickname..."}
                    className={`input`}
                ></input>
                <div className="modal-bottom-strip has-text-right">
                    <button className="button is-black" type="submit">
                        Save
                    </button>
                </div>
            </form>
        );
        this.openModal(nicknameChanger);
    }

    openModal(el: JSX.Element) {
        this.setState({
            modalIsActive: true,
            modalContents: (
                <div className="modal-wrapper slide-in-bck-center">{el}</div>
            ),
        });
    }

    closeModal() {
        this.setState({
            modalIsActive: false,
            modalContents: <span />,
        });
    }

    closeRightBar() {
        this.setState(
            {
                rightBarAnimation: "slide-out-right",
                rightBarClosing: true,
            },
            async () => {
                await Utils.sleep(500);
                this.setState({
                    rightBarOpen: false,
                    rightBarAnimation: "",
                    rightBarClosing: false,
                });
            }
        );
    }

    openRightBar() {
        this.setState(
            {
                rightBarAnimation: "slide-in-right",
                rightBarOpen: true,
            },
            async () => {
                await Utils.sleep(500);
                this.setState({
                    rightBarAnimation: "",
                });
            }
        );
    }

    closeLeftBar() {
        this.setState(
            {
                leftBarAnimation: "slide-out-left",
                leftBarClosing: true,
            },
            async () => {
                await Utils.sleep(500);
                this.setState({
                    leftBarOpen: false,
                    leftBarAnimation: "",
                    leftBarClosing: false,
                });
            }
        );
    }

    openLeftBar() {
        this.setState(
            {
                leftBarAnimation: "slide-in-left",
                leftBarOpen: true,
            },
            async () => {
                await Utils.sleep(500);
                this.setState({
                    leftBarAnimation: "",
                });
            }
        );
    }

    render() {
        const redirectPath = this.state.redirect;
        if (redirectPath) {
            this.setState({
                redirect: null,
            });

            return <Redirect to={redirectPath} />;
        }

        return (
            <div
                onKeyDown={(event) => {
                    if (event.key === "Escape" && this.state.modalIsActive) {
                        this.closeModal();
                    }
                }}
            >
                <Swipeable
                    onSwipedRight={(eventData) => {
                        if (!this.state.leftBarOpen) {
                            this.openLeftBar();
                        }
                    }}
                >
                    {" "}
                    <div className="swipe-anchor-left" />
                </Swipeable>

                <Swipeable
                    onSwipedLeft={(eventData) => {
                        if (!this.state.rightBarOpen) {
                            this.openRightBar();
                        }
                    }}
                >
                    {" "}
                    <div className="swipe-anchor-right" />
                </Swipeable>

                <div
                    className={`modal ${
                        this.state.modalIsActive ? "is-active" : ""
                    } is-clipped`}
                >
                    <div
                        className="modal-background image-preview-background"
                        onClick={this.closeModal}
                    ></div>
                    <div className="modal-content">
                        <div className="box has-background-black modal-window">
                            {this.state.modalContents &&
                                this.state.modalContents}
                        </div>
                    </div>
                    <button
                        className="modal-close is-large"
                        aria-label="close"
                        onClick={() => {
                            this.setState({
                                modalIsActive: false,
                            });
                        }}
                    />
                </div>

                <div className="top-bar">
                    <Topbar
                        toggleLeftBar={this.toggleLeftBar}
                        toggleRightBar={this.toggleRightBar}
                        leftBarClosing={this.state.leftBarClosing}
                        channelList={this.state.channelList}
                        leftBarOpen={this.state.leftBarOpen}
                        rightBarClosing={this.state.rightBarClosing}
                        rightBarOpen={this.state.rightBarOpen}
                        match={this.props.match}
                    />
                </div>

                <Swipeable
                    onSwipedLeft={(eventData) => {
                        this.closeLeftBar();
                    }}
                >
                    <div
                        id="channelBar"
                        className={`${
                            this.state.leftBarAnimation
                        } left-channelbar has-background-black-bis ${
                            this.state.leftBarOpen ? "" : "hidden"
                        }`}
                    >
                        <Channelbar
                            closeModal={this.closeModal}
                            openModal={this.openModal}
                            channelList={this.state.channelList}
                            match={this.props.match}
                            unreadMessageCounts={this.state.unreadMessageCounts}
                        />

                        <Userbar
                            userInfo={this.state.userInfo}
                            openModal={this.openModal}
                            closeModal={this.closeModal}
                            closeLeftBar={this.closeLeftBar}
                            viewportWidth={this.state.viewportWidth}
                            changeNickname={this.changeNickname}
                        />
                    </div>
                </Swipeable>
                <div className="chat-window-wrapper">
                    <ChatWindow
                        match={this.props.match}
                        leftBarOpen={this.state.leftBarOpen}
                        rightBarOpen={this.state.rightBarOpen}
                        viewportWidth={this.state.viewportWidth}
                        scrollLock={this.state.scrollLock}
                        openModal={this.openModal}
                        closeModal={this.closeModal}
                        scrollToBottom={this.scrollToBottom}
                        changeNickname={this.changeNickname}
                        setScrollLock={this.setScrollLock}
                    />
                </div>
                <div
                    className={`${chatWindowSize(
                        this.state.leftBarOpen,
                        this.state.rightBarOpen,
                        this.state.viewportWidth
                    )} bottom-bar has-background-black-ter`}
                >
                    <ChatInput
                        scrollLock={this.state.scrollLock}
                        scrollToBottom={this.scrollToBottom}
                        match={this.props.match}
                        setEmojiList={() => {}}
                    />
                </div>
                <Swipeable
                    onSwipedRight={(eventData) => {
                        this.closeRightBar();
                    }}
                >
                    <div
                        id="onlineUserBar"
                        className={`${
                            this.state.rightBarAnimation
                        } right-sidebar has-background-black-bis ${
                            this.state.rightBarOpen ? "" : "hidden"
                        }`}
                    >
                        <OnlineUserbar
                            onlineLists={this.state.onlineLists}
                            changeNickname={this.changeNickname}
                            openModal={this.openModal}
                            closeModal={this.closeModal}
                            match={this.props.match}
                        />
                    </div>
                </Swipeable>
            </div>
        );
    }
}
