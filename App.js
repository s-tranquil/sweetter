import React, { Component } from 'react';
import { Text, ScrollView } from "react-native";
// import { Text, Screen, NavigationBar, ListView, View, ImageBackground, Divider, Tile, Title, Subtitle } from '@shoutem/ui';
import request from "superagent";
import { consumerKey, consumerSecretKey } from "./tokens";
import { Base64 } from "js-base64";

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: "not fetched",
            tweets: [{
                text: "получала зарплату",
                user: { name: "Пупа" }
            }, {
                text: "за меня",
                user: { name: "Лупа" }
            }]
        };
    }

    componentDidMount() {
        const credentials = `${encodeURIComponent(consumerKey)}:${encodeURIComponent(consumerSecretKey)}`;
        const credentialsBase64 = Base64.btoa(credentials);


        request
            .post('https://api.twitter.com/oauth2/token')
            .send({ grant_type: "client_credentials" }) // sends a JSON post body
            .set("Authorization", `Basic ${credentialsBase64}`)
            .set("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8")
            .set("accept-encoding", "")
            .end((err, res) => {
                const accessToken = JSON.parse(res.text).access_token;
                this.setState({data: accessToken}, () => this.getTweets(accessToken));
            });
    }

    getTweets(bearerToken) {
        request
            .get('https://api.twitter.com/1.1/statuses/user_timeline.json?count=10&screen_name=twitterapi')
            .set("Authorization", `Bearer ${bearerToken}`)
            .set("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8")
            .set("accept-encoding", "")
            .end((err, res) => {
                this.setState({tweets: JSON.parse(res.xhr.response)});
            });
    }


    render() {
        const { tweets } = this.state;

        return(
            <ScrollView>
                <Text>{"\n\n"}</Text>
                {tweets && tweets.map((x, i) => (
                    <React.Fragment key={i}>
                        <Text style={{fontWeight: "bold"}}>{x.user && x.user.name}</Text>
                        <Text>{x.text}</Text>
                    </React.Fragment>
                ))}
                <Text>{"---------------------------------------"}</Text>
                <Text>{"\n\n"}</Text>
                <Text>{this.state.data}</Text>
            </ScrollView>
        );
    }
}