import React, { Component, Fragment } from "react";
import { IUser } from "libvex";
import { getAvatar, userProfile } from "./userProfile";
import { tablet } from "../constants/responsiveness";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";

type Props = {
    userInfo: IUser | null;
    openModal: (el: JSX.Element) => void;
    closeModal: () => void;
    closeLeftBar: () => void;
    viewportWidth: number;
    changeNickname: () => void;
};

type State = {};

export class Userbar extends Component<Props, State> {
    state: State;

    constructor(props: Props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className="user-bar">
                <div className="Aligner">
                    <div className="Aligner-item Aligner-item--top" />
                    <div className="Aligner-item">
                        {this.props.userInfo && (
                            <Fragment>
                                <span className="image is-32x32 user-bar-avatar">
                                    {getAvatar()}
                                </span>
                                <span
                                    className="user-bar-username"
                                    style={{
                                        color: (this.props.userInfo as any)
                                            .color,
                                    }}
                                >
                                    <strong
                                        style={{
                                            color: (this.props.userInfo as any)
                                                .color,
                                        }}
                                    >
                                        {"username"}
                                        <span className="translucent">
                                            #3457
                                        </span>
                                    </strong>
                                    <span className="translucent">
                                        {/* "#" + getUserHexTag(client.info().client!.userID) */}
                                    </span>
                                </span>
                                <span
                                    className="user-bar-cog-wrapper"
                                    onClick={async () => {
                                        this.props.openModal(
                                            await userProfile(
                                                this.props.userInfo!,
                                                this.props.closeModal,
                                                this.props.openModal,
                                                this.props.changeNickname
                                            )
                                        );
                                        if (this.props.viewportWidth < tablet) {
                                            this.props.closeLeftBar();
                                        }
                                    }}
                                >
                                    <FontAwesomeIcon icon={faCog} />
                                </span>
                            </Fragment>
                        )}
                    </div>
                    <div className="Aligner-item Aligner-item--bottom" />
                </div>
            </div>
        );
    }
}
