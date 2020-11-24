/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
import { IUser } from "libvex";

type Props = {
    onlineLists: Record<string, IUser[]>;
    match: any;
    changeNickname: () => void;
    openModal: (el: JSX.Element) => void;
    closeModal: () => void;
};

type State = {};

export class OnlineUserbar extends Component<Props, State> {
    state: State;

    constructor(props: Props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <aside className="menu">
                <p className="menu-label">Online</p>
                <ul className="menu-list"></ul>
            </aside>
        );
    }
}
