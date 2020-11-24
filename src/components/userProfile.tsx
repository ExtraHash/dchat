/* eslint-disable jsx-a11y/anchor-is-valid */

import React from "react";
import defaultAvatar from "../images/default_avatar.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCrown,
    faPoo,
    faFileUpload,
} from "@fortawesome/free-solid-svg-icons";
import { IUser } from "libvex";
import { isImageType } from "../constants/mimeTypes";

export const getAvatar = () => {
    return (
        <img
            className="is-rounded"
            alt="user avatar"
            style={{
                backgroundColor: "green",
            }}
            src={defaultAvatar}
        />
    );
};

export const getUserIcon = (powerLevel: number) => {
    if (powerLevel === 100)
        return (
            <span className="role-icon has-text-warning">
                <FontAwesomeIcon icon={faCrown} />
            </span>
        );

    if (powerLevel >= 50 && powerLevel < 100)
        return (
            <span className="role-icon has-text-grey">
                <FontAwesomeIcon icon={faCrown} />
            </span>
        );

    if (powerLevel >= 25 && powerLevel < 50)
        return (
            <span className="role-icon has-text-brown">
                <FontAwesomeIcon icon={faPoo} />
            </span>
        );
    return null;
};

export const userProfile = async (
    user: IUser,
    closeModal: () => void,
    openModal: (el: JSX.Element) => void,
    changeNickname: () => void
) => {
    let avatarUploadRef: HTMLInputElement | null = null;
    return (
        <article className="media profile-modal has-background-black">
            <figure className="media-left">
                <p className="image is-64x64">
                    {getAvatar()}{" "}
                    <span
                        className="avatar-upload-button"
                        onClick={() => {
                            avatarUploadRef?.click();
                        }}
                    >
                        <FontAwesomeIcon icon={faFileUpload} />
                    </span>
                </p>
                <input
                    id="keyFileUpload"
                    type="file"
                    ref={(ref) => (avatarUploadRef = ref)}
                    style={{ display: "none" }}
                    onChange={(fileEvent) => {
                        fileEvent.persist();
                        if (fileEvent.target.files) {
                            if (!isImageType(fileEvent.target.files[0].type)) {
                                document.getElementById(
                                    "error-message"
                                )!.innerHTML =
                                    "ERROR: You can only use an image file as an avatar.";

                                return;
                            }
                            const reader = new FileReader();
                            console.log(user.userID);
                            reader.onload = async (loadEvent) => {
                                const file = loadEvent.target?.result;
                                if (file) {
                                    const view = new Uint8Array(
                                        file as ArrayBuffer
                                    );
                                    console.log(view);

                                    closeModal();
                                }
                            };
                            reader.onerror = (error) => {
                                throw error;
                            };
                            reader.readAsArrayBuffer(fileEvent.target.files[0]);
                        }
                    }}
                />
            </figure>
            <div className="media-content">
                <div className="content">
                    <p
                        className="has-text-weight-bold is-size-3 profile-username"
                        style={{ color: (user as any).color }}
                    >
                        <span>
                            username
                            <span className="translucent">#{"3457"}</span>
                        </span>
                        &nbsp;&nbsp;
                    </p>
                    <p className="has-text-white is-family-monospace is-size-7">
                        Public Key <br />
                    </p>

                    <p className="has-text-white is-family-monospace is-size-7">
                        User ID <br />
                    </p>

                    <p className="has-text-white is-family-monospace is-size-7">
                        Power Level <br />
                    </p>
                    <br />
                </div>
            </div>
            <div className="media-right"></div>
        </article>
    );
};
