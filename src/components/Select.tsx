import React, { Component } from "react";
import AsyncSelect from "react-select/async";
import { IChannel } from "libvex";

type State = {
    inputValue: string;
};

type SelectOptions = {
    label: string;
    value: string;
};

type Props = {
    onChange: any;
};

const filterChannels = (inputValue: string, channels: SelectOptions[]) => {
    return channels.filter((i) =>
        i.label.toLowerCase().includes(inputValue.toLowerCase())
    );
};

const createSelectOptions = (channels: IChannel[]): SelectOptions[] => {
    return channels
        .filter((channel) => channel.public === false)
        .map((channel) => {
            return {
                value: channel.channelID,
                label: channel.name,
            };
        });
};

const promiseOptions = (inputValue: string) =>
    new Promise(async (resolve, reject) => {});

export class MultiSelect extends Component<Props, State> {
    state = { inputValue: "" };
    handleInputChange = (newValue: string) => {
        const inputValue = newValue.replace(/\W/g, "");
        this.setState({ inputValue });
        return inputValue;
    };
    render() {
        return (
            <AsyncSelect
                isMulti
                cacheOptions
                defaultOptions
                onChange={this.props.onChange}
                placeholder="Enter channel name..."
                className="channel-finder"
                classNamePrefix="channel-finder"
                loadOptions={promiseOptions}
            />
        );
    }
}
