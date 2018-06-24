import React, { Component } from 'react';
import { Text, ListView, StyleSheet, ListViewDataSource, View } from "react-native";
// import { Text, Screen, NavigationBar, ListView, View, ImageBackground, Divider, Tile, Title, Subtitle } from '@shoutem/ui';
import request from "superagent";
import { consumerKey, consumerSecretKey } from "./tokens";
import { Base64 } from "js-base64";

interface AppState {
    data: any[],
    tweets: ListViewDataSource,
    lastId: string | undefined,
    bearerToken: string | null
}

export default class App extends Component<{}, AppState> {
    state = {
        data: [],
        tweets: new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        }),
        lastId: undefined,
        bearerToken: null 
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
                        tweets: prevState.tweets.cloneWithRows(data),
                        lastId: json[json.length - 1].id_str
                    };
                });
            });
    }
    
    renderRow(tweet: any) { 
        return (
            <>
                <Text style={{fontWeight: "bold"}}>{tweet.user && tweet.user.name}</Text>
                <Text>{tweet.created_at}</Text>
                <Text>{tweet.text}</Text>
            </>
        );
    }

    render() {
        const { tweets } = this.state;

        return(
            <View style={styles.container}>
                <ListView
                    dataSource={tweets}
                    renderRow={this.renderRow}
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
    },  
});