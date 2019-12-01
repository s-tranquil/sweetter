import React, { Component } from 'react';
import { Text, FlatList, StyleSheet, ListViewDataSource, View } from "react-native";
// import { Text, Screen, NavigationBar, ListView, View, ImageBackground, Divider, Tile, Title, Subtitle } from '@shoutem/ui';
import request from "superagent";
import { consumerKey, consumerSecretKey } from "./tokens";
import { Base64 } from "js-base64";

interface AppState {
    data: any[],
    lastId: string | undefined,
    bearerToken: string | null,
    text: string
}

export default class App extends Component<{}, AppState> {
    state = {
        data: [],
        lastId: undefined,
        bearerToken: null,
        text: ""
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
            .end((_, res) => {
                const accessToken = JSON.parse(res.text).access_token;
                this.setState({bearerToken: accessToken}, () => this.getTweets());
            });
    }

    getTweets = () => {
        const { bearerToken, lastId } = this.state;

        const queryParams = {
            count: 10,
            screen_name: 'twitterapi',
            max_id: lastId
        };

        request
            .get('https://api.twitter.com/1.1/statuses/user_timeline.json')
            .query(queryParams)
            .set("Authorization", `Bearer ${bearerToken}`)
            .set("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8")
            .set("accept-encoding", "")
            .end((err, res) => {

                const json = JSON.parse(res.xhr.response);
                this.setState((prevState) => {
                    const data = [...prevState.data, ...json];
                    return {
                        data,
                        lastId: json[json.length - 1].id_str
                    };
                });
            });
    }

    renderRow = ({ item: tweet }: { item: any }) => (
        <>
            <Text style={{fontWeight: "bold"}}>{tweet.user && tweet.user.name}</Text>
            <Text>{tweet.created_at}</Text>
            <Text>{tweet.text}</Text>
        </>
    );

    keyExtractor = (_: any, index: number) => index.toString();

    render() {
        const { data, text } = this.state;

        return(
            <View style={styles.container}>
                <Text>{text}</Text>
                <FlatList
                    data={data}
                    renderItem={this.renderRow}
                    keyExtractor={this.keyExtractor}
                    onEndReached={this.getTweets}
                />
            </View>
        );
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#F5FCFF',
        marginTop: 30
    },
});