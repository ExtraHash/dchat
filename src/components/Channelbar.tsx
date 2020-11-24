import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHashtag, faKey } from "@fortawesome/free-solid-svg-icons";
import { IChannel } from "libvex";
import { ContextMenuTrigger, ContextMenu, MenuItem } from "react-contextmenu";
import { Link } from "react-router-dom";

type Props = {
    closeModal: () => void;
    openModal: (el: JSX.Element) => void;
    channelList: IChannel[];
    match: any;
    unreadMessageCounts: Record<string, number>;
};

type State = {};

export class Channelbar extends Component<Props, State> {
    state: State;

    constructor(props: Props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <aside className="menu">
                <p className="menu-label">
                    <span className="menu-title-wrapper">Channels</span>
                    <span className="icon-group"></span>
                </p>
                <ul className="menu-list">
                    {this.props.channelList.map((channel) => (
                        <div key={"channel-list-" + channel.channelID}>
                            <ContextMenuTrigger
                                id={"channel-list-trigger-" + channel.channelID}
                            >
                                <li className="channel-list-item">
                                    <Link
                                        className={`channel-list-link ${
                                            channel.channelID ===
                                            this.props.match.params.id
                                                ? "is-active"
                                                : ""
                                        }`}
                                        to={"/channel/" + channel.channelID}
                                    >
                                        <FontAwesomeIcon
                                            icon={
                                                channel.public
                                                    ? faHashtag
                                                    : faKey
                                            }
                                        />
                                        &nbsp;&nbsp;
                                        <strong>{channel.name}</strong>
                                        {this.props.unreadMessageCounts[
                                            channel.channelID
                                        ] > 0 && (
                                            <span className="unread-icon is-family-monospace has-text-weight-bold">
                                                {
                                                    this.props
                                                        .unreadMessageCounts[
                                                        channel.channelID
                                                    ]
                                                }
                                            </span>
                                        )}
                                    </Link>
                                </li>
                            </ContextMenuTrigger>
                            <ContextMenu
                                id={"channel-list-trigger-" + channel.channelID}
                            >
                                <MenuItem>
                                    <p>Permissions</p>
                                </MenuItem>
                                <MenuItem divider />
                                <MenuItem data={channel}>Channel Info</MenuItem>
                            </ContextMenu>
                        </div>
                    ))}
                </ul>
            </aside>
        );
    }
}
